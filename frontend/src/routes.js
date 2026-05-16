import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Vehicles from "views/examples/Vehicles.js";
import AddVehicle from "views/examples/AddVehicle.js";
import EditVehicle from "views/examples/EditVehicle.js";

// DODATO ZA OSOBU C (Rezervacije)
import MyReservations from "views/examples/MyReservations.js";
import AvailableVehicles from "views/examples/AvailableVehicles.js";
import AllReservations from "views/examples/AllReservations.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  
  // --- VROOM KLIJENT RUTE ---
  {
    path: "/ponuda",
    name: "Ponuda Vozila",
    icon: "ni ni-active-40 text-success",
    component: <AvailableVehicles />,
    layout: "/admin",
  },
  {
    path: "/moje-rezervacije",
    name: "Moje Rezervacije",
    icon: "ni ni-calendar-grid-58 text-info",
    component: <MyReservations />,
    layout: "/admin",
  },

  // --- VROOM ADMIN RUTE ---
  {
    path: "/sve-rezervacije",
    name: "Sve Rezervacije",
    icon: "ni ni-collection text-red",
    component: <AllReservations />,
    layout: "/admin",
  },
  {
    path: "/vehicles",
    name: "Vozni Park",
    icon: "ni ni-delivery-fast text-info",
    component: <Vehicles />,
    layout: "/admin",
  },
  {
    path: "/add-vehicle",
    name: "Dodaj Vozilo",
    icon: "ni ni-fat-add text-orange",
    component: <AddVehicle />,
    layout: "/admin",
  },
  {
    path: "/edit-vehicle/:id",
    name: "Izmena Vozila",
    component: <EditVehicle />,
    layout: "/admin",
  },

  // --- OSTALE RUTE (Profil, Auth, Default Argon) ---
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tables />,
    layout: "/admin",
  },
];
export default routes;