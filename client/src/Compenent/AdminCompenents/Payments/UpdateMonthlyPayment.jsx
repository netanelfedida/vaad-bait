import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import MonthSelector from "./MonthSelector";

export default function UpdateMonthlyPayments({buildingID}) {
    const [ monthlyPayment, setMonthlyPayment ] = useState("");
    const [ selectedMonth, setSelectedMonth ] = useState("")

    async function getMonthlyPayment(){
        
        const response = await fetch(`http://localhost:8080/admin/payments/monthly-payment?buildingID=${buildingID}`);
        const data = await response.json();
        if(!data[0]){
            return;
        }
        if(data[0].monthly_payment === 0){
            await setMonthlyPayment("");
        }
        else{
            await setMonthlyPayment(data[0].monthly_payment);
        }
        
    }

    async function updateMonthlyPayments(){
        try {
            const res = await fetch(`http://localhost:8080/admin/payments/update-monthly-payment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    buildingID,
                    monthlyPayment,
                    selectedMonth
                }),
            });
            const result = await res.json();
            if (res.ok) {
                alert(result.Success);
                window.location.reload();
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error(err, "Cannot update monthly payment from server");
            alert("העידכון נכשל!!");
        }
        getMonthlyPayment();
    }

    useEffect(() => {
        getMonthlyPayment();
    }, [])


    return (
        <>
            <div style={{margin:"10px 25%", display: "flex", alignItems: "center" }}>
                    <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} buildingID={buildingID}/>
                    <div style={{ width: "100px", display: "flex" }}>
                      <MDBInput value={monthlyPayment} label="תשלום חודשי" id="typeNumber" type="number" onChange={(e)=>{setMonthlyPayment(e.target.value)}} />
                    </div>
                    <MDBBtn style={{ margin: "0 5px", whiteSpace: "nowrap" }} onClick={updateMonthlyPayments}>עדכן סכום</MDBBtn>
            </div>

        </>
    )
}