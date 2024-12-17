import React, { useEffect, useState } from "react";
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { validEmail, validPhone } from '../../Utils';
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function Register() {

  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ phoneNumber, setPhoneNumber ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ message, setMessage ] = useState({});
  
    const location = useLocation();
    const navigate = useNavigate();

    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const apartmentID = queryParams.get('apartmentID');
    const newEmail = queryParams.get('email');
    const { user_id } = useParams();
    const { building_id } = JSON.parse(localStorage.getItem('data'));
    

  const changePhone = (e) => {
    const currentPhone = e.target.value;
      setPhoneNumber(currentPhone);
      validPhone(currentPhone, setMessage);
  }

  const changeEmail = (e) => {
      const currentEmail = e.target.value;
      setEmail(currentEmail);
      validEmail(currentEmail, setMessage);
    };

   async function addUser(e){
    e.preventDefault();
    if(!validEmail(email, setMessage) || 
       !validPhone(phoneNumber, setMessage)
      ){
        return;
    }
    try {
      await fetch(`http://localhost:8080/profile/add-new-user`,{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oldUser:  apartmentID,
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
          building_id,
          emailMessage: true
        }),
    });
    } catch (error) {
      console.error(error);
    }
    navigate(`/vaad-bait/admin/${user_id}/tenants`)
   }

  useEffect(() => {
    setEmail(newEmail);
  }, [location.search])


  return(
      <div style={{width:"60%", margin:"5% 20%", padding:"10px", backgroundColor:"rgba(248, 249, 249, 0.9)"}}>
      <form 
          onSubmit={addUser}  
          style={{width:"50%", margin:"5% 25%"}}>
          <h2>צור משתמש חדש</h2>
          <br />
          <MDBInput label="שם פרטי" value={firstName} id="formControlLg" type="text" onChange={(e) => {setFirstName(e.target.value)}} required />
          <br />
          <MDBInput  label="שם משפחה" value={lastName} id="formControlDefault" type="text" onChange={(e) => {setLastName(e.target.value)}} required />
          <br />
          <MDBInput label="אימייל" value={email} id="typeEmail" type="email" onChange={(e) => changeEmail(e)} required />
          <br />
          <MDBInput  label="סיסמא" value={password} id="formControlDefault" type="text" onChange={(e) => {setPassword(e.target.value)}} required />
          <br />
          <MDBInput label="טלפון" value={phoneNumber} id="typePhone" type="tel" onChange={(e) => changePhone(e)} required/>
          <br />
          <div style={{width:"50%", margin:"1% 25%",  color:`${message.color}`}}>
              <h4 style={{fontSize:"18px",}}>{message.message}</h4>
          </div>
          <br />
          <div style={{margin:"0 35%"}}>
            <MDBBtn type='submit' color='primary'>צור משתמש</MDBBtn>
          </div>
      </form>
      </div>
    )
}