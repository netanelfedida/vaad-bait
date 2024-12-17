import React, { useEffect, useState} from "react";
import { Outlet, useLocation, useNavigate  } from "react-router-dom";
import { getUserData, getAdrres, checkIsNextYearPaymentsDefined} from "../Utils";
import MonthlyPaymentsAlert from '../MonthlyPaymentsAlert';
import logoImage from '../../Pictures/Logo.png';
import '../../CSS/Navbar.css';
import {
    MDBBtn,
    MDBNavbar,
    MDBContainer,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBNavbarToggler,
    MDBCollapse,
  } from 'mdb-react-ui-kit';



export default function NavBarAdmin({data}){
    const [ address, setAddress ] = useState("");
    const [ openNavCentred, setOpenNavCentred ] = useState(false);
    const [ userData, setUserData ] = useState("");
    const [ loading, setLoading ] = useState(true);
    const [isNextYearPaymentDefined, setIsNextYearPaymentDefined] = useState(true);
    const [isDecember, setIsDecember] = useState(false);
    
    const navigate = useNavigate();
    const { building_id, user_id } = data;

    async function getFetch(){
      if(!userData){
        await getUserData(user_id, setUserData);
      }
        await getAdrres(building_id, setAddress);
        if(userData.permissions === "admin"){
          await setIsDecember(new Date().getMonth() === 11);
          await checkIsNextYearPaymentsDefined(data.building_id, setIsNextYearPaymentDefined);        
        }
        setLoading(false);
    }
    const location = useLocation();
    const isActive = (path) => location.pathname.includes(path);

    useEffect(() => {
        getFetch();
      }, [userData]);
    
    if (loading) return <p>Loading...</p>;
    
    if (userData.permissions !== "admin") {
        alert(`${userData.first_name} ${userData.last_name}, אינך מורשה לאיזור ניהול!!`);
        navigate('/');
        return null;
      }

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
                    <MDBNavbarLink onClick={() => navigate('tenants')} active={isActive('/tenants')}>דיירים</MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink onClick={() => navigate('messages')} active={isActive('/messages')}>הודעות</MDBNavbarLink>
                  </MDBNavbarItem>
                </MDBNavbarNav>
              </MDBCollapse>
              <MDBCollapse navbar open={openNavCentred} className='justify-content-center' id='navbarCenteredExample' >
                <MDBNavbarNav center="center" className='mb-2 mb-lg-0'>
                <MDBNavbarItem> 
                    <MDBNavbarLink >{address.length > 0 ?`${address[0].address}`: ""}</MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink href='/'>התנתק</MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarLink>
                      <MDBBtn outline onClick={()=> navigate(`/vaad-bait/user/${user_id}/payments`)}>חזרה לאיזור אישי</MDBBtn>
                    </MDBNavbarLink>
                </MDBNavbarNav>
              </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      {(isDecember && !isNextYearPaymentDefined) && <MonthlyPaymentsAlert userID={user_id}/>}
      <Outlet />
    </>
    
    )
}