import React, { useEffect, useState } from "react";
import {
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane
  } from 'mdb-react-ui-kit';
import TenantsDetails from "./TenantsDetails";
import BuildingFinancialsDetails from "./BuildingFinancialsDetails";

export default function BuildingDetails({data}) {
    const [basicActive, setBasicActive] = useState('tab1');

    const handleBasicClick = (value) => {
        if (value === basicActive) {
          return;
        }
        setBasicActive(value);
      };

    useEffect(() => {
    }, [])


    return(
        <>
            <MDBTabs  pills className='mb-3 justify-content-center'>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleBasicClick('tab1')} active={basicActive === 'tab1'}>
                    {<h6>דיירים</h6>}
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleBasicClick('tab2')} active={basicActive === 'tab2'}>
                  {<h6>מצב הקופה</h6>}
                  </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent>
              <MDBTabsPane open={basicActive === 'tab1'}><TenantsDetails data={data} /></MDBTabsPane>
              <MDBTabsPane open={basicActive === 'tab2'}><BuildingFinancialsDetails buildingID={data.building_id} /></MDBTabsPane>
            </MDBTabsContent>
        </>
    )
}




