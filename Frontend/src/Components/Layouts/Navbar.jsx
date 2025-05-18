import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link, useLocation } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";

const Navbar = () => {
  const queryClient = useQueryClient();
  //const {data: authUser} = queryClient.getQueryData(['authUser']);
  const authUser = queryClient.getQueryData(["authUser"]);

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => axiosInstance.get("/notifications"),
    enabled: !!authUser,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequest"],
    queryFn: async () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const location = useLocation();
  const isHome = location.pathname === "/";
  const isNetwork = location.pathname === "/network";
  const isNotification = location.pathname === "/notifications";
  const isMe = location.pathname === `/profile/${authUser?.username}`;

  const unreadNotificationCount = notifications?.data.filter(
    (notif) => !notif.read
  ).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img
                className="h-8 rounded"
                src="/small-logo.png"
                alt="LinkedIn"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {authUser ? (
              <>
                <Link
                  to={"/"}
                  className="text-neutral flex flex-col items-center "
                >
                  <Home
                    size={20}
                    className={isHome ? "text-blue-600" : "text-neutral"}
                  />
                  <span className="text-xs hidden md:block">Home</span>
                </Link>

                <Link
                  to="/network"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Users
                    size={20}
                    className={isNetwork ? "text-blue-600" : "text-neutral"}
                  />
                  <span className="text-xs hidden md:block">My Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/notifications"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Bell
                    size={20}
                    className={
                      isNotification ? "text-blue-600" : "text-neutral"
                    }
                  />
                  <span className="text-xs hidden md:block">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs
                                            rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>

                <Link
                  to={`/profile/${authUser.username}`}
                  className="text-neutral flex flex-col items-center"
                >
                  <User
                    size={20}
                    className={isMe ? "text-blue-600" : "text-neutral"}
                  />
                  <span className="text-xs hidden md:block"> Me </span>
                </Link>

                <button
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => logout()}
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline"> Logout </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn bg-white border-none hover:bg-gray-100 shadow-none linkedBtn2"
                >
                  Sign In
                </Link>
                <Link to="/signup" className="btn linkedBtn border-none">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
