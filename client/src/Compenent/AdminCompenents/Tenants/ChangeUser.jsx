import React, { useState } from "react";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";



export default function ChangeUser({onClose ,userID, tenant}){
    const [ email, setEmail ] = useState("");
    const [ userData, setUserData ] = useState([]);
    const [ isUserExist, setIsUserExist ] = useState(true);
    const [ alert, setAlert ] = useState("");
    const { building_id } = JSON.parse(localStorage.getItem('data'));
    const navigate = useNavigate();

    const checkIsUserExist = async() => {
        setAlert("");
        setUserData([]);
        if(checkIfTheSameUser()){
            return;
        }
        
        try {
            const result = await fetch(`http://localhost:8080/admin/profile/check-user-exist?email=${email}`);
            const response = await result.json();
            if(response.length > 0){
                setIsUserExist(true);
                setUserData(response);
                return;
                
            }
            setIsUserExist(false);
            navigate(`/vaad-bait/admin/${userID}/new-user?apartmentID=${tenant.apartment_id}&email=${email}`);
        } catch (error) {
            console.error(error, "Internal server error");            
        }
    }

    const checkEmail = () => {
        checkIsUserExist();
    }
 
    const changeTenant = async () => {  
        try {
            await fetch(`http://localhost:8080/profile/change-user`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                tenant,
                newUser: userData[0].user_id,
                building_id
              }),
          });
          } catch (error) {
            console.error(error);
          }
          onClose();
    }

    const checkIfTheSameUser = () => {
        if(email === tenant.email){
            setAlert("לא ניתן להחליף באותו משתמש!!");
            return true;
        }
    }

    return(
        <>
            <h4>הכנס מייל של המשתמש החדש</h4>
            <div style={{display:"flex", width:"85%", margin:"0 7%"}}>
                <MDBInput value={email} onChange={(e) => setEmail(e.target.value)} label="הכנס מייל" id="typeEmail" type="email" />
                <div>
                 <MDBBtn onClick={checkEmail} style={{marginRight:"10px"}}>שלח</MDBBtn>
                </div>
            </div>
                <h6 style={{color:"red"}}>{alert}</h6>
                { isUserExist && userData.length > 0 &&
                    <div style={{margin:"5px 10%"}}>
                        <h6 style={{color:"green"}}>משתמש כבר קיים במערכת.</h6>
                        <div style={{display:"flex"}}>
                            <input disabled value={`${userData[0].first_name} ${userData[0].last_name}   |   טל' ${userData[0].phone_number}`} className='form-control' type='text' />
                            <MDBBtn color="success" onClick={changeTenant} style={{marginRight:"10px"}}>החלף</MDBBtn>
                        </div>
                    </div>
                }


        </>
    )
}