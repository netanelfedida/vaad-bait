import { MDBBtn, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBInput, MDBTextArea } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";

export default function AddExpensePayment({buildingID}) {
    const [ amount, setAmount ] = useState(0.0);
    const [ description, setDescription ] = useState("");
    const [ paymentMethode, setPaymentMethode ] = useState("מזומן");

    async function updateMonthlyPayments(){
        try {
            const res = await fetch(`http://localhost:8080/admin/payments/new-expense`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    buildingID,
                    amount,
                    description,
                    paymentMethode
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
            console.error(err, "Cannot add new expense from server");
            alert("ההוצאה נכשלה!!");
        }
    }

    useEffect(() => {
    }, [])


    return (
        <>
            <div style={{margin:"10px 35%"}}>
            
                <div style={{ margin:"5px", width: "200px", display:"flex"}}>
                <MDBDropdown className="me-1">
                  <MDBDropdownToggle>
                  {paymentMethode ||"סוג תשלום"}
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem link onClick={() => setPaymentMethode("מזומן")}>מזומן</MDBDropdownItem>
                    <MDBDropdownItem link disabled aria-disabled={true} onClick={() => setPaymentMethode("העברה בנקאית")}>העברה בנקאית</MDBDropdownItem>
                    <MDBDropdownItem link disabled aria-disabled={true} onClick={() => setPaymentMethode("ביט")}>ביט</MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
                    <MDBInput  value={amount} label="סכום" id="typeNumber" type="number" onChange={(e)=>{setAmount(e.target.value)}} />
                </div>
                <div style={{ width: "200px"}}>
                    <MDBTextArea value={description} label="סיבת הוצאה" id="textAreaExample" rows="{5}" onChange={(e)=>{setDescription(e.target.value)}}/>
                </div>
                <MDBBtn style={{ margin: "5px"}} onClick={updateMonthlyPayments}>צור חיוב</MDBBtn>
            </div>

        </>
    )
}