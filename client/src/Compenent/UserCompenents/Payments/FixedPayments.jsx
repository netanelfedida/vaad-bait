import { useState, useEffect } from 'react';
import PaymentSummary from './PaymentSummary';
import PaymentMethods from './PaymentsMethode';
import PopUp from '../../PopUp';
import '../../../CSS/PaymentOverview.css';
import { MDBBtn, MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';

export default function FixedPayments({ apartment_id, permissions, onRefrech, refrech}){
    const [ selectedYear, setSelectedYear ] = useState(new Date().getFullYear());
    const [ payments, setPayments ] = useState([]);
    const [ showCheckboxes, setShowCheckboxes ] = useState(false);
    const [ totalSelected, setTotalSelected ] = useState(0.0);
    const [ monthSelectedByYear, setMonthSelectedByYear ] = useState({});
    const [ showPopMessage, setShowPopMessage ] = useState(false);
    const [ yearsOption, setYearsOption ] = useState([]);
    const [ alert, setAlert] = useState({});
    
    
    async function getPayments(){
        try{
            const response = await fetch(`http://localhost:8080/payments/all-fixed-payments?year=${selectedYear}&apartmentID=${apartment_id}`)
            const result = await response.json();         
            await setPayments(result);
        } catch(err){
            console.error(err, "Cannot fetch payments details from server");
        }
    }

    async function getYearsOption(){
        try{
            const response = await fetch(`http://localhost:8080/payments/get-fixed-payments-years?apartmentID=${apartment_id}`)
            const result = await response.json();         
            await setYearsOption(result);            
        } catch(err){
            console.error(err, "Cannot fetch years option from server");
        }
    }

    //Open & close the Payment popup
    const openPaymentModal = () => {
        setShowPopMessage(true);
    };
    const closePaymentModal = () => {
        setShowPopMessage(false);
    };

    const clearAll = () => {
        const updatedSelectedMonths = { ...monthSelectedByYear };
        const sumOfCurrentYearSelected = (updatedSelectedMonths[selectedYear])
        .map(paymentId => {
            const payment = payments.find(p => p.payment_id === paymentId);
            return payment ? parseFloat(payment.payment_required) : 0;
        })
        .reduce((sum, amount) => sum + amount, 0); 
        updatedSelectedMonths[selectedYear] = []; 
        setMonthSelectedByYear(updatedSelectedMonths);
        setTotalSelected(totalSelected - sumOfCurrentYearSelected);
    };

    const selectAll = () => {
        const unpaidMonths = payments
            .filter(payment => payment.fixed_status === 'לא שולם')
            .map(payment => payment.payment_id);
        const updatedSelectedMonths = { ...monthSelectedByYear };

        //Ensure that there is an arr
        if(!updatedSelectedMonths[selectedYear]){
            updatedSelectedMonths[selectedYear] = [];
        }
        const newMonthsSelected = unpaidMonths.filter(p => !updatedSelectedMonths[selectedYear].includes(p));

        //Check if all months alredy selected
        if (newMonthsSelected.length === 0) {
            return;
        }
        updatedSelectedMonths[selectedYear] = unpaidMonths;
        const sumOfTotalMonthAdd = newMonthsSelected
            .map(paymentId => {
                const payment = payments.find(p => p.payment_id === paymentId);
                return payment ? parseFloat(payment.payment_required) : 0;
            })
            .reduce((sum, amount) => sum + amount, 0);
    
        setMonthSelectedByYear(updatedSelectedMonths);
        setTotalSelected(totalSelected + sumOfTotalMonthAdd);
    };
    

    const handleCheckboxChange = (event, payment) => {
        const checked = event.target.checked;
        const updatedSelectedMonths = { ...monthSelectedByYear };

        //For the first selected create an array
        if (!updatedSelectedMonths[selectedYear]) {
            updatedSelectedMonths[selectedYear] = [];
        }
        if (checked) {
            updatedSelectedMonths[selectedYear] = [...updatedSelectedMonths[selectedYear], payment.payment_id];
            setTotalSelected(totalSelected + parseFloat(payment.payment_required));
        } else {
            updatedSelectedMonths[selectedYear] = updatedSelectedMonths[selectedYear].filter(m => m !== payment.payment_id);
            setTotalSelected(totalSelected - parseFloat(payment.payment_required));
        }
        setMonthSelectedByYear(updatedSelectedMonths);      
        
    };

    const handleCashPayment = async () => {        
        const transactionDetails = {
            apartmentID: apartment_id,
            allPayments: monthSelectedByYear,
            sumOfTransiction: totalSelected,
            paymentMethode: 'מזומן',
            permissions: permissions
        }
        try{
                const response = await fetch('http://localhost:8080/payments/fixed-payments-process', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transactionDetails)
                });

                if (response.ok) {
                    const data = await response.json();
                    setAlert({message: data.Success, color: 'green'});
                    setMonthSelectedByYear([]);
                    setTotalSelected(0);
                    onRefrech();

                } else {
                    setAlert({message:"תהליך הביצוע נכשל, " + await response.json(), color: 'red'});
                }
            }catch(error){
                setAlert({message: "עקב בעית תקשורת תהליך הביצוע נכשל\n אנא נסה שנית!!", color: 'red'});
            }
        closePaymentModal();
        getPayments();
    };
    
    useEffect(() => {
        getYearsOption();
    }, [])

    useEffect(() => {
        getPayments();           
    }, [selectedYear]);

    return (
        <div style={{maxWidth:'70%', margin:'20px 15%', textAlign:'center'}}>
            <PaymentSummary refrech={refrech} apartmentId={apartment_id} />
            <div id='total-of-select'>
                <div style={{color: `${alert.color}`}}>{alert.message}</div>
                <h2 className='text-black'>סכום לתשלום: {totalSelected} </h2>
            </div>
                לבחירת שנה:  
                <MDBDropdown style={{marginBottom:"10px"}}>
                  <MDBDropdownToggle>{selectedYear}</MDBDropdownToggle>
                  <MDBDropdownMenu>
                  {yearsOption.length > 0 ? 
                    yearsOption.map((year, index) => {
                       return <MDBDropdownItem key={index} onClick={() => setSelectedYear(year.for_year)} link>{year.for_year}</MDBDropdownItem>
                    }): ""
                  }
                  </MDBDropdownMenu>
                </MDBDropdown>
            {(
                <div>
                    <MDBBtn className="me-2" onClick={() => setShowCheckboxes(!showCheckboxes)}>
                        {showCheckboxes? '- הסתרת בחירת חודשים': '+ לבחירת חודשים'}
                    </MDBBtn>

                    { showCheckboxes && (
                        <>
                            <MDBBtn className="me-2" onClick={clearAll} disabled={!monthSelectedByYear[selectedYear]?.length}>נקה הכל</MDBBtn>
                            <MDBBtn className="me-2" onClick={selectAll}>בחר הכל</MDBBtn>
                        </>
                    )}
                    {totalSelected > 0 && <MDBBtn className="me-2" onClick={openPaymentModal}>לתשלום</MDBBtn>}

                    <PopUp show={showPopMessage} onClose={closePaymentModal}>
                        <h2 className='text-black'>בחר אמצעי תשלום</h2>
                        <PaymentMethods handleCashPayment={handleCashPayment} />
                    </PopUp>
                </div>
            )}

            <div className="payments-grid">
                {!payments[0]?<h4>אין תשלומים זמינים</h4>:payments.map((payment, index) => (
                    <div key={index} className={`payment-card ${payment.fixed_status === 'בוצע'?'paid':payment.fixed_status  === 'לא שולם'?'unpaid':'Pending'}`}>
                        <h4 className='text-black'>{payment.month}</h4>
                        <h4 className='text-black'>{payment.fixed_status === 'לא שולם'?`${payment.payment_required}₪`: `${payment.actually_paid}₪`}</h4>
                        <p  className='text-black'>{payment.fixed_status  === 'בוצע'? '✅':payment.fixed_status  === 'לא שולם'?'❌':'ממתין לאישור ⌛'}</p>
                        
                        {payment.credit_types && 
                            <h6 className='text-black'>{`*בתשלומים מיוחדים מופיע ${payment.credit_types} לחודש זה`}</h6>}
                        {payment.fixed_status === 'לא שולם' &&
                        <label className={`checkbox-container ${showCheckboxes ? 'show' : 'hide'}`}>
                            <input 
                                type="checkbox"
                                checked={monthSelectedByYear[selectedYear]?.includes(payment.payment_id) || false}
                                onChange={(e) => {handleCheckboxChange(e,payment)}} 
                                value={payment.payment_id} /> 
                            <span className='text-black'>לתשלום</span>
                        </label>}
                    </div>
                ))}
            </div>
        </div>
    );
};
