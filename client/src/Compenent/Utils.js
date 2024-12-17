
export async function getUserData(userID, setData){
      
  try {
    const response = await fetch(`http://localhost:8080/profile?userID=${userID}`);
    const data = await response.json();
    await setData(data[0])
  } catch (error) {
    console.error(error);
    
  }
}

export async function getNeighbors(buildingID, setData) {
  try {
      const data = await fetch(`http://localhost:8080/messages/get-neighbors?buildingID=${buildingID}`);
      const result = await data.json();
      
      setData(result);
  } catch (err) {
      console.error(err, "Cannot fetch Financials details from server");
  }
  
}

export async function getTenantsDetails(buildingID, setData){
  try {
      const data = await fetch(`http://localhost:8080/building-details/tenants?buildingID=${buildingID}`);
      const result = await data.json(); 
      await setData(result);
  } catch(err){
      console.error(err, "Cannot fetch tenants details from server");
  }
}

export function isFieldEmpty(value, message){
  if(!value){
    message({message: "יש למלא את כל השדות!!", color: "red"});
    return true;
  }
  message({});
  return false;
}

export async function getFinancialsDetails(buildingID, filterBy, setBuildingFinancialsDetails){
  try {
      const data = await fetch(`http://localhost:8080/building-details/building-financials?buildingID=${buildingID}&filter=${filterBy}`);
      const result = await data.json(); 
      await setBuildingFinancialsDetails(result);
  } catch(err){
      console.error(err, "Cannot fetch Financials details from server");
  }
}

export async function getAdrres(buildingID, setAdrres){
  try{
      const response = await fetch(`http://localhost:8080/building-details/addres?buildingID=${buildingID}`)
      const result = await response.json();
      setAdrres(result);
       
  } catch(err){
      console.error(err, "Cannot fetch building details from server");
  }
} 

export function validCheckbox(emailCheck, setMessage){
  if(!emailCheck){
    setMessage({message: "אנא אשר קבלת עידכונים במייל!!", color: "red"});
    return false;
  }
  setMessage({});
  return true;
}

export function validEmail(email, setErrorMessage) {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!regex.test(email)) {
      setErrorMessage({message: "כתובת המייל אינה תקינה!!", color: "red"});
      return false;
    } else {
      setErrorMessage({});
      return true;
    }
  }
  
  export function validPassword(password, confirmPassword, setErrorMessage) {
    if (password !== confirmPassword) {
      setErrorMessage({message: "הסיסמאות לא תואמות!!", color: 'red'});
      return false;
    } else {
      setErrorMessage({});
      return true;
    }
  }

  export function validPhone(phoneNumber, setErrorMessage){
    if(phoneNumber.length != 10){
      setErrorMessage({message: "מספר הטלפון לא תקין!!", color: 'red'})
      return false;
    } else {
      setErrorMessage({});
      return true;
    }
  }

  export async function checkIsNextYearPaymentsDefined(buildingID, setIsNextYearPaymentDefined){
    try {
      console.log("buildingID: ", buildingID);
      
      const data = await fetch(`http://localhost:8080/admin/payments/check-next-year-payments?buildingID=${buildingID}`);
      const result = await data.json(); 
      setIsNextYearPaymentDefined(result > 0);
  } catch(err){
      console.error(err, "Cannot fetch check next year payments");
  }
  }

