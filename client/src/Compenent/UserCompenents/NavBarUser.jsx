import React, {useEffect, useState} from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logoImage from '../../Pictures/Logo.png';
import profileImage from '../../Pictures/user-avatar.png';
import { checkIsNextYearPaymentsDefined, getUserData } from '../Utils';
import '../../CSS/Navbar.css';
import MonthlyPaymentsAlert from '../MonthlyPaymentsAlert';
import {
    MDBNavbar,
    MDBContainer,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBNavbarToggler,
    MDBCollapse,
    MDBBtn,
  } from 'mdb-react-ui-kit';

export default function NavBarUser({user_id, building_id}){
    
  const [openNavCentred, setOpenNavCentred] = useState(false);
  const [userData, setUserData] = useState("");
  
  const [isNextYearPaymentDefined, setIsNextYearPaymentDefined] = useState(true);
  const [isDecember, setIsDecember] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname.includes(path);

  
  async function preLoad(){
   
      if(userData.permissions === "admin"){
        await setIsDecember(new Date().getMonth() === 11);
        await checkIsNextYearPaymentsDefined(building_id, setIsNextYearPaymentDefined);        
      }
  }

  useEffect(() => {
    getUserData(user_id, setUserData);
    
  }, [])
  useEffect(() => {
    preLoad();
  }, [userData])

  return(
    <>
      <MDBNavbar sticky expand='lg' light bgColor='light'>
        <img className='logo' src={logoImage} style={{marginRight:'5%', height: '75px' }} />
        <MDBContainer fluid>
            <MDBNavbarToggler
                type='button'
                data-target='#navbarCenteredExample'
                aria-controls='navbarCenteredExample'
                aria-expanded='false'
                aria-label='Toggle navigation'
                onClick={() => setOpenNavCentred(!openNavCentred)}
                >           
                <MDBIcon icon='bars' fas />
            </MDBNavbarToggler>
            <MDBCollapse navbar open={openNavCentred} className='justify-content-end'   id='navbarCenteredExample' >
              <MDBNavbarNav center="center" className='mb-2 mb-lg-0'>
                <MDBNavbarItem>
                  <MDBNavbarLink onClick={() => navigate('payments')} active={isActive('/payments')}>תשלומים</MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink onClick={() => navigate('building-details')} active={isActive('/building-details')}>פרטי בניין</MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink onClick={() => navigate('messages')} active={isActive('/messages')}>הודעות</MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink  onClick={() => navigate('contact-us')} active={isActive('/contact-us')}>צור קשר</MDBNavbarLink>
                </MDBNavbarItem>
              </MDBNavbarNav>
            </MDBCollapse>
            <img className='profile-big' onClick={()=> navigate('profile')} src={profileImage} style={{marginRight:'5%', height: '30px', cursor: 'pointer'}} />
            <MDBCollapse navbar open={openNavCentred} className='justify-content-start'   id='navbarCenteredExample' >
              <MDBNavbarNav center="center" className='mb-2 mb-lg-0'>
                <MDBNavbarItem> 
                  <MDBNavbarLink onClick={()=> navigate('profile')} className={isActive('/profile') ? 'active' : ''}>{userData.first_name + " " + userData.last_name}</MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  {openNavCentred && <img onClick={()=> navigate('profile')} className='profile-small' src={profileImage} style={{cursor: 'pointer'}} />}
                <MDBNavbarLink href='/' >התנתק</MDBNavbarLink>
                </MDBNavbarItem>
                {userData.permissions === "admin" && 
                <MDBNavbarItem>
                  <MDBNavbarLink>
                  <MDBBtn outline onClick={()=> navigate(`/vaad-bait/admin/${user_id}/payments`)} >לאיזור הניהול</MDBBtn>
                  </MDBNavbarLink>
                </MDBNavbarItem>
                }
              </MDBNavbarNav>
            </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
      {(isDecember && !isNextYearPaymentDefined) && <MonthlyPaymentsAlert userID={user_id} />}
    <Outlet />
  </>
  )
}