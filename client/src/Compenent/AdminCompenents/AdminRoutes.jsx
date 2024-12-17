import { Routes, Route } from "react-router-dom";
import Payments from "./Payments/Payments";
import NavBarAdmin from './NavBarAdmin';
import Register from './Tenants/Register';
import Tenants from "./Tenants/Tenants";
import Messages from "../UserCompenents/Messages/Messages";


export default function UserRoutes() {
    let data = JSON.parse(localStorage.getItem("data")) || {};
    
    //All "vaad-bait" his apartment_id is 0 and reconize by building_id
    let dataForMessage = { ...data, apartment_id: 0 };
    return(
        <>
        <div>
            <Routes>
                <Route path='/' element={<NavBarAdmin data={data} />} >
                    <Route path='payments' element={<Payments data={data} />} />
                    <Route path='tenants' element={<Tenants data={data} />} />
                    <Route path='messages' element={<Messages data={dataForMessage} />} />
                    <Route path='new-user' element={<Register data={data} />} />
                </Route>
            </Routes>
        </div>
        </>
    )
}