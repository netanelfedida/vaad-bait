import React from "react"
import { MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";


export default function MonthlyPaymentsAlert({userID}) {
    const navigate = useNavigate();
    return(
        <div style={{padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between",color: "#dc3545", textAlign:"center", width:"30%", margin:"1% 35%", backgroundColor:"#ffe5e5", border: "1px solid #f5c6cb", borderRadius: "0.25rem"}}>
        {<h6>טרם הוגדר גובה התשלום החודשי לשנה הקרובה </h6>}
      <MDBBtn onClick={()=> navigate(`/vaad-bait/admin/${userID}/payments`, {state: {activeTab: 'tab4'}})} className='me-1' color='danger'>הגדר תשלום</MDBBtn>
    </div>
    )
}
    
  