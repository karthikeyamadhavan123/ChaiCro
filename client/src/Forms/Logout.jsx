import React from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    const auth = localStorage.getItem('Auth') || localStorage.getItem('auth');
    const parsedAuth = auth ? JSON.parse(auth) : null;
    const token = parsedAuth?.token;
    
    const handleLogout = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/logout', 
                {}, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                localStorage.removeItem('Auth');
                localStorage.removeItem('auth');
                localStorage.removeItem('registerTime')
                localStorage.removeItem('loginitem')
                toast.success('Logout Successful');
                navigate('/api/login');
            }
            

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'An error occurred during logout');
        }
    };

    return (
        <>
            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <ToastContainer />
        </>
    );
};

export default Logout;
