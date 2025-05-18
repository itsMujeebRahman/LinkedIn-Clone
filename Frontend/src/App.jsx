import {Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Components/Layouts/Layout";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/Auth/LogInPage";
import SignUpPage from "./Pages/Auth/SignUpPage";
import { Toaster } from "react-hot-toast";
import {toast} from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import NotificationsPage from "./Pages/NotificationsPage";
import NetworkPage from "./Pages/NetworkPage";
import PostPage from "./Pages/PostPage";
import ProfilePage from "./Pages/ProfilePage";

function App() {

    const { data : authUser, isLoading } = useQuery({
        queryKey: ['authUser'],
        queryFn: async() => {
            try {
                const res = await axiosInstance.get("/auth/me");
                return res.data;
            } catch (err) {
                if(err.response && err.response.status === 401){
                return null
                }
                toast.error(err.response.data.message || "Somthing went wrong");
            }
        }
    });

if(isLoading) return null;

    return (
        <Layout>
            <Routes>
                <Route path='/' element={authUser ?<HomePage/>: <Navigate to ={"/login"}/>} />
                <Route path='/signup' element={!authUser ?<SignUpPage/> : <Navigate to ={"/"}/> } />
                <Route path='/login' element={!authUser ?<LoginPage/> : <Navigate to ={"/"}/>} />
                <Route path='/notifications' element={authUser ?<NotificationsPage/> : <Navigate to ={"/login"}/>} />
                <Route path='/network' element={authUser ?<NetworkPage/> : <Navigate to ={"/login"}/>} />
                <Route path='/post/:postId' element={authUser ?<PostPage/> : <Navigate to ={"/login"}/>} />
                <Route path='/profile/:username' element={authUser ?<ProfilePage/> : <Navigate to ={"/login"}/>} />
            </Routes>
            <Toaster/>
        </Layout>
    );
}

export default App;
