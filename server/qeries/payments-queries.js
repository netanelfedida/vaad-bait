
const createTransictionsQuery = `
            insert into transactions (apartment_id, amount, transaction_date, approval_status, payments_method)
            VALUES(?,?, now(), ?, ?)
            `;

const updateTransictionsQuery = `
            UPDATE transactions
            SET approval_status = ?
            WHERE transaction_id = ?
            `;

const getAllFixedPaymentsYearsQuery =`
            SELECT DISTINCT for_year
            FROM fixed_payments
            WHERE apartment_id = ?;
            `;
    
const updateFixedPaymentsFromNowQuery =`
            UPDATE fixed_payments 
            SET apartment_id = ? 
            WHERE apartment_id = ?
            AND ((for_year = ? AND for_month >= ?) 
                OR (for_year > ?))
            `;

const updateSpecialPaymentsFromNowQuery = `
            UPDATE special_payments 
            SET apartment_id = ?
            WHERE apartment_id = ?
            AND ((YEAR(date) = ? AND MONTH(date) >= ?) 
                OR (YEAR(date) > ?))
            `;   

const updateCreditAndDebitPaymentsFromNowQuery = `
            UPDATE credits_and_debits_monthly 
            SET apartment_id = ? 
            WHERE apartment_id = ?
            AND ((for_year = ? AND for_month >= ?) 
                OR (for_year > ?))
            `;       
            
const updatePaymentsDetailsQuery = ` 
            UPDATE fixed_payments
            SET transaction_id = ?,
                reference_number = ?,
                actually_paid = payment_required,
                status = ?,
                date = now()
            WHERE payment_id = ?;
            `;

const updateSpecialPaymentsDetailsQuery = `
                UPDATE special_payments
                SET transaction_id = ? ,
                    status = ?,
                    date = now()
                where payment_id = ?
                `;

const updateCreditsPaymentsDetailsQuery = `
                UPDATE credits_and_debits_monthly
                SET transaction_id = ? ,
                    status = ?,
                    date = now()
                where id = ?
                `;

const getMonthlyPaymentQuery = `
                SELECT b.monthly_payment
                FROM buildings b
                WHERE b.building_id = ?;
                `;

const getAllPendingPaymentsQuery = `     
                    SELECT "fixed_payments" AS type,
                           fp.payment_id as id,
                           fp.apartment_id,
                           u.last_name, 
                           a.apartment_number,
                           fp.description, 
                           fp.actually_paid as amount, 
                           fp.date AS transaction_date, 
                           t.payments_method AS payment_method,
                           t.transaction_id AS reference_number
                    FROM fixed_payments fp
                    JOIN buildings b ON fp.building_id = b.building_id
                    JOIN apartments a ON fp.apartment_id = a.apartment_id
                    JOIN users u ON a.user_id = u.user_id
                    JOIN transactions t ON fp.transaction_id = t.transaction_id
                    WHERE fp.status = 'ממתין לאישור'
                      AND b.building_id = ?
                    UNION ALL
                    SELECT "special_payments" AS type,
                           sp.payment_id as id,
                           sp.apartment_id,
                           u.last_name, 
                           a.apartment_number,
                           sp.description, 
                           sp.amount, 
                           sp.date AS transaction_date, 
                           t.payments_method,
                           t.transaction_id AS reference_number
                    FROM special_payments sp
                    JOIN buildings b ON sp.building_id = b.building_id
                    JOIN apartments a ON sp.apartment_id = a.apartment_id
                    JOIN users u ON a.user_id = u.user_id
                    JOIN transactions t ON sp.transaction_id = t.transaction_id
                    WHERE sp.status = 'ממתין לאישור'
                      AND b.building_id = ?
                      
                     UNION ALL 
                     SELECT 
						   cd.type AS type,
                           cd.id,
						   cd.apartment_id,
                           u.last_name, 
                           a.apartment_number,
                           cd.description, 
                           cd.amount, 
                           cd.date AS transaction_date, 
                           t.payments_method,
                           t.transaction_id AS reference_number
                    FROM credits_and_debits_monthly cd
                    JOIN buildings b ON cd.building_id = b.building_id
                    JOIN apartments a ON cd.apartment_id = a.apartment_id
                    JOIN users u ON a.user_id = u.user_id
                    JOIN transactions t ON cd.transaction_id = t.transaction_id
                    WHERE cd.status = 'ממתין לאישור'
					  AND cd.type = "השלמה"	
                      AND b.building_id = ?
						
                    ORDER BY transaction_date DESC;
                        `;

const getAllPaymentsQuery = `
                        SELECT t.*, u.first_name, u.last_name, a.apartment_number
                        FROM transactions t
                        INNER JOIN apartments a ON t.apartment_id = a.apartment_id
                        INNER JOIN users u ON a.user_id = u.user_id
                        WHERE a.building_id = (SELECT building_id FROM apartments WHERE user_id = ? LIMIT 1)
                        ORDER BY t.transaction_date DESC;
                        `;

const getDetailsListPaymentsQuery = `
                        SELECT transaction_id, amount, description, for_month, for_year
                        FROM payments p
                        INNER JOIN apartments a ON p.apartment_id = a.apartment_id
                        INNER JOIN users u ON a.user_id = u.user_id
                        WHERE p.transaction_id = ?
                        `;

const updateMonthlyPaymentOfBuildingQuery = `
                        UPDATE buildings
                        SET monthly_payment = ?
                        WHERE building_id = ?;
                `;

const addMonthlyPaymentsForNextYearQuery = `
            INSERT INTO fixed_payments (
                transaction_id,
                apartment_id,
                building_id,
                reference_number,
                actually_paid,
                date,
                description,
                for_month,
                for_year,
                status,
                payment_required
            ) VALUES ?
        `;

const isNextYearPaymentsDefinedQuery = `
        SELECT COUNT(*) AS count
        FROM fixed_payments
        WHERE building_id = ? AND for_year = ?;
    `;

const updateRequireFixedPaymentsFromDateQuery = `
                    UPDATE fixed_payments
                    SET payment_required = ?
                    WHERE 
                        building_id = ?
                        AND for_year >= ?
                        AND for_month >= ?
                `;

const getAllFixedPaymentsPaidFromDateQuery = `
                SELECT 
                    fp.apartment_id,
                    fp.for_month,
                    fp.for_year,
                    fp.actually_paid AS fixed_payment_amount,
                    SUM(CASE WHEN cdm.type = 'השלמה' THEN cdm.amount ELSE 0 END) AS total_debits,
                    SUM(CASE WHEN cdm.type = 'זיכוי' THEN cdm.amount ELSE 0 END) AS total_credits
                FROM fixed_payments fp
                LEFT JOIN credits_and_debits_monthly cdm
                    ON fp.apartment_id = cdm.apartment_id
                    AND fp.for_month = cdm.for_month
                    AND fp.for_year = cdm.for_year
                    AND cdm.status != 'לא שולם'
                WHERE fp.status != 'לא שולם'
                  AND (fp.for_year > ? OR (fp.for_year = ? AND fp.for_month >= ?))
                  AND fp.building_id = ?
                GROUP BY fp.apartment_id, fp.for_month, fp.for_year, fp.actually_paid
                ORDER BY fp.apartment_id, fp.for_year, fp.for_month;
                `;

const insertCreditAndDebitPaymentsQuery = `
                        INSERT INTO credits_and_debits_monthly(
                            building_id,
                            apartment_id,
                            transaction_id,
                            type,
                            description,
                            status,
                            amount,
                            for_month,
                            for_year,
                            date
                            ) VALUES ?
            `;

const deleteAllDebitUnpaidByMonthQuery = `
                DELETE FROM credits_and_debits_monthly
                WHERE 
                    for_year = ?
                    AND for_month = ?
                    AND apartment_id = ?
                    AND type = "השלמה"
                    AND status = 'לא שולם';
                `;

const addNewExpenseQuery = `
                INSERT INTO expenses( amount, description, expense_date, payment_method, building_id)
                VALUE(?,?, now(), ?,?)
            `;

const addNewSpecialPaymentQuery = `
            INSERT INTO special_payments(transaction_id, apartment_id, building_id, description, date, amount, status)
            VALUE ?
        `;

const getSumOfAllIncomesByMonthQuery = `
                WITH VaadBait AS (
                SELECT 
                    'ועד בית' AS category,
                    SUM(amount) AS total
                FROM (
                    SELECT 
                        actually_paid AS amount
                    FROM fixed_payments
                    WHERE status = 'בוצע' AND MONTH(date) = ? AND YEAR(date) = ? AND building_id = ?

                    UNION ALL

                    SELECT 
                        amount
                    FROM credits_and_debits_monthly
                    WHERE status = 'בוצע' AND type = 'השלמה' AND MONTH(date) = ? AND YEAR(date) = ? AND building_id = ?
                    ) AS payments
                ),
                SpecialPayments AS (
                    SELECT 
                        description AS category,
                        SUM(amount) AS total
                    FROM special_payments
                    WHERE status = 'בוצע' AND MONTH(date) = ? AND YEAR(date) = ? AND building_id = ?
                    GROUP BY description
                )
                SELECT 
                    category,
                    total
                FROM VaadBait

                UNION ALL

                SELECT 
                    category,
                    total
                FROM SpecialPayments;
                `;

const getUnpaidPaymentsQuery = `
                SELECT 
                results.first_name,
                results.description,
                results.amount,
                results.date,
                (
                    SELECT SUM(total.amount)
                    FROM (
                        SELECT f.payment_required AS amount
                        FROM fixed_payments f
                        WHERE f.apartment_id = ?
                          AND f.status = 'לא שולם'
                        UNION ALL
                        SELECT c.amount
                        FROM credits_and_debits_monthly c
                        WHERE c.apartment_id = ?
                          AND c.status = 'לא שולם'
                        UNION ALL
                        SELECT s.amount
                        FROM special_payments s
                        WHERE s.apartment_id = ?
                          AND s.status = 'לא שולם'
                    ) total
                ) AS total_unpaid
                FROM (
                    SELECT 
                        u.first_name,
                        f.description,
                        f.payment_required AS amount,
                        f.date
                    FROM fixed_payments f
                    JOIN apartments a ON a.apartment_id = f.apartment_id
                    JOIN users u ON u.user_id = a.user_id
                    WHERE f.apartment_id = ?
                      AND f.status = 'לא שולם'
                    UNION ALL
                    SELECT 
                        u.first_name,
                        c.description,
                        c.amount,
                        c.date
                    FROM credits_and_debits_monthly c
                    JOIN apartments a ON a.apartment_id = c.apartment_id
                    JOIN users u ON u.user_id = a.user_id
                    WHERE c.apartment_id = ?
                      AND c.status = 'לא שולם'
                    UNION ALL
                    SELECT
                        u.first_name,
                        s.description,
                        s.amount,
                        s.date
                    FROM special_payments s
                    JOIN apartments a ON a.apartment_id = s.apartment_id
                    JOIN users u ON u.user_id = a.user_id
                    WHERE s.apartment_id = ?
                      AND s.status = 'לא שולם'
                ) AS results;
    `;

const getSumOfAllExpensesByMonthQuery = `
            SELECT 
                description,
                SUM(amount) AS amount
            FROM expenses
            WHERE MONTH(expense_date) = ? AND YEAR(expense_date) = ? AND building_id = ?
            GROUP BY description
            UNION ALL
            SELECT 
                description,
                SUM(amount) AS amount
            FROM credits_and_debits_monthly
            WHERE MONTH(date) = ? AND YEAR(date) = ? AND type = 'זיכוי' AND building_id = ?
            GROUP BY description;
            `;

const getEmailAddressByApartmentIDQuery = `
            SELECT u.email FROM users u
            JOIN apartments a ON a.user_id = u.user_id
            WHERE a.apartment_id = ?
        `;

function getAllSpecialesPaymentsByIDQuery(status){
    return `
        (
            SELECT 
                sp.payment_id,
                sp.amount,
                sp.description,
                sp.status,
                sp.date,
                t.transaction_id,
                'special_payment' AS type
            FROM 
                special_payments sp
            LEFT JOIN 
                transactions t ON sp.transaction_id = t.transaction_id
            WHERE 
                sp.apartment_id = ?
                ${status !== "הכל" ? "AND sp.status = ?" : ""}
        )
        UNION ALL
        (
            SELECT 
                cd.id AS payment_id,
                cd.amount,
                cd.description,
                cd.status,
                cd.date,
                t.transaction_id,
                cd.type
            FROM 
                credits_and_debits_monthly cd
            LEFT JOIN 
                transactions t ON cd.transaction_id = t.transaction_id
            WHERE 
                cd.apartment_id = ?
                AND cd.type = "השלמה"
                ${status !== "הכל" ? "AND cd.status = ?" : ""}
        )
        ORDER BY 
            date DESC;
        `;
}

function getHistoryPaymentsByIDQuery(filterFixedPaymentsByStatus, filterSpecialPaymentsByStatus, filterCreditsAndDebitsByStatus){
    return `
            SELECT 
                fx.actually_paid, 
                fx.description, 
                t.transaction_date AS date, 
                fx.status,
                fx.transaction_id
            FROM 
                fixed_payments fx
            JOIN 
                transactions t ON t.transaction_id = fx.transaction_id
            WHERE 
                fx.apartment_id = ?
                AND ${filterFixedPaymentsByStatus}
            UNION ALL
            SELECT 
                sp.amount, 
                sp.description, 
                t.transaction_date AS date, 
                sp.status,
                sp.transaction_id
            FROM 
                special_payments sp
            JOIN 
                transactions t ON t.transaction_id = sp.transaction_id
            WHERE 
                sp.apartment_id = ?
                AND ${filterSpecialPaymentsByStatus}
            UNION ALL
            SELECT 
                cd.amount, 
                cd.description, 
                cd.date AS date, 
                cd.status,
                cd.transaction_id
            FROM 
                credits_and_debits_monthly cd
            LEFT JOIN 
                transactions t ON t.transaction_id = cd.transaction_id
            WHERE 
                cd.apartment_id = ?
                AND ${filterCreditsAndDebitsByStatus}
                AND cd.type = "השלמה"
            ORDER BY 
                date DESC;
                `
}

function acceptOrRejectPaymentQuery(table, column){
    return `
            UPDATE ${table} 
            SET status = ? 
            WHERE ${column} = ?
                `;
}

module.exports = {
    createTransictionsQuery,
    updateTransictionsQuery,
    getAllFixedPaymentsYearsQuery,
    updateFixedPaymentsFromNowQuery,
    updateSpecialPaymentsFromNowQuery,
    updateCreditAndDebitPaymentsFromNowQuery,
    updatePaymentsDetailsQuery,
    updateSpecialPaymentsDetailsQuery,
    updateCreditsPaymentsDetailsQuery,
    getMonthlyPaymentQuery,
    getAllPendingPaymentsQuery,
    getAllPaymentsQuery,
    getDetailsListPaymentsQuery,
    updateMonthlyPaymentOfBuildingQuery,
    addMonthlyPaymentsForNextYearQuery,
    isNextYearPaymentsDefinedQuery,
    updateRequireFixedPaymentsFromDateQuery,
    getAllFixedPaymentsPaidFromDateQuery,
    insertCreditAndDebitPaymentsQuery,
    deleteAllDebitUnpaidByMonthQuery,
    addNewExpenseQuery,
    addNewSpecialPaymentQuery,
    getSumOfAllIncomesByMonthQuery,
    getUnpaidPaymentsQuery,
    getSumOfAllExpensesByMonthQuery,
    getEmailAddressByApartmentIDQuery,
    getAllSpecialesPaymentsByIDQuery,
    getHistoryPaymentsByIDQuery,
    acceptOrRejectPaymentQuery
}



