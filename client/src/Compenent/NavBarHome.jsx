import React, {useState} from 'react';
import logoImage from '../Pictures/Logo.png';
import '../CSS/Navbar.css';
import {
    MDBNavbar,
    MDBContainer,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBNavbarToggler,
    MDBCollapse,
  } from 'mdb-react-ui-kit';

export default function NavBarHome({openLogin, register}){
    const [openNavCentred, setOpenNavCentred] = useState(false);

    return(
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
                      <MDBNavbarLink href='#home'>עמוד הבית</MDBNavbarLink>
                    </MDBNavbarItem>
                    <MDBNavbarItem>
                      <MDBNavbarLink  href='#aboutUs'>אודות</MDBNavbarLink>
                    </MDBNavbarItem>
                    <MDBNavbarItem>
                      <MDBNavbarLink  href='#contact'>צור קשר</MDBNavbarLink>
                    </MDBNavbarItem>
                  </MDBNavbarNav>
                </MDBCollapse>
                <MDBCollapse navbar open={openNavCentred} className='justify-content-center'   id='navbarCenteredExample' >
                  <MDBNavbarNav center="center" className='mb-2 mb-lg-0'>
                    <MDBNavbarItem>
                      <MDBNavbarLink onClick={openLogin}>התחברות</MDBNavbarLink>
                    </MDBNavbarItem>
                    <MDBNavbarItem>
                      <MDBNavbarLink onClick={register}>הרשמה</MDBNavbarLink>
                    </MDBNavbarItem>
                  </MDBNavbarNav>
                </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
    )
}