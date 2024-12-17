import React, { useEffect, useState } from "react";
import TotalFinacials from '../../UserCompenents/Building-details/TotalFinancials';
import { getFinancialsDetails } from "../../Utils";
import { MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";


export default function HistoryPayments({buildingID, refresh}) {
    const [ buidingFinancialsDetails, setBuidingFinancialsDetails] = useState([]);
    const [ filterBy, setFilterBy ] = useState("תנועות אחרונות");  
    

    useEffect(() => {
        getFinancialsDetails(buildingID, filterBy, setBuidingFinancialsDetails);
        console.log("buidingFinancialsDetails", buidingFinancialsDetails);
        
    }, [filterBy, refresh]);



    return (
        <div>
             <TotalFinacials buildingID={buildingID} refresh={refresh} /> 
             <div style={{width: "70%", margin: "1% 15%", textAlign:"left"}}>
                <MDBDropdown>
                    <MDBDropdownToggle>{`מיין לפי: ${filterBy}`} </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem link onClick={(e) =>{e.preventDefault(); setFilterBy("תנועות אחרונות")}}>תנועות אחרונות</MDBDropdownItem>
                      <MDBDropdownItem link onClick={(e) =>{e.preventDefault(); setFilterBy("הוצאות")}}>הוצאות</MDBDropdownItem>
                      <MDBDropdownItem link onClick={(e) =>{e.preventDefault(); setFilterBy("הכנסות")}}>הכנסות</MDBDropdownItem>
                    </MDBDropdownMenu>
                </MDBDropdown>
            </div>
            <MDBTable striped responsive className="table table-primary" style={{width:'70%', margin: "1% 15%"}}>
                <MDBTableHead light>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">מספר דירה</th>
                        <th scope="col">אסמכתא</th>
                        <th scope="col">סוג</th>
                        <th scope="col">סכום</th>
                        <th scope="col">תיאור</th>
                        <th scope="col">תאריך</th>
                        <th scope="col">אמצעי תשלום</th>
                    </tr>

                </MDBTableHead>
                <MDBTableBody>
                    {buidingFinancialsDetails.map((action, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td>{index+1}</td>
                                <td>{action.apartment_number}</td>
                                <td>{action.reference_number}</td>
                                <td>{action.type}</td>
                                <td style={{color:action.type === "הכנסה"? "green" : "red"}}>{action.amount}</td>
                                <td>{action.description}</td>
                                <td>{new Date(action.transaction_date).toLocaleDateString('he-IL')}</td>
                                <td>{action.payment_method}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </MDBTableBody>
            </MDBTable>
        </div>
    )
}