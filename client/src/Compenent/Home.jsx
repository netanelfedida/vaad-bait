import React, {useState} from 'react';
import NavBarHome from './NavBarHome';
import ContactUs from './ContactUs';
import PopLogin from './PopLogin';
import AboutUs from './AboutUs';
import { MDBBtn } from 'mdb-react-ui-kit';

export default function Home() {
    localStorage.clear();
    const [login, setLogin] = useState(false);
    
    
    const clickLoginHandle = ()=>{
      setLogin(!login);
    }

    
    const register = () => {
      alert("האתר כרגע פתוח רק למשתמשים קיימים!!");
    };

  return (
    <header id='home'>  
        <NavBarHome register={register} openLogin={clickLoginHandle}/>
      <div
        className='p-5 text-center bg-image'
        style={{ height:'75vh' }}
      >
        <div className='mask' style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <div className='d-flex justify-content-center align-items-center h-100'>
            <div style={{color:'beige'}}>
              <h1 className='mb-3'>וועד-בית</h1>
              <h4 className='mb-4'>התחילו לנהל את הבניין שלכם בצורה יעילה וחכמה!!</h4>
              <MDBBtn id='aboutUs'
                className="m-2"
                tag="a"
                outline
                size="lg"
                rel="nofollow"
                target="_self"
                onClick={clickLoginHandle}
                style={{color: 'beige', border: '1px solid beige'}}

              >
                התחברות
              </MDBBtn>
              <MDBBtn
                className="m-2"
                tag="a"
                outline
                size="lg"
                target="_blank"
                onClick={register}
                style={{color: 'beige', border: '1px solid beige'}}
              >
                להרשמה
              </MDBBtn>
            </div>
          </div>
          <div>
            <h2 className='aboutUsTitle'>מה אנחנו מציעים?</h2>
            <h4 className='aboutUsTitle'>חלק מהשרותים שלנו שהופכים את ניהול הוועד בית ליותר קל ונוח</h4>
          </div>
        </div>
    </div>
    {login && (<PopLogin onClose={clickLoginHandle} />)}
    
        <AboutUs />
      <div id='contact'>
      <br />
        <ContactUs />
      </div>
      <br />
      <br />
      <br />
    </header>
  );
}