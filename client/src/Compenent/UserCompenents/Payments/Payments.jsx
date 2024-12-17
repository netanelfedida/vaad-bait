import React, {useEffect, useState} from 'react';
import FixedPayments from './FixedPayments';
import SpecialPayments from './SpecialPayments';
import HistoryPayments from './HistoryPayments';
import {
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
    MDBIcon,
    MDBBtn
  } from 'mdb-react-ui-kit';
  import { checkIsNextYearPaymentsDefined } from '../../Utils';



export default function Payments({data}) {
    const [iconsActive, setIconsActive] = useState('tab1');
    const [refresh, setRefresh] = useState(false);

    const handleIconsClick = (value) => {
      if (value === iconsActive) {
        return;
      }
      setIconsActive(value);
    };
    
    const onRefrech = () => setRefresh(!refresh)

    
    return (
    <div>
        <div className="p-3" >
      <MDBTabs  className='mb-3'>
      <MDBTabsItem>
          <MDBTabsLink className="text-black" onClick={() => {handleIconsClick('tab1');}} active={iconsActive === 'tab1'}>
            <MDBIcon fas className='me-2 text-black' />  תשלומים קבועים
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink className="text-black" onClick={() => handleIconsClick('tab2')} active={iconsActive === 'tab2'}>
            <MDBIcon fas  className='me-2 text-black' /> תשלומים מיוחדים
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink className="text-black" onClick={() => handleIconsClick('tab3')} active={iconsActive === 'tab3'}>
            <MDBIcon fas className='me-2 text-black' />הסטוריית תשלומים
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane className="text-black" open={iconsActive === 'tab1'}><FixedPayments onRefrech={onRefrech} refrech={refresh} apartment_id={data.apartment_id} permissions={data.permissions} /></MDBTabsPane>
        <MDBTabsPane open={iconsActive === 'tab2'}><SpecialPayments userID={data.user_id} onRefrech={onRefrech} apartmentID={data.apartment_id} permissions={data.permissions}/></MDBTabsPane>
        <MDBTabsPane className="text-black" open={iconsActive === 'tab3'}><HistoryPayments apartmentID={data.apartment_id} refrech={refresh} /></MDBTabsPane>
      </MDBTabsContent>
    </div>
    </div>
    )
}