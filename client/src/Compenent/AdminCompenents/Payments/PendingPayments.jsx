
import React, { useEffect, useState } from "react";
import { MDBTable, MDBBtn, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";




export default function PendingPayments({onRefresh, buildingID}) {
    const [ pendingPayments, setPendingPayments] = useState([]);
    const [ alert, setAlert ] = useState("")

    async function getPendingPayments(){
        try {
            const data = await fetch(`http://localhost:8080/admin/payments/pending-list?buildingID=${buildingID}`);
            const result = await data.json(); 
            setPendingPayments(result);

        } catch(err){
            console.error(err, "Cannot fetch tenants details from server");
        }
    }

    async function acceptOrRejectPayments(action, status){   
        setAlert("")         
        try {
            await fetch(`http://localhost:8080/admin/payments/update-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action,
                    status: status,
                    buildingID
                }),
            });
    
        } catch (err) {
            console.error(err, "Cannot accept payment from server");
        }
        if(status === "בוצע"){
            setAlert("התשלום התקבל בהצלחה, הודעה נמסרה לדייר")
        }
        else{
            setAlert("דחיית התשלום עודכנה בהצלחה, הודעה נמסרה לדייר!!")
        }
        getPendingPayments();
        onRefresh();
    }

   

    useEffect(() => {
        getPendingPayments();
    }, []);


    return(
        <>
           <div style={{width:'40%', margin: "1% 30%",color:"green", textAlign:"center"}}>{alert}</div>
            <MDBTable striped responsive className="table table-primary" style={{width:'70%', margin: "1% 15%"}}>
                <MDBTableHead light>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">מספר דירה</th>
                        <th scope="col">אסמכתא</th>
                        <th scope="col">סכום</th>
                        <th scope="col">תיאור</th>
                        <th scope="col">תאריך</th>
                        <th scope="col">אמצעי תשלום</th>
                        <th scope="col">
                        </th>

                    </tr>

                </MDBTableHead>
                <MDBTableBody>
                    {pendingPayments.map((action, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td>{index+1}</td>
                                <td style={{textAlign:"center"}}>
                                        {action.apartment_number}
                                    <div>
                                        {action.last_name}    
                                    </div>
                                </td>
                                <td>{action.reference_number}</td>
                                <td>{action.amount}₪</td>
                                <td>{action.description}</td>
                                <td>{new Date(action.transaction_date).toLocaleDateString('he-IL')}</td>
                                <td>{action.payment_method}</td>
                                <td>
                                    <MDBBtn className='me-1' color='success' onClick={() => {acceptOrRejectPayments(action, "בוצע")}}>אשר</MDBBtn>
                                    <MDBBtn className='me-1' color='danger' onClick={() => {acceptOrRejectPayments(action, "לא שולם")}}>דחה</MDBBtn>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </MDBTableBody>
            </MDBTable>
        </>
    )
}