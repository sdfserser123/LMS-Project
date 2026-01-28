import SignOut from '../../components/auth/signout'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/axios';
import { useAuthStore } from '../../stores/userAuthStore';
import { toast } from 'sonner';

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const accessToken = useAuthStore();

    const handleOnClick = async () => {
        try {
            await api.get("/users/test", {withCredentials: true});
            console.log(accessToken)
            toast.success("Ok")
        } catch (error) {
            toast.error("fail")
            console.log(error)
        }
    }

    return (
        <div>
            <button
            type="button"
            onClick={() => { navigate('/adduser') } }
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
            >User Management Page</button>
            <button
            type="button"
            onClick={handleOnClick }
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
            >Test</button>
            <SignOut/>

        </div>
    )
}