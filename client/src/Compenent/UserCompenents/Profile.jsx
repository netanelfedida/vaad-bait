import React, { useEffect, useState } from "react";
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import emailImg from '../../Pictures/communication.png';
import { validEmail, validPhone, getUserData, validCheckbox, isFieldEmpty } from '../Utils.js';

export default function Profile({userID}) {

  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ phoneNumber, setPhoneNumber ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ emailCheck, setEmailCheck ] = useState(false);
  const [ message, setMessage ] = useState({});

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
  
  function fillDetails(data){
    setFirstName(data.first_name);
    setLastName(data.last_name);
    setEmail(data.email);
    setPhoneNumber(data.phone_number);
    setPassword(data.password);
    setEmailCheck(data.emailMessage)
  }

  async function updateProfile(e){
    e.preventDefault();
    if(!validEmail(email, setMessage) || 
       !validPhone(phoneNumber, setMessage) || 
       !validCheckbox(emailCheck, setMessage)
      ){
        return;
    }
    try {
      await fetch(`http://localhost:8080/profile/update-profile?userID=${userID}`,{
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID,
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
          emailCheck
        }),
    });
      
      setMessage({message: "הפרופיל עודכן בהצחה!!", color: "green"})
    } catch (error) {
      console.error(error);
    }
    window.location.reload();
  }

  useEffect(() => {
    getUserData(userID, fillDetails);
  }, [])


  return(
      <div style={{width:"60%", margin:"5% 20%", padding:"10px", backgroundColor:"rgba(248, 249, 249, 0.9)"}}>
      <form 
          onSubmit={updateProfile}  
          style={{width:"50%", margin:"5% 25%"}}>
          <h2>הפרופיל שלי</h2>
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
          <div style={{width:"60%", margin:"1% 20%", display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                  type="checkbox" 
                  id="checkbox2" 
                  name="inlineCheck" 
                  checked={emailCheck}
                  onChange={(e) => {
                      setEmailCheck(e.target.checked);
                      validCheckbox(e.target.checked, setMessage);
                  }} 
              />
              <img src={emailImg} alt="email" style={{ width: "5%" }} />
              <h6 style={{ margin: 0 }}>אני מאשר קבלת עידכונים במייל</h6>
          </div>
          <div style={{width:"50%", margin:"1% 25%",  color:"red"}}>
              <h4 style={{fontSize:"18px", color:`${message.color}`}}>{message.message}</h4>
          </div>
          <br />
          <div style={{margin:"0 35%"}}>
            <MDBBtn type='submit' color='primary'>שמור שינויים</MDBBtn>
          </div>
      </form>
      </div>
    )
}