import {useState} from "react"
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [ showMenu, setShowMenu ] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  }

  const handleLogout = async() => {
    try{
      if(logout){
        await logout();
      }
      setShowMenu(false);
    }catch(error){
      console.log("logout error:", error);
    }

  };



  return (
    <div className="min-h-screen bg-[#9F3737] w-64 flex flex-col justify-between">
      <div className="p-6">
        <div className="text-white">
          <img src = "/images/logo/gh_logo.svg" width={40} height={60} className="mb-4"/>
        </div>
      </div>

      <div className="flex-1">
        <nav className="px-4 py-2">
          <Link to="/home" className={`p-2 rounded-lg flex items-center ${isActive("/home") ? "bg-[#5E1C1B]" : "hover:bg-[#B25F5F]"}`}>
            <img src="/images/icons/cottage.svg" width={20} height={20} className="mr-2"/>
            <span className="text-lg">Home</span>
          </Link>
          <Link to="/schedule" className={`p-2 rounded-lg flex items-center ${isActive("/schedule") ? "bg-[#5E1C1B]" : "hover:bg-[#B25F5F]"}`}>
            <img src="/images/icons/calendar_month.svg" width={20} height={20} className="mr-2"/>
            <span className="text-lg">Schedule</span>
          </Link>
          <Link to="/ticket" className={`p-2 rounded-lg flex items-center ${isActive("/ticket") ? "bg-[#5E1C1B]" : "hover:bg-[#B25F5F]"}`}>
            <img src="/images/icons/confirmation_number.svg" width={20} height={20} className="mr-2"/>
            <span className="text-lg">Ticket</span>
          </Link>
          <Link to="/mentorship" className={`p-2 rounded-lg flex items-center ${isActive("/mentorship") ? "bg-[#5E1C1B]" : "hover:bg-[#B25F5F]"}`}>
            <img src="/images/icons/group_search.svg" width={20} height={20} className="mr-2"/>
            <span className="text-lg">Mentorship</span>
          </Link>
          <Link to="/faq" className={`p-2 rounded-lg flex items-center ${isActive("/faq") ? "bg-[#5E1C1B]" : "hover:bg-[#B25F5F]"}`}>
            <img src="/images/icons/more_vert.svg" width={20} height={20} className="mr-2"/>
            <span className="text-lg">FAQ</span>
          </Link>

        </nav> 
      </div>
    </div>
  )
}

export default Sidebar