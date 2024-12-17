import { MDBBtn, MDBInput, MDBTextArea } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";

export default function AddNewPayment({buildingID}) {
    const [ amount, setAmount ] = useState(0.0);
    const [ description, setDescription ] = useState("");

    async function addNewPayment(){
        try {
            const res = await fetch(`http://localhost:8080/admin/payments/new-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    buildingID,
                    amount,
                    description,
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
            console.error(err, "Cannot add new special payment from server");
            alert("הוספת התשלום נכשלה!!");
        }
    }

    useEffect(() => {
    }, [])


    return (
        <>
            <div style={{margin:"10px 35%"}}>
                    <div style={{ margin:"5px", width: "100px"}}>
                        <MDBInput value={amount} label="סכום" id="typeNumber" type="number" onChange={(e)=>{setAmount(e.target.value)}} />
                    </div>
                    <div style={{ width: "200px"}}>
                        <MDBTextArea value={description} label="סיבת חיוב" id="textAreaExample" rows="{5}" onChange={(e)=>{setDescription(e.target.value)}}/>
                    </div>
                     <MDBBtn style={{ margin: "5px", whiteSpace: "nowrap" }} onClick={addNewPayment}>צור חיוב</MDBBtn>
            </div>

        </>
    )
}