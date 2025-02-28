import {useState} from "react"
import { Link, useNavigate } from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
// @ts-ignore
import { useAuth } from "../context/AuthContext";
function Sidebar() {
  const [ showMenu, setShowMenu ] = useState(false);
  const user = useAuth();


  const isActive = (path: string): boolean => {
    return location.pathname === path;
  }

  const navigate = useNavigate();

  const handleLogout = async () => {
      try {
          await signOut(auth);
          navigate("/auth");
      } catch (error) {
          console.error("Logout failed:", error);
      }
  }

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
            <img src="/images/icons/contact_support.svg" width={20} height={20} className="mr-2"/>
            <span className="text-lg">FAQ</span>
          </Link>
        </nav> 
      </div>

      <div className = "p-4 border-t border-[#B25F5F]">
        <div className = "flex items-center justify-between">
          <div className="">
            <div className="text-white font-medium">{user?.user.displayName || "Guest"}</div>
          </div>
          <button onClick={() => setShowMenu(!showMenu)} className="text-white hover:bg-[#B25F5F] rounded-full"> 
            <img src="/images/icons/more_vert.svg" width={20} height={20} />
          </button>
        </div>
        <div className="relative">
          <div 
            className={`
              absolute bottom-5 left-5 w-48 bg-white rounded-md shadow-lg py-1 z-10 
              transition-all duration-200 ease-in-out origin-bottom-right
              ${showMenu 
                ? 'transform scale-100 opacity-100' 
                : 'transform scale-95 opacity-0 pointer-events-none'}
            `}
          >
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar