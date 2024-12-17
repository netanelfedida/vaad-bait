import React, { useEffect, useState } from "react";
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem, MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from 'mdb-react-ui-kit';
import { getNeighbors } from "../../Utils";


export default function TenantDebtBalance({buildingID, refresh}) {
    const [ neighbors, setNeighbors ] = useState([]);
    const [ apartmentIDSelected, setApartmentIDSelected ] = useState();
    const [ listOfUnpaid, setListOfUnpaid ] = useState([]);
    const [ apartmentSelected, setApartmentSelected ] = useState("בחר את אחד מהשכנים")
    console.log("BuildingID ---->", neighbors);
    
    async function getUnpaidPayments(){
        try {
            const unpaidPayments = await fetch(`http://localhost:8080/admin/payments/unpaid-payment?apartmentID=${apartmentIDSelected}`);
            const result = await unpaidPayments.json();
            setListOfUnpaid(result);
        } catch(err) {
            console.error(err, "Cannot fetch unpaid payments from server");
        }
    }

    const sendRemind = async() => {
        try {
            await fetch(`http://localhost:8080/admin/payments/send-remind-unpaid?apartmentID=${apartmentIDSelected}`)
        } catch (err) {
            console.error(err, "Cannot fetch remind unpaid payment from server");
        }
    }

    const selectNeighborhandle = (neighbor) => {
        setApartmentSelected(`${neighbor.apartment_number} - ${neighbor.last_name}`);
        setApartmentIDSelected(neighbor.apartment_id);
    }

    useEffect(() => {
        getNeighbors(buildingID, setNeighbors);
    }, [])

    useEffect(() => {
        getUnpaidPayments();
        console.log("listOfUnpaid", listOfUnpaid);
        
    }, [apartmentIDSelected, refresh])

    return (
    <div >
        <div style={{width:'70%', margin: "1% 15%", display:"flex", textAlign:"left",justifyContent: 'flex-end'}}>
            {listOfUnpaid.length > 0 && <h2 style={{marginLeft:"100px"}}>{`סה"כ ליתרת חוב: ${listOfUnpaid[0].total_unpaid}₪`}</h2>}
                <div style={{marginLeft:"5px"}}>
                    {listOfUnpaid.length > 0 && <MDBBtn outline onClick={sendRemind}>שלח תזכורת🔔</MDBBtn>}
                </div>
            <div>
                <MDBDropdown>
                  <MDBDropdownToggle >{apartmentSelected}</MDBDropdownToggle>
                  <MDBDropdownMenu>
                  {neighbors && neighbors.map((neighbor, index) => {
                   return <MDBDropdownItem key={index} onClick={() => selectNeighborhandle(neighbor)} link>{`${neighbor.apartment_number} - ${neighbor.last_name}`}</MDBDropdownItem>
                  })}
                  </MDBDropdownMenu>
                </MDBDropdown>
            </div>
        </div>
        <MDBTable striped responsive className="table table-primary" style={{width:'70%', margin: "1% 15%"}}>
            <MDBTableHead light>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">סכום</th>
                    <th scope="col">תיאור</th>
                    <th scope="col">תאריך</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                {listOfUnpaid.length > 0? 
                    listOfUnpaid.map((payment, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td>{index+1}</td>
                                <td>{payment.amount}₪</td>
                                <td>{payment.description}</td>
                                <td>{new Date(payment.date).toLocaleDateString('he-IL')}</td>
                            </tr>
                        </React.Fragment>
                    )) :
                    <h2 style={{width:"70%" ,margin:"10px 15%"}}>לקבלת נתונים יש לבחור בדייר רצוי.</h2>}
            </MDBTableBody>
        </MDBTable>

    </div>
    )
}