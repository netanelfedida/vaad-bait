import { Routes, Route } from "react-router-dom";
import Payments from './Payments/Payments';
import NavBarUser from './NavBarUser';
import BuildingDetails from "./Building-details/BuildingDetails";
import Message from './Messages/Messages';
import ContactUs from "../ContactUs";
import Profile from "./Profile";


export default function UserRoutes() {
    let data = JSON.parse(localStorage.getItem("data")) || {};

    return(
        <div>
            <Routes>
                <Route path='/' element={<NavBarUser {...data} />}>
                    <Route path='payments' element={<Payments data={data}/>}/>
                    <Route path='building-details' element={<BuildingDetails data={data} />}/>
                    <Route path='messages' element={<Message data={data}/>}/>
                    <Route path='contact-us' element={<ContactUs />}/>
                    <Route path='profile' element={<Profile userID={data.user_id} />}/>
                </Route>
            </Routes>
        </div>
    )
}