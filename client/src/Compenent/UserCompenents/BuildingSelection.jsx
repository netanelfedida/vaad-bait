import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function BuildingSelection() {
    const [ buildings, setBuildings ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const navigate = useNavigate();
    const prevData = JSON.parse(localStorage.getItem("data")) || {};
    
    async function getBuldings(){

        try {
            const data = await fetch(`http://localhost:8080/building-details/get-buildings?userID=${prevData.user_id}`);
            const result = await data.json();
            setBuildings(result);
        } catch (err) {
            console.error(err, "Cannot fetch Financials details from server");
        }
        finally {
            setIsLoading(false); 
        }
    }

    const handleSelectBuilding = (building) => {
        const newData = {
            ...prevData,
            building_id:building.building_id,
            apartment_id:building.apartment_id,
            address:building.address,
            permissions:building.permissions
        }

        localStorage.setItem("data", JSON.stringify(newData));
    };


    useEffect(()=>{
        getBuldings();
    }, [])

    useEffect(() => {
        if(!isLoading){
            if (buildings.length === 1) {
                handleSelectBuilding(buildings[0]);
                navigate(`/vaad-bait/user/${prevData.user_id}/payments`);
            } else if (buildings.length === 0) {
                alert("משתמש יקר!! \n לפי רישומנו אינך משוייך לבניין\n נא צור קשר עם הוועד בית.");
                navigate(`/`);
            }
        }
    }, [buildings, isLoading]);



    return(
        <>
            {/* The next version i will add a buildings.map in case the user as more than one apartment
                and then set on the local storage the details of the building he choos's */}
        </>
    )
}