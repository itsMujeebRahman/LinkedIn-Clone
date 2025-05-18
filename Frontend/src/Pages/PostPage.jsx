import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../Components/Sidebar";
import Post from "../Components/Post";

const PostPage = () => {

    const {postId} = useParams()
    const queryClient = useQueryClient();
    const authUser = queryClient.getQueryData(['authUser']);

    const {data : post, isLoading } =useQuery({
        queryKey: ["post", postId],
        queryFn: () => axiosInstance.get(`/posts/${postId}`),
    });

    if(isLoading) return<div> Loading Post...</div>;
    if(!post?.data) return <div>Post not Found</div>;

    return(
        <div className="max-w-7xl mx-auto px-4 ">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="hidden lg:block lg:col-span-1">
                    <Sidebar user={authUser} />
                </div>
                <div className="col-span-1 lg:col-span-3">
                    <Post post={post.data}/>
                </div>
            </div>
        </div>
    )
}

export default PostPage;