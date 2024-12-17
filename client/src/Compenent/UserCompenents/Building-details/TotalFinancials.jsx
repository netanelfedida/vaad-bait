import React, { useEffect, useState } from "react";


export default function TotalFinancials({buildingID, refresh}) {
    const [ totalIncomes, setTotalIncomes] = useState(0);
    const [ totalExpenses, setTotalExpenses] = useState(0);

    
    async function getTotalFinancials(){
        try {
            const data = await fetch(`http://localhost:8080/building-details/total-financials?buildingID=${buildingID}`);
            const result = await data.json(); 
            setTotalIncomes(result[0].total_income);
            setTotalExpenses(result[0].total_expense);
        } catch(err){
            console.error(err, "Cannot fetch Financials details from server");
        }
    }

    useEffect(() => {
        getTotalFinancials();
    }, [refresh]);

    return(
        <>
            <div style={{width:"50%", margin:"5% 25%", fontSize:"25px"}}>
                <span style={{margin:"0 15px"}}>{`הכנסות: `}
                    <span style={{color:"green"}}>{!totalIncomes ? 0 : totalIncomes}</span>₪
                </span>
                <span style={{margin:"0 15px"}}>{`הוצאות: `}
                    <span style={{color:"red"}}>{!totalExpenses ? 0 : totalExpenses}</span>₪
                </span>
                <span style={{margin:"0 15px"}}>{`סה"כ בקופה: ₪`}
                    <span style={{color: (totalIncomes - totalExpenses) > 0 ? "green" : "red"}}>
                        {totalIncomes - totalExpenses}
                    </span>
                </span>
            </div>
        </>
    )
}