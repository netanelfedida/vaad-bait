import { MDBBtn, MDBBtnGroup } from "mdb-react-ui-kit";
import React, { useState } from "react";
import UpdateMonthlyPayments from "./UpdateMonthlyPayment";
import AddNewPayment from "./AddNewPayment";
import AddExpensePayment from "./AddExpensePayment";




export default function EditPayments({buildingID}) {
    const [ showMonthlyPayments, setShowMonthlyPayments ] = useState(false);
    const [ showAddPayments, setShowAddPayments ] = useState(false);
    const [ showAddExpense, setShowAddExpense ] = useState(false);

    const clickHandle = (setClicked, clikedShow) => {
      setShowMonthlyPayments(false);
      setShowAddPayments(false);
      setShowAddExpense(false);
      setClicked(!clikedShow);
    }
    

    return(
        <>
          <div style={{ width: "60%", minHeight:"350px", margin: "1% 20%", padding: "20px", backgroundColor: "rgba(248, 249, 249, 0.9)"}}>
            <div style={{ width: "60%", margin: "1% 20%"}}>
              <MDBBtn className='me-1' onClick={() => clickHandle(setShowMonthlyPayments, showMonthlyPayments)} style={{marginRight:"20px",width:"150px", height:"50px"}}>עדכון תשלום חודשי</MDBBtn>
              <MDBBtn className='me-1' onClick={() => clickHandle(setShowAddPayments, showAddPayments)} style={{marginRight:"20px", width:"150px", height:"50px"}}>הוסף הוצאה</MDBBtn>
              <MDBBtn className='me-1' onClick={() => clickHandle(setShowAddExpense, showAddExpense)} style={{marginRight:"20px", width:"150px", height:"50px"}}>הוסף חיוב</MDBBtn>
            </div>

            <div>
            { showMonthlyPayments && 
              <UpdateMonthlyPayments buildingID={buildingID} />}
            { showAddPayments && 
              <AddExpensePayment buildingID={buildingID} />}
            { showAddExpense && 
              <AddNewPayment buildingID={buildingID} />}
            </div>
          </div>


        </>
    )
}