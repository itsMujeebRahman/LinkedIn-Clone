import { Link } from "react-router-dom";
import {Home, UserPlus, Bell} from "lucide-react";

export default function Sidebar({ user }) {
    return(
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 text-center">
                <div className="h-16 rounded-t-lg bg-cover bg-center"
                    style={{backgroundImage:`url("${user.bannerImg || "/banner.png"}")`,}}
                />
                <Link to={`/profile/${user.username}`}>
                    <img 
                        src={user.profilePicture || "/avatar.png"}
                        alt={user.name}
                        className="w-20 h-20 rounded-full mx-auto mt-[-40px] object-cover"
                    />
                    <h2 className="text-xl font-semibold mt-2 text-darkgray">{user.name}</h2>
                </Link>
                <p className="text-darkgray">{user.headLine}</p>
                <p className="text-darkgray text-xs">{user.connections.length} Connections</p> 
            </div>
            <div className="border-t border-gray-200 p-4">
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/"
                                className="flex items-center py-2 px-4 rounded-md hover:bg-gray-400
                                hover:text-white transition-colors text-darkgray"
                            >
                                <Home className="mr-2" size={20} /> Home
                            </Link>
                        </li>

                        <li>
                            <Link 
                                to="/network"
                                className="flex items-center py-2 px-4 rounded-md hover:bg-gray-400
                                hover:text-white transition-colors text-darkgray"
                            >
                                <UserPlus className="mr-2" size={20} /> My Network
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/notifications"
                                className="flex items-center py-2 px-4 rounded-md hover:bg-gray-400
                                hover:text-white transition-colors text-darkgray"
                            >
                                <Bell className="mr-2" size={20} /> Notifications
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="border-t border-gray-200 p-4">
                <Link to={`/profile/${user.username}`} className="text-sm font-semibold
                                hover:text-gray-400 transition-colors text-darkgray">
                    Visit your profile
                </Link>
            </div>
        </div>
    );
}