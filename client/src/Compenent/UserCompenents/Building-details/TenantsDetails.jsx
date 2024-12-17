import React, { useEffect, useState } from "react";
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
} from 'mdb-react-ui-kit';
import adminIcon from '../../../Pictures/manager.png'
import { getAdrres, getTenantsDetails } from "../../Utils";

export default function TenantsDetails({data}) {
    const [ tenantsDetails, setTenantsDetails] = useState([]);
    const [ adrres, setAdrres ] = useState([]);
    const { building_id } = data;

    async function getAddress(){
        try {
            await getAdrres(building_id, setAdrres);           
        } catch (err) {
            console.error(err, "Cannot fetch Sddress details from server");
        }
    }

    useEffect(() => {
        getTenantsDetails(building_id, setTenantsDetails);
        getAddress();
    }, []);

    return(
        <>
           <div style={{margin:" 5% 25%", width:"50%", textAlign:"center"}}><h4>{adrres.length > 0 ?`כתובת: ${adrres[0].address}`: ""}</h4></div>
            <MDBTable striped responsive className="table table-primary"  style={{width:'70%', margin: "1% 15%"}}>
                <MDBTableHead light>
                    <tr>
                        <th scope="col">דירה</th>
                        <th scope="col">שם</th>
                        <th scope="col">מייל</th>
                        <th scope="col">טלפון</th>
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
                            </tr>
                        </React.Fragment>
                    ))}
                </MDBTableBody>
            </MDBTable>
        </>
    )
}