import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";

const ProfileHeader =({isOwnProfile, onSave, userData}) => {

    const [isEditing, setIsEditing] = useState(false)
    const [editedData, setEditedData] = useState({});
    const queryClient = useQueryClient();

    const authUser = queryClient.getQueryData(['authUser']);

    const {data: connectionStatus, refetch: refetchConnectionStatus} = useQuery({
        querykey: ["connectionStatus" , userData._id],
        queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
        enabled: !isOwnProfile,
    })

    const isConnected = userData.connections.some((connection) => connection === authUser._id);

    const {mutate: sendConnectionRequest} = useMutation({
        mutationFn : (userId) => axiosInstance.post(`/connections/request/${userId}`),
        onSuccess: ()=> {
            toast.success("Connection Request send");
            refetchConnectionStatus();
            queryClient.invalidateQueries(["connectionRequest"]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "An error occured");
        },
    });
    

    const {mutate: acceptRequest} = useMutation({
        mutationFn : (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
        onSuccess: ()=> {
            toast.success("Connection Request Accepted");
            refetchConnectionStatus();
            queryClient.invalidateQueries(["connectionRequest"]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "An error occured");
        },
    });

    const {mutate: rejectRequest} = useMutation({
        mutationFn : (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
        onSuccess: ()=> {
            toast.success("Connection Request Rejected");
            refetchConnectionStatus();
            queryClient.invalidateQueries(["connectionRequest"]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "An error occured");
        },
    });
   
    const {mutate: removeConnection} = useMutation({
        mutationFn : (userId) => axiosInstance.delete(`/connections/${userId}`),
        onSuccess: ()=> {
            toast.success("Connection removed");
            refetchConnectionStatus();
            queryClient.invalidateQueries(["connectionRequest"]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "An error occured");
        },
    });

    const getConnectionStatus = useMemo(() => {
        if (connectionStatus?.data?.status) return connectionStatus.data.status;
        return "not_connected";
    }, [isConnected, connectionStatus]);
    
    const renderConnectionButton = () => {
        const baseClass ="text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";
        switch(getConnectionStatus) {
            case "connected":
                return (
                    <div className="flex gap-2 justify-center">
                        <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
                            <UserCheck size={20} className="mr-2" />
                            Connected
                        </div>
                        <button
                            className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
                            onClick={() => removeConnection(userData._id)}
                        >
                            <X size={20} className="mr-2" />
                            Remove Connection
                        </button>
                    </div>
                )

            case "pending":
                return(
                    <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
                        <Clock size={20} className="mr-2" />
                        Pending
                    </button>  
                )

            case "received":
                return(
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => acceptRequest(connectionStatus.data.requestId)}
                            className={`${baseClass} bg-green-500 hover:bg-green-600`}
                        >
                            Accept
                        </button>

                        <button
                            onClick={() => rejectRequest(connectionStatus.data.requestId)}
                            className={`${baseClass} bg-red-500 hover:bg-red-600`}
                        >
                            Reject
                        </button>
                    </div>
                )

            default:
                return(
                    <button
                        onClick={() => sendConnectionRequest(userData._id)}
                        className="Agree linkdBtn text-white py-2 px-4 rounded-full transition duration-300
                        flex items-center justify-center"
                    >
                        <UserPlus size={20} className ="mr-2" />
                        Connect
                    </button>
                );
        }   
        
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedData((prev) => ({...prev, [e.target.name]: reader.result}));
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSave = () => {
        onSave(editedData);
        setIsEditing(false);
    }


    return(
        <div className="bg-white shadow rounded-lg mb-3">
            <div
                className="relative h-48 rounded-t-lg object-cover bg-center"
                style={{
                    backgroundImage: `url('${editedData.bannerImg || userData.bannerImg || "/banner.png"}')`,
                }}
            >
                {isEditing && (
                    <label className='absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer'>
                        <Camera size={20} />
                        <input
                            type='file'
                            className="hidden"
                            name="bannerImg"
                            onChange={handleImageChange}
                            accept='Image/*'
                        />
                    </label>
                )}
            </div>
            <div className="p-4">
                <div className="relative -mt-20 mb-4">
                    <img
                        className="w-32 h-32 rounded-full mx-auto object-cover"
                        src={editedData.profilePicture || userData.profilePicture ||"/avatar.png"}
                        alt={userData.name}
                    />

                    {isEditing && (
                        <label className='absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 
                        rounded-full shadow cursor-pointer'>
                            <Camera size={20} />
                            <input
                                type="file"
                                className="hidden"
                                name="profilePicture"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </label>
                    )}
                </div>
                <div className="text-center mb-4">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedData.name ?? userData.name}
                            onChange={(e) => setEditedData({...editedData, name: e.target.value})}
                            className="text-2xl font-bold mb-2 text-center w-full"
                        />
                    ):(
                        <h1 className="text-2xl font-bold mb-2">{userData.name}</h1>
                    )}

                    {isEditing ? (
                        <input
                            type="text"
                            value={editedData.headLine ?? userData.headLine}
                            onChange={(e) => setEditedData({...editedData, headLine: e.target.value})}
                            className="text-gray-600 text-center w-full "
                        />
                    ):(
                        <div className="text-gray-600">{userData.headLine}</div>
                    )}

                    <div className="flex justify-center items-center mt-2">
                        <MapPin size={16} className="text-gray-500 mr-1"/>
                        {isEditing ? (
                            <input 
                                type="text"
                                value={editedData.location ?? userData.location}
                                onChange={(e) => setEditedData({...editedData, location: e.target.value})}
                                className="text-gray-600 text-center "
                            />
                        ):(
                            <span className="text-gray-600">{userData.location}</span>
                        )}
                    </div>
                </div>
                {isOwnProfile ? (
                    isEditing ? (
                        <button
                            onClick={handleSave}
                            className="w-full linkedBtn text-white py-2 px-4 rounded-full 
                            transition duration-300"
                            >
                                Save Profile
                            </button>
                    ):(
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full linkedBtn text-white py-2 px-4 rounded-full 
                            transition duration-300"
                            >
                                Edit Profile
                            </button>
                    )
                ):(
                    <div className="flex justify-center">{renderConnectionButton()}</div>
                )}
            </div>
        </div>
    )
};

export default ProfileHeader;