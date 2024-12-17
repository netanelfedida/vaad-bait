import React from "react";
import logo from '../Pictures/Logo.png';
import email from '../Pictures/communication.png';
import phone from '../Pictures/social.png';
import '../CSS/ContactUs.css';



export default function ContactUs() {


    return (
        <>
          <div id="contactUs" className="contact-container">
            <div className="contact-details">
              <h2 style={{textDecorationLine:"underline", color:"black", textAlign:'center'}}>צור קשר</h2>
              <div className="contact">
                <img src={phone} alt="phone" width={'30px'} />
                <span>0533445034</span>
              </div>
              <div className="contact">
                <img src={email} alt="email" width={'30px'} />
                <span>Fnati02@gmail.com</span>
              </div>
            </div>
            <img className="logo" src={logo} alt="logo" width={'150px'} />
          </div>
        </>
      );
      
      
}