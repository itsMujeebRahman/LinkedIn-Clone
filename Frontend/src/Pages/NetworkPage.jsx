import { useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../Components/Sidebar";
import { UserPlus } from "lucide-react";
import FriendRequest from "../Components/FriendRequest";
import UserCard from "../Components/UserCard";

const NetworkPage = () => {

    const queryClient = useQueryClient();
    const authUser = queryClient.getQueryData(['authUser']);

    const {data:connectionRequest} = useQuery({
        queryKey:["connectionRequest"],
        queryFn:() => axiosInstance.get("/connections/requests"),
    });

    const {data: connections} = useQuery({
        queryKey: ["connections"],
        queryFn:() => axiosInstance.get("/connections"),
    });


    return(
        <div className="max-w-7xl mx-auto px-4 ">
        <div className="grid grid-cos-1 lg:grid-cols-4 gap-6">
            <div className="col-span-1 lg:col-span-1">
                <Sidebar user={authUser} />
            </div>
            <div className="col-span-1 lg:col-span-3">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-6 text-darkgray"> My Network</h1>

                    {connectionRequest?.data?.length >0 ? (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2 text-darkgray">
                                Connection Request
                            </h2>
                            <div className="space-y-4">
                                {connectionRequest.data.map((request) => (
                                    <FriendRequest key={request._id} request={request}/>
                                ))}
                            </div>

                        </div>
                    ):(
                        <div className="bg-gray-50 rounded-lg shadow p-6 text-center mb-6 border-gray-100">
                            <UserPlus size={48} className="mx-auto text-gray-400 mb-4"/>
                            <h3 className="text-xl font-semibold text-darkgray mb-2"> No Connection Requests</h3>
                            <p className="text-gray-600">
                                You dont have any pending connction rqust at th moment
                            </p>
                            <p className="text-gray-600 mt-2">
                                Explore suggested connections blow to expand your network !
                            </p>
                        </div>
                    )}
                    {connections?.data?.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4 text-darkgray">My Connections</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {connections.data.map((connection) => (
                                    <UserCard key={connection._id} user={connection} isConnection={true} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
    )
}

export default NetworkPage;