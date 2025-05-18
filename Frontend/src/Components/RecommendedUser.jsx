import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";

    const  RecommendedUser =({user}) => {
        const queryClient = useQueryClient();

        const {data:connectionStatus, isLoading} = useQuery({
            queryKey:["connectionStatus", user._id],
            queryFn: () => axiosInstance.get(`/connections/status/${user._id}`),
        })

        const {mutate:sendConnectionRequest} = useMutation({
            mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
            onSuccess: () => {
                toast.success("Connection rquest send Successfully")
                queryClient.invalidateQueries({queryKey:["connectionStatus",user._id]})
                
            },
            onError:(error) => {
                toast.error(error.response?.data?.error || "An error Occured");
            },
        })

        const {mutate:acceptRequest} = useMutation({
            mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
            onSuccess : () => {
                toast.success("Connection Request accpted")
                queryClient.invalidateQueries({queryKey: ["connectionStatus", user._id]})
                queryClient.invalidateQueries({queryKey:["connectionRequest"]})
            },
            onError: (error) => {
                toast.error(error.response?.data?.error || "An error occured");
            },
        })

        const {mutate:rejectRequest} = useMutation({
            mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
            onSuccess : () => {
                toast.success("Connection Request rejected")
                queryClient.invalidateQueries({queryKey: ["connectionStatus", user._id]})
                queryClient.invalidateQueries({queryKey:["connectionRequest"]})
            },
            onError: (error) => {
                toast.error(error.response?.data?.error || "An error occured");
            },
        })

        const renderButton =() => {
            if(isLoading){
                return(
                    <button className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500" disabled>
                        Loading...
                    </button>
                );
            };

            switch(connectionStatus?.data?.status){
                case "pending":
                    return(
                        <button
                            className="px-3 py-1 rounded-full txt-sm bg-yellow-500 text-white flex items-center"
                            disabled
                        >
                            <Clock size={16} className="mr-1" />
                            Pending
                        </button>
                    );
                case "received":
                    return(
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => acceptRequest(connectionStatus.data.requestId)}
                                className={`rounded-full p-1 flex items-center justify-center bg-green-500 
                                    hover:bg-gren-600 text-white`}
                            >
                                <Check size={16} />
                            </button>

                            <button
                                onClick={() => rejectRequest(connectionStatus.data.requestId)}
                                className={`rounded-full p-1 flex items-cnter justify-center bg-red-500 
                                    hover:bg-red-600 text-white`}
                            >
                                <X size={16}/>
                            </button>
                        </div>
                    );
                case "connected":
                    return(
                        <button
                            className="px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center"
                            disabled
                        >
                            <UserCheck size={16} className="mr-1" />
                            Connected
                        </button>
                    )
                default:

                const handleConnect =() => {
                    
                    if (connectionStatus?.data?.status == "not_connected"){
                        sendConnectionRequest(user._id);
                    }
                };
                    return(
                        <button
                            className="px-3 py-1 rounded-full text-sm transition-colors duration-200 flex items-center suggest"
                            onClick={handleConnect}
                        >
                            <UserPlus size={16} className="mr-1" />
                            Connect
                        </button>
                    )
            }
        };

        return(
            <div className="flex items-center justify-between mb-4">
                <Link to={`/profile/${user.username}`} className="flex items-center flex-grow">
                <img
                    src={user.profilePicture || "/avatar.png"}
                    alt={user.name}
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                />
                <div>
                    <h3 className="font-semibold text-sm text-darkgray">{user.name}</h3>
                    <p className="text-xs text-darkgray">{user.headLine}</p>
                </div>
                </Link>
                {renderButton()}
            </div>
        );
    };

export default RecommendedUser;