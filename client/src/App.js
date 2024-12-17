import {  Route, Routes } from 'react-router-dom';
import 'mdb-react-ui-kit/dist/css/mdb.rtl.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Home from './Compenent/Home';
import backgroundImage from './Pictures/cityscape-wuxi.jpg';
import UserRoutes from './Compenent/UserCompenents/UserRoutes';
import AdminRoutes from './Compenent/AdminCompenents/AdminRoutes';
import BuildingSelection from './Compenent/UserCompenents/BuildingSelection';

function App() {
  return (
    <div    
      style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      minHeight: '1200px',
      width: '100%',
      margin: 0,
    }}>
      <Routes>
        <Route path='/' element={<Home />} />
          <Route path='/vaad-bait' >
          <Route path='user/:user_id/buildings-selection' element={<BuildingSelection />}/>
          <Route path='user/:user_id/*' element={<UserRoutes />} />
          <Route path='admin/:user_id/*' element={<AdminRoutes />} />
        </Route>
      </Routes>
    </div>
    
  );
}

export default App;
