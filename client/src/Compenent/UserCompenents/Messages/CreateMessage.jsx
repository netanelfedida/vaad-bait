import React, { useEffect, useState } from "react";
import { MDBBtn, MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from "mdb-react-ui-kit";
import { getNeighbors } from "../../Utils";
 
export default function CreateMessage({buildingID, onClose, send}) {
    const [ listOfNeighbors, setListOfNeighbors ] = useState([]);
    const [ destination, setDestination ] = useState(0);

    useEffect(() => {
        getNeighbors(buildingID, setListOfNeighbors);
    }, [])


    return(
        <>
        <div>
            <label for="message">לשלוח ל:</label>
            <select
                    id="message"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                >
                    <option value={0}>וועד</option>
                    {listOfNeighbors.map((neighbor, index) => (
                        <option key={index} value={neighbor.apartment_id}>
                            {`${neighbor.apartment_number} ${neighbor.last_name}`}
                        </option>
                    ))}
            </select>
        </div>
        <form>
            <div>
                <label for="title">כותרת</label>
                <br/>
                <input type="text" id="title" placeholder="הכנס כותרת..." required/>
            </div>
            <div>
                <label for="messageContent">תוכן ההודעה</label>
                <br/>
                <textarea id="messageContent" placeholder="הודעה..." rows="4" cols="25" required/>
            </div>
            <br/>
            <MDBBtn type="button" onClick={() => {send(document.getElementById("title").value,destination,document.getElementById("messageContent").value,)}} color="success" className="m-1" outline>שלח</MDBBtn>
            <MDBBtn type="button" color="danger" className="m-1" onClick={onClose} outline>סגור</MDBBtn>
            
        </form>
        </>
        
    )


}