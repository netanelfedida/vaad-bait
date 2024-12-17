import React, { useEffect, useState } from "react";
import PopPaymentsMethods from '../../PopUp';
import PaymentMethods from './PaymentsMethode';
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
    MDBDropdown, 
    MDBDropdownMenu, 
    MDBDropdownToggle, 
    MDBDropdownItem
} from 'mdb-react-ui-kit';
import '../../../CSS/SpecialPayments.css';


export default function SpecialPayments({permissions, apartmentID, onRefrech}) {
    const [ listOfPayments, setListOfPayments ] = useState([]);
    const [ selectedPayments, setSelectedPayments ] = useState([]);
    const [ selectedCreditPayments, setSelectedCreditPayments ] = useState([]);
    const [ selectedAll, setSelectedAll ] = useState(false);
    const [ sumOfPayment, setSumOfPayment ] = useState(0);
    const [ showPopMessage , setShowPopMessage] = useState(false);
    const [ filterBy, setFilterBy ] = useState("הכל");
    const [ alert, setAlert ] = useState({});
    



    async function getAllPayments(){
        try{
            const response = await fetch(`http://localhost:8080/payments/speciales-payments/?apartmentID=${apartmentID}&status=${filterBy}`);
            const result = await response.json();           
            setListOfPayments(result);
        } catch(err){
            console.error(err, "Cannot fetch payments details from server");
        }
    }

    //Open or Close the payment popup
    const openPaymentModal = () => {
        setShowPopMessage(true);
    };

    const closePaymentModal = () => {
        setShowPopMessage(false);
    };



    const handleCashPayment = async() =>{
        const transactionDetails = {
                    apartmentID: apartmentID,
                    paymentMethode: 'מזומן',
                    permissions: permissions,
                    sumOfTransiction: sumOfPayment,
                    specialPayments: selectedPayments,
                    creditPayments: selectedCreditPayments
                }
        try{
            const response = await fetch('http://localhost:8080/payments/special-payments-process', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionDetails)
            });
            if (response.ok) {
                const data = await response.json();
                setAlert({message: data.Success, color: 'green'});
                setSelectedPayments([]);
                setSelectedCreditPayments([]);
                setSumOfPayment(0)
                onRefrech();
            } else {
                setAlert({message: "תהליך הביצוע נכשל", color: 'red'});
            }
        }catch(error){
            setAlert({message: "עקב בעית תקשורת תהליך הביצוע נכשל\n אנא נסה שנית!!", color: 'red'});
        }
        closePaymentModal();
        getAllPayments();
    }

    function selectAllCheckbox(){
        if(selectedAll){
            setSelectedPayments([]);
            setSelectedCreditPayments([]);
            setSumOfPayment(0)
        }
        else{
            
            const unpaidSpecialPayments = listOfPayments.filter(payment => payment.status === "לא שולם" && payment.type === "special_payment");
            setSelectedPayments(unpaidSpecialPayments.map(payment => payment.payment_id));

            const unpaidCreditPayments = listOfPayments.filter(payment => payment.status === "לא שולם" && payment.type !== "special_payment");
            setSelectedCreditPayments(unpaidCreditPayments.map(payment => payment.payment_id));
            

            setSumOfPayment(
                unpaidSpecialPayments.reduce((total, payment) => {return total + Number(payment.amount)},0) + 
                unpaidCreditPayments.reduce((total, payment) => {return total + Number(payment.amount)},0)
                )
        }
        setSelectedAll(!selectedAll);
    }

    useEffect(() => {
        
    }, [selectedPayments, sumOfPayment]);

    function handleCheckboxChange(paymentId, type, amount) {
        if(type === 'special_payment') {
            setSelectedPayments((prevSelected) => {
                if (prevSelected.includes(paymentId)) {
                    setSumOfPayment(sumOfPayment - amount);
                    return prevSelected.filter((id) => id !== paymentId);
                } else {
                    setSumOfPayment(sumOfPayment + amount);
                    return [...prevSelected, paymentId];
                }
            });
        } else if (type === "השלמה") {
            setSelectedCreditPayments ((prevSelected) => {
                if (prevSelected.includes(paymentId)) {
                    setSumOfPayment(sumOfPayment - amount);
                    return prevSelected.filter((id) => id !== paymentId);
                } else {
                    setSumOfPayment(sumOfPayment + amount);
                    return [...prevSelected, paymentId];
                }
            });
        }
    }
    

    useEffect(()=>{
        getAllPayments();
          
    },[filterBy]);
    
    return(
        <>
    <div className="flex-container">
    <div style={{color:`${alert.color}`}}>{alert.message}</div>
    <span className={`sum ${sumOfPayment != 0 ? 'show' : 'hide'}`}>
        {`סכום לתשלום: ₪${sumOfPayment}`}
        <MDBBtn onClick={openPaymentModal} className='me-1'>
            למעבר לתשלום
        </MDBBtn>
        <PopPaymentsMethods show={showPopMessage} onClose={closePaymentModal}>
            <h2 className='text-black'>בחר אמצעי תשלום</h2>
            <PaymentMethods handleCashPayment={handleCashPayment} />
        </PopPaymentsMethods>
    </span>
    <MDBDropdown className="mdb-dropdown">
        <MDBDropdownToggle>{`סנן לפי: ${filterBy}`}</MDBDropdownToggle>
        <MDBDropdownMenu>
            <MDBDropdownItem link onClick={(e) => { e.preventDefault(); setFilterBy("הכל") }}>הכל</MDBDropdownItem>
            {permissions != "admin"?<MDBDropdownItem link onClick={(e) => { e.preventDefault(); setFilterBy("ממתין לאישור") }}>ממתין לאישור</MDBDropdownItem>: null}
            <MDBDropdownItem link onClick={(e) => { e.preventDefault(); setFilterBy("בוצע") }}>בוצע</MDBDropdownItem>
            <MDBDropdownItem link onClick={(e) => { e.preventDefault(); setFilterBy("לא שולם") }}>לא שולם</MDBDropdownItem>
        </MDBDropdownMenu>
    </MDBDropdown>
</div>

            <MDBTable striped responsive className="table table-primary"  style={{width:'70%', margin: "1% 15%"}}>
                <MDBTableHead light>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">סכום</th>
                    <th scope="col">סיבת התשלום</th>
                    <th scope="col">תאריך</th>
                    <th scope="col">סטטוס</th>
                    <th scope="col">אסמכתא</th>
                    <th scope="col">
                            <input
                              type="checkbox"
                              checked={selectedAll}
                              onChange={() => selectAllCheckbox()}
                            />
                    </th>
                  </tr>

                </MDBTableHead>
                <MDBTableBody>
                    {listOfPayments.map((payment, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td scope="row">{index + 1}</td>
                                <td>{payment.amount}₪</td>
                                <td>{payment.description}</td>
                                <td>
                                  {payment.date? 
                                    new Date(payment.date).toLocaleDateString('he-IL'): ''}
                                </td>
                                <td>{payment.status === 'בוצע' ? '✅' : payment.status === 'לא שולם' ? '❌' : '⌛'}</td>
                                <td>{payment.status === 'לא שולם'?"#000":`#${payment.transaction_id}`}</td>
                                <td>
                                  {payment.status === 'לא שולם' && (
                                    <input
                                      type="checkbox"
                                      checked={payment.type === "special_payment"? 
                                        selectedPayments.includes(payment.payment_id):
                                        selectedCreditPayments.includes(payment.payment_id)}
                                      onChange={() => handleCheckboxChange(payment.payment_id, payment.type, Number(payment.amount))}
                                    />
                                  )}
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </MDBTableBody>
            </MDBTable>
        </>
        
    )
  }