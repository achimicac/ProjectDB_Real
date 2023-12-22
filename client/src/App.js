
import {
  BrowserRouter,
  Routes,
  Route,
  } from "react-router-dom";
import Pet from "./pages/home/Pet"
import Articles from "./pages/Articles/Articles";
import EditPet from "./pages/EditPet/EditPet";
import PetInfo from "./pages/PetInfo/PetInfo"
import Calendar from "./pages/Calendar/Calendar";
import Login from "./pages/login/Login"
import Register from "./pages/Register/Register"
import Profile from "./pages/userprof/Profile";
import Addpet from "./pages/Addpet/Addpet";
import Records from "./pages/Record/Record";
import EditUser from "./pages/EditUser/EditUser";
import Addrecord from "./pages/AddRecord/addrecord";

function App() {

  return (
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Pet />} />
        <Route path="/logout" element={<Pet />} />
                <Route path="/home" element={<Pet />} />
                <Route path="/login" element={<Login />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/petprofile/:petid" element={<PetInfo />} />
                <Route path="/petprofile/:petid/edit" element={<EditPet />} />
                <Route path="/petregister" element={<Addpet />} />
                <Route path="/petprofile/:petid/vaccine" element={<PetInfo />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/register" element={<Register />} />
                <Route path="/userprofile" element={<Profile />} />
                <Route path="/appointment/:appid" element={<Calendar />} />
                <Route path="/petprofile/:petid/record" element={<Records />} />
                <Route path="/appointment" element={<Calendar />} />
                <Route path="/calendar/:data" element={<Calendar />} />
                <Route path="/petprofile/:petid/addrecord" element={<Addrecord />} />
                <Route path="/userprofile/edit" element={<EditUser />} />
                <Route path="/petprofile/:petid/delete" element={<EditPet />} />
                
        </Routes>
    </BrowserRouter>
  );
}

export default App;
