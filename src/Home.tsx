import Sidebar from './components/Sidebar'
import { signOut } from 'firebase/auth';
import { auth } from './utils/firebase';
import { useNavigate } from 'react-router-dom';

function Home() {
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
    <div>
        <Sidebar />
        <button onClick={handleLogout} className="underline text-black cursor-pointer"> 
            Log out
        </button>
    </div>
  )
}

export default Home