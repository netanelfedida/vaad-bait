import React, { useEffect, useState } from "react";
import {
    MDBBtnGroup,
    MDBBtn ,
    MDBIcon,
    MDBDropdown,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBDropdownItem,
} from "mdb-react-ui-kit";
import PopMessage from "./PopMessage";
import CreateMessage from "./CreateMessage";
import PopUp from "../../PopUp";

export default function Messages({ data }) {
    const [messagesDetails, setMessagesDetails] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filterBy, setFilterBy] = useState("הכל");
    const [typeOfMessage, setTypeOfMessage] = useState("דואר נכנס");
    const [showPopCreateMessage, setShowPopCreateMessage ] = useState(false);

    const {apartment_id, user_id, building_id} = data;


    async function getMessagesDetails() {
        console.log("][[][][------------------]", building_id, data);
        
        try {
            const data = await fetch(`http://localhost:8080/messages?buildingID=${building_id}&apartmentID=${apartment_id}&filter=${filterBy}&type=${typeOfMessage}`);
            const result = await data.json();
            setMessagesDetails(result);
        } catch (err) {
            console.error(err, "Cannot fetch Financials details from server");
        }
    }

    //Update status of message to read
    async function openMessage(message) {
        try {
            await fetch(`http://localhost:8080/messages/open?messageID=${message.message_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
    
        } catch (err) {
            console.error(err, "Cannot fetch open message from server");
        }
        setSelectedMessage(message);
        setFilterBy("הכל");
    }

    async function sendMessage(title, destination, message){
        if(!title || !message){
            alert("יש למלא את כל השדות")
            return;
        }
        try {
            await fetch(`http://localhost:8080/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id,
                    destination,
                    title,
                    message,
                    apartment_id,
                    building_id
                }),
            });
    
        } catch (err) {
            console.error(err, "Cannot fetch open message from server");
        }
        getMessagesDetails();
        setShowPopCreateMessage(false);

    }

    async function deleteMessage(message){
        try {
            const response = await fetch(`http://localhost:8080/messages/delete?messageID=${message.message_id}&type=${typeOfMessage}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json"
                }
            });

            if (response.ok) {
              const result = await response.json();
              console.log(result.message);
            } else {
              const error = await response.json();
              console.error(error.error);
            }
        } catch (err) {
            console.error("Error deleting the message:", err);
        }
        getMessagesDetails();
    };

    const openPopCreateMessage = () => {
        setShowPopCreateMessage(true);
    };

    const closePopCreateMessage = () => {
        setShowPopCreateMessage(false);
    };

    function closePop() {
        setSelectedMessage(null);
    }

    useEffect(() => {
        getMessagesDetails();
    }, [filterBy, selectedMessage, typeOfMessage]);

    return (
        <>
                <div style={{ 
                    width: "50%",
                    margin: "7% 30% 2% 30%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"}}>
                
                <MDBBtnGroup style={{display: "flex", gap: "10px" }} shadow='0'>
                    <MDBBtn 
                        onClick={(e) => { e.preventDefault(); setTypeOfMessage("דואר נכנס"); }} 
                        color={typeOfMessage === "דואר נכנס" ? "light" : "primary"}
                    >
                    דואר נכנס
                    </MDBBtn>
                    <MDBBtn 
                        onClick={(e) => { e.preventDefault(); setTypeOfMessage("דואר יוצא"); }} 
                        color={typeOfMessage === "דואר יוצא" ? "light" : "primary"}
                    >
                    דואר יוצא
                    </MDBBtn>
                </MDBBtnGroup>

                {typeOfMessage === "דואר נכנס" && 
                    <MDBDropdown>
                        <MDBDropdownToggle>{`מיין לפי: ${filterBy}`} </MDBDropdownToggle>
                        <MDBDropdownMenu>
                            <MDBDropdownItem 
                                link
                                onClick={(e) => { e.preventDefault(); setFilterBy("הכל"); }} 
                             >הכל
                            </MDBDropdownItem>
                            <MDBDropdownItem 
                                link
                                onClick={(e) => { e.preventDefault(); setFilterBy("נקרא"); }} 
                                 >נקרא
                            </MDBDropdownItem>
                            <MDBDropdownItem 
                                link
                                onClick={(e) => { e.preventDefault(); setFilterBy("לא נקרא"); }} 
                                 >לא נקרא
                            </MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                }
            </div>
            
            <MDBBtn
                    style={{float:"right", marginRight:"6%"}}
                    onClick={openPopCreateMessage} 
                    color="primary"
                >
                <MDBIcon fas icon="plus" />
                {" הודעה חדשה"}
            </MDBBtn>
            
            <table style={{ width: "70%", margin: "1% 15%" }} className="table table-light">
                <thead>
                    <tr>
                        {typeOfMessage === "דואר נכנס" &&
                            <th scope="col" className="col-1"><MDBIcon far icon="envelope" /></th>
                        }
                        <th scope="col" className="col-2">שם</th>
                        <th scope="col" className="col-8">כותרת</th>
                        <th scope="col" className="col-2">תאריך</th>
                        <th scope="col" className="col-1"><MDBIcon far icon="trash-alt" /></th>
                    </tr>
                </thead>
                <tbody>
                    {messagesDetails.map((message, index) => (
                        <tr key={index} onClick={() => openMessage(message)}>
                            {typeOfMessage === "דואר נכנס" &&
                                <td><MDBIcon far icon={message.status === "נקרא" ? "envelope-open" : "envelope"} /></td>
                            }
                            <td>
                                <div>
                                    {typeOfMessage === "דואר נכנס"
                                        ? message.send_by_last_name || "וועד"
                                        : message.send_to_last_name || "וועד"}
                                </div>
                                {((typeOfMessage === "דואר נכנס" && message.send_by_apartment_number) ||
                                    (typeOfMessage !== "דואר נכנס" && message.send_to_apartment_number)) && (
                                    <div style={{ fontSize: "10px" }}>
                                        {`דירה ${
                                            typeOfMessage === "דואר נכנס"
                                                ? message.send_by_apartment_number
                                                : message.send_to_apartment_number
                                        }`}
                                    </div>
                                )}
                            </td>
                            <td>{message.title}</td>
                            <td>{new Date(message.date).toLocaleDateString('he-IL')}</td>
                            <td><MDBIcon 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteMessage(message)
                                    }} 
                                far 
                                icon="trash-alt"
                                style={{ cursor: "pointer" }} 
                            /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PopUp show={showPopCreateMessage} onClose={closePopCreateMessage}>
                    <h2>{"הודעה חדשה"}</h2>
                <CreateMessage buildingID={building_id} send={sendMessage} onClose={closePopCreateMessage}/>
            </PopUp>
            {selectedMessage && (
                <PopMessage
                    show={!!selectedMessage}
                    close={closePop}
                    message={selectedMessage}
                />
            )}
        </>
    );
}
