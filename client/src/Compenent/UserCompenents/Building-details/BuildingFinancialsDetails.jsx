import React, { useEffect, useState } from "react";
import TotalFinancials from './TotalFinancials';
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBDropdown, 
    MDBDropdownMenu, 
    MDBDropdownToggle, 
    MDBDropdownItem
} from 'mdb-react-ui-kit';
import { getFinancialsDetails } from "../../Utils";

export default function BuidingFinancialsDetails({buildingID}) {
    const [ buildingFinancialsDetails, setBuiLdingFinancialsDetails] = useState([]);
    const [ filterBy, setFilterBy ] = useState("תנועות אחרונות");        

    useEffect(() => {
        getFinancialsDetails(buildingID, filterBy, setBuiLdingFinancialsDetails);
    }, [filterBy, buildingID]);

    return(
        <>
            <TotalFinancials buildingID={buildingID} />
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
                        <th scope="col">סוג</th>
                        <th scope="col">סכום</th>
                        <th scope="col">תיאור</th>
                        <th scope="col">תאריך</th>
                        <th scope="col">אמצעי תשלום</th>
                    </tr>

                </MDBTableHead>
                <MDBTableBody>
                    {buildingFinancialsDetails.map((action, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td>{index+1}</td>
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
        </>
    )
}