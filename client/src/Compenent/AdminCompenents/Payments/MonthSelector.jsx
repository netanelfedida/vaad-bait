import React, { useEffect, useState } from "react";
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from "mdb-react-ui-kit";
import { checkIsNextYearPaymentsDefined } from "../../Utils";

export default function MonthSelector({buildingID, selectedMonth, setSelectedMonth}){
  const [isNextYearPaymentDefined, setIsNextYearPaymentDefined] = useState(true);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthOptions = [];

  async function preLoading(){
    await checkIsNextYearPaymentsDefined(buildingID, setIsNextYearPaymentDefined);
  }

  for (let i = currentMonth+1; i < 12; i++) {
    monthOptions.push({
      month: (i+1) >= 10? i+1:`0${i+1}`, 
      year: `${currentYear}`,
    });
  }


  if (currentMonth >= 10) {
    //Only if defind alredy
    if(isNextYearPaymentDefined){
      for (let i = 0; i < 12; i++) {
        monthOptions.push({
          month: (i+1) >= 10? i+1:`0${i+1}`,
          year: `${currentYear + 1}`,
        });
      }
    }
  }

 
  const handleSelect = (date) => {
    setSelectedMonth(date);
  };

  useEffect(() => {
    preLoading();
  },[])

  return (
    <div className="m-2">
      <MDBDropdown>
        <MDBDropdownToggle color="primary">
          {selectedMonth || "בחר מאיזה חודש"}
        </MDBDropdownToggle>
        <MDBDropdownMenu>
          {monthOptions.length == 0?
            <MDBDropdownItem
              link
              onClick={() => handleSelect("תחילת שנה הבאה")}
            >
              {"תחילת שנה הבאה"}
            </MDBDropdownItem> :
          monthOptions.map((month, index) => (
            <MDBDropdownItem
              key={index}
              link
              onClick={() => handleSelect(`${month.month}/${month.year}`)}
            >
              {`${month.month}/${month.year}`}
            </MDBDropdownItem>
          ))}
        </MDBDropdownMenu>
      </MDBDropdown>
    </div>
  );
};

