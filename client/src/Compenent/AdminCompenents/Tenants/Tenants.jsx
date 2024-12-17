import React, { useEffect, useState } from "react";
import { getTenantsDetails } from "../../Utils";
import adminIcon from '../../../Pictures/manager.png';
import PopUp from '../../PopUp';
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
} from 'mdb-react-ui-kit';
import ChangeUser from "./ChangeUser";

export default function Tanants({data}) {
    const [ tenantsDetails, setTenantsDetails] = useState([]);
    const [ showPopUp, setShowPopUp ] = useState(false);
    const [ tenantSelected, setTenantSelected ] = useState({});
    const [ alert, setAlert ] = useState({});
    const { building_id } = data;

    const closePopUp = () => {
        setShowPopUp(false);
    }
    const changeTenantsHandle = async (tenant) =>{
        setAlert({})
        await setTenantSelected(tenant);
        setShowPopUp(true);
    }

    const changePermissionHandle = async (tenant, isAdmin) => {
        setAlert({})
        console.log(tenant);
        
        try {
            const response = await fetch(`http://localhost:8080/admin/building-details/change-permission`, {
               method: 'PUT',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                 buildingID: building_id,
                 apartmentID: tenant.apartment_id,
                 email:tenant.email,
                 firstName: tenant.first_name,
                 isAdmin }),
            });

            if (response.ok) {
                await response.json();
                setAlert({message: `הרשאה עודכנה בהצלחה עבור ${tenant.last_name}`, color:'green'});
            } else {
                const error = await response.json();
                setAlert({message: `העידכון נדחה: ${error.error}`, color: 'red'});
            }
        } catch (error) {
            console.error('Error updating permission:', error);
            setAlert({message: 'אירעה שגיאה. נסה שוב מאוחר יותר.', color:'red'});
        }
    }

    useEffect(() => {
        getTenantsDetails(building_id, setTenantsDetails);
    })
    return (
    <>
            <div style={{width:'40%', margin: "1% 30%",color:`${alert.color}`, textAlign:"center"}}>{alert.message}</div>
            <MDBTable striped responsive className="table table-primary"  style={{width:'70%', margin: "0 15%"}}>
                <MDBTableHead light>
                    <tr>
                        <th scope="col">דירה</th>
                        <th scope="col">שם</th>
                        <th scope="col">מייל</th>
                        <th scope="col">טלפון</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>

                </MDBTableHead>
                <MDBTableBody>
                    {tenantsDetails.map((tenant) => (
                        <React.Fragment key={tenant.apartment_number}>
                            <tr>
                                <td scope="row">{tenant.apartment_number}</td>
                                <td>{tenant.last_name} 
                                    {tenant.permissions === 'admin'?
                                        <img src={adminIcon} style={{width:"25px"}} /> :""
                                    }
                                </td>
                                <td>{tenant.email}</td>
                                <td>{tenant.phone_number}</td>
                                <td>
                                {tenant.permissions === 'admin'?
                                        "":<MDBBtn color="info" onClick={() => changeTenantsHandle(tenant)}>החלפת דייר</MDBBtn>
                                    }
                                </td>
                                <td>
                                    {tenant.permissions === 'admin'?
                                        <MDBBtn color="danger" onClick={() => changePermissionHandle(tenant, true)}>הגדר כדייר רגיל</MDBBtn>:
                                        <MDBBtn color="success" onClick={() => changePermissionHandle(tenant, false)}>הגדר כוועד בית</MDBBtn>
                                    }
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </MDBTableBody>
            </MDBTable>
            {showPopUp && 
                <PopUp show={showPopUp} onClose={closePopUp} >
                    <ChangeUser onClose={closePopUp} userID={data.user_id} tenant={tenantSelected}/>
                </PopUp>
            }
        
    </>
    )
}