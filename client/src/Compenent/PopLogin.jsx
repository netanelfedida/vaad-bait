import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBInput,
  MDBBtn
} from 'mdb-react-ui-kit';

export default function PopLogin({ onClose }) {
  const [openPop, setOpenPop] = useState(true);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [ alert, setAlert ] = useState("");

  const navigate = useNavigate();

  async function checkUser(e) {
    setAlert("");
    e.preventDefault();
    setEmailValue(emailValue.toLowerCase());
    try {
      const response = await fetch(
        `http://localhost:8080/login?email=${emailValue}&password=${passwordValue}`
      );
      const data = await response.json();

      if (response.status === 404) {
        setAlert(data.error);
      } else {
        localStorage.setItem('data', JSON.stringify(data));
        const userID = data.user_id;
        navigate(`vaad-bait/user/${userID}/buildings-selection`);
      }
    } catch (error) {
      setAlert('בעיית תקשורת, אנא נסו מאוחר יותר!');
    }
  }

  return (
    <>
      <MDBModal tabIndex='-1' open={openPop} onClose={() => setOpenPop(false)}>
        <MDBModalDialog>
          <MDBModalContent className='bg-light'>
            <MDBModalHeader className='bg-secondary d-flex align-items-center justify-content-between'>
              <MDBModalTitle className='modal-title mx-auto'>כניסה</MDBModalTitle>
              <button
                type='button'
                onClick={() => setOpenPop(false)}
                className='btn-close'
                aria-label='Close'
                style={{ position: 'absolute', right: '1rem' }}
              ></button>
            </MDBModalHeader>
            <MDBModalBody>
              <form onSubmit={checkUser}>
                <div style={{ width: '100%' }}>
                  <MDBInput
                    label='הכנס מייל'
                    id='typeEmail'
                    type='email'
                    onChange={(e) => setEmailValue(e.target.value)}
                    required
                  />
                  <br />
                  <MDBInput
                    label='סיסמא'
                    id='typePassword'
                    type='password'
                    onChange={(e) => setPasswordValue(e.target.value)}
                    required
                  />
                </div>
                <div style={{color:'red'}}>{alert}</div>
                <div className='text-center mt-3'>
                  <MDBBtn type='submit' color='primary'>
                    התחבר
                  </MDBBtn>
                </div>
              </form>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
