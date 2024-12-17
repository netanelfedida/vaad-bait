import React, { useEffect, useState } from "react";
import {
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane
  } from 'mdb-react-ui-kit';
import PendingPayments from "./PendingPayments";
import EditPayments from "./EditPayments";
import HistoryPayments from "./HistoryPayments";
import TenantDebtBalance from "./TenantDebtBalance";
import { useLocation } from "react-router-dom";

export default function Payments({data}) {
    const [ basicActive, setBasicActive ] = useState('tab1');
    const [ refresh, setRefresh ] = useState(false);
    const location = useLocation();

    const { user_id, apartment_id, building_id } = data;
  
    const onRefresh = () => setRefresh(!refresh);

    const handleBasicClick = (value) => {
        if (value === basicActive) {
          return;
        }
        setBasicActive(value);
      };

      useEffect(() => {
        if (location.state?.activeTab) {
          setBasicActive(location.state.activeTab);
        }
      }, [location.state]);


    return(
        <>
            <MDBTabs  pills className='mt-5 justify-content-center'>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleBasicClick('tab1')} active={basicActive === 'tab1'}>
                    {<h6>תנועות אחרונות בקופה</h6>}
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleBasicClick('tab2')} active={basicActive === 'tab2'}>
                  {<h6>תשלומים הממתינים לאישור</h6>}
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleBasicClick('tab3')} active={basicActive === 'tab3'}>
                  {<h6>יתרת חוב לפי דיירים</h6>}
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleBasicClick('tab4')} active={basicActive === 'tab4'}>
                  {<h6>פעולות נוספות</h6>}
                  </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent>
              <MDBTabsPane open={basicActive === 'tab1'}><HistoryPayments refresh={refresh} buildingID={building_id} /></MDBTabsPane>
              <MDBTabsPane open={basicActive === 'tab2'}><PendingPayments onRefresh={onRefresh} buildingID={building_id} /> </MDBTabsPane>
              <MDBTabsPane open={basicActive === 'tab3'}><TenantDebtBalance refresh={refresh} buildingID={building_id}/> </MDBTabsPane>
              <MDBTabsPane open={basicActive === 'tab4'}><EditPayments buildingID={building_id}/> </MDBTabsPane>
            </MDBTabsContent>
        </>
    )
}




