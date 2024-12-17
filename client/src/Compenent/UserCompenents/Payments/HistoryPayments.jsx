import React, { useEffect, useState } from "react";
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBDropdown, 
    MDBDropdownMenu, 
    MDBDropdownToggle, 
    MDBDropdownItem
} from 'mdb-react-ui-kit';

export default function HistoryPayments({apartmentID, refrech}) {
    const [ historyPayments, setHistoryPayments] = useState([]);
    const [ filterBy, setFilterBy ] = useState("הכל");
    
    async function getHistoryPayments(){
        console.log("apartment from history", apartmentID);
        try{
            const response = await fetch(`http://localhost:8080/payments/history-payments/?apartmentID=${apartmentID}&status=${filterBy}`);
            const result = await response.json();           
            setHistoryPayments(result);
        } catch(err){
            console.error(err, "Cannot fetch payments details from server");
        }
    }

    useEffect(() => {
        getHistoryPayments();
    }, [filterBy, refrech])

    return(
        <>
            <div style={{width: "60%", margin: "1% 20%", textAlign:"left"}}>
                <MDBDropdown>
                    <MDBDropdownToggle>{`סנן לפי: ${filterBy}`} </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem link onClick={(e) =>{e.preventDefault(); setFilterBy("הכל")}}>הכל</MDBDropdownItem>
                      <MDBDropdownItem link onClick={(e) =>{e.preventDefault(); setFilterBy("ממתין לאישור")}}>ממתין לאישור</MDBDropdownItem>
                      <MDBDropdownItem link onClick={(e) =>{e.preventDefault(); setFilterBy("בוצע")}}>בוצע</MDBDropdownItem>
                    </MDBDropdownMenu>
                </MDBDropdown>
            </div>
            <MDBTable striped responsive className="table table-primary"  style={{width:'70%', margin: "1% 15%"}}>
                <MDBTableHead light>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">סכום</th>
                    <th scope="col">סיבת התשלום</th>
                    <th scope="col">תאריך</th>
                    <th scope="col">סטטוס</th>
                    <th scope="col">אסמכתא</th>
                  </tr>

                </MDBTableHead>
                <MDBTableBody>
                    {historyPayments.map((payment, index) => (
                        <React.Fragment key={payment.special_payment_id}>
                            <tr>
                                <td scope="row">{index + 1}</td>
                                <td>{payment.actually_paid}₪</td>
                                <td>{payment.description}</td>
                                <td>
                                    {new Date(payment.date).toLocaleDateString('he-IL')}
                                </td>
                                <td>{payment.status === 'בוצע' ? '✅' : '⌛'}</td>
                                <td>{`#${payment.transaction_id}`}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </MDBTableBody>
            </MDBTable>
        </>
    )
}