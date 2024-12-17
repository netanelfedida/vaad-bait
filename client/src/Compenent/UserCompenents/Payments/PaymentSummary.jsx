import React, { useEffect, useState } from 'react';

export default function PaymentSummary({ apartmentId, refrech}){
    const [allSummaries, setAllSummaries] = useState({});
    async function getAllPayments(){
        try{
            const response = await fetch(`http://localhost:8080/payments/summary-fixed-payments?apartmentID=${apartmentId}`)

            const result = await response.json();
            await setAllSummaries(result[0]);
            
            
        } catch(err){
            console.error(err, "Cannot fetch payments details from server");
        }
    }
    
    useEffect(() => {
        getAllPayments();
    }, [refrech])

    return (
        <div className="payment-summary">
            <p className='text-black'>שולם: {allSummaries.sumPaid} , ממתין לאישור: {allSummaries.sumPending},  טרם שולם: {allSummaries.sumUnPaid}</p>
        </div>
    );
};
