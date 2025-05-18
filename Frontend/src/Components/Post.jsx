import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {
  Share2,
  ThumbsUp,
  Trash2,
  Loader,
  MessageCircle,
  Send,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import PostAction from "./PostAction";
import { formatDistanceToNow } from "date-fns";
import ShareOption from "./ShareOptions";
import { AnimatePresence } from "framer-motion";

const Post = ({ post }) => {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);
  const [showComments, setShowComments] = useState(false);
  const [newComments, setNewComments] = useState("");
  const [deletingComments, setDeletingComments] = useState([]);
  const [comments, setComments] = useState(post.comments || []);
  const [newShareOption, setNewShareOption] = useState(false);
  const isOwner = authUser._id === post.author._id;
  const isLiked = post.likes.includes(authUser._id);
  const shareOptionRef = useRef(null);

  useEffect(() => {
    console.log("deleting", deletingComments);
  }, [deletingComments]);

  const { mutate: deletePost, isPending: isDeletingpost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("post deleted Successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: createComments, isPending: isAddingComments } = useMutation({
    mutationFn: async (newComments) => {
      await axiosInstance.post(`/posts/${post._id}/comments`, {
        content: newComments,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added successfully");
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to add comments");
    },
  });

  const { mutate: deleteComments, isPending: isDeleteComments } = useMutation({
    mutationFn: async (commentId) => {
      await axiosInstance.delete(`/posts/${post._id}/comments`, {
        data: { content: commentId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment deleted Successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    },
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/likes`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deletePost();
  };

  const handleLikePost = async () => {
    if (isLikingPost) return;
    likePost();
  };

  const handleAddComments = async (e) => {
    e.preventDefault();
    if (newComments.trim()) {
      createComments(newComments);
      setNewComments("");
      setComments([
        ...comments,
        {
          _id: Date.now().toString(),
          content: newComments,
          user: {
            _id: authUser._id,
            name: authUser.name,
            profilePicture: authUser.profilePicture,
          },
          createdAt: new Date(),
        },
      ]);
    }
  };

  const handleDeleteComments = (commentId) => {
    setDeletingComments((p) => [...p, commentId]);
    if (!window.confirm("Are you sure you want to delete this post?")) {
      setDeletingComments((p) => {
        p?.filter((i) => {
          return i != commentId;
        });
      });
      return;
    }
    deleteComments(commentId);
    setDeletingComments((p) => {
      return p?.filter((i) => {
        return i != commentId;
      });
    });
  };

  const handleShareOptions = () => {
    setNewShareOption(!newShareOption);
  };

  const handleShareClickOutside = (clickOutside) => {
    if (
      shareOptionRef.current &&
      !shareOptionRef.current.contains(clickOutside.target)
    ) {
      setNewShareOption(false);
    }
  };

  useEffect(() => {
    if (newShareOption) {
      document.addEventListener("mousedown", handleShareClickOutside);
    } else {
      document.removeEventListener("mousedown", handleShareClickOutside);
    }
  }, [newShareOption]);

  return (
    <div className="bg-white rounded-lg shadow mb-4 text-darkgray">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to={`/profile/${post?.author?.username}`}>
              <img
                src={post.author.profilePicture || "/avatar.png"}
                alt={post.author.name}
                className="size-10 rounded-full mr-3 object-cover"
              />
            </Link>

            <div>
              <Link to={`/profile/${post?.author?.username}`}>
                <h3 className="font-semibold">{post.author.name}</h3>
              </Link>
              <p className="text-darkgray text-xs">{post.author.headLine}</p>
              <p className="text-xs text-darkgray">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700"
            >
              {isDeletingpost ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="post Content"
            className="rounded-lg w-full mb-4"
          />
        )}

        <div className="flex justify-between text-darkgray">
          <PostAction
            icon={
              <ThumbsUp
                size={18}
                className={isLiked ? "text-blue-500  fill-blue-300" : ""}
              />
            }
            text={`Like (${post.likes.length})`}
            onClick={handleLikePost}
          />

          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment (${comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />

          <div className="relative" ref={shareOptionRef}>
            <PostAction
              icon={<Share2 size={18} />}
              text="Share"
              onClick={() => handleShareOptions()}
            />
            <AnimatePresence>
              {newShareOption && <ShareOption />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="mb-2 bg-gray-50 p-4 rounded-2xl flex items-start"
              >
                <img
                  src={comment.user.profilePicture || "/avatar.png"}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full mr-2 flx-shrink-0 object-cover"
                />
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold mr-2">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-darkgray">
                      {formatDistanceToNow(new Date(comment.createdAt))}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
                {isOwner && (
                  <button
                    onClick={() => handleDeleteComments(comment._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    {deletingComments?.includes(comment._id) ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
          <form
            onSubmit={handleAddComments}
            className="flex items-center justify-between"
          >
            <input
              type="text"
              value={newComments}
              onChange={(e) => setNewComments(e.target.value)}
              placeholder="Add a comment..."
              className="w-134 p-2 flex-grow mr-3 rounded-full bg-base-100 focus:outline-none focus:ring-1 focus:ring-blue-700"
            />

            <button
              type="submit"
              className="Agree p-2.5 rounded-full linkedBtn transition duration-300"
              disabled={isAddingComments}
            >
              {isAddingComments ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Post;
