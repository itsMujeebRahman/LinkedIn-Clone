import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import ProfileHeader from "../Components/ProfileHeader";
import AboutSection from "../Components/AboutSection";
import ExperienceSection from "../Components/ExperienceSection";
import EducationSection from "../Components/EducationSection";
import SkillsSection from "../Components/SkillsSection";
import toast from "react-hot-toast";

const ProfilePage = () => {

    const {username} = useParams();
    const queryClient = useQueryClient();

    const authUser = queryClient.getQueryData(['authUser']);
    const isLoading = queryClient.getQueryData(['isLoading']);

    const{data: userProfile, isLoading: isUserProfileLoading}= useQuery({
        queryKey: ["userProfile", username],
        queryFn: () => axiosInstance.get(`/users/${username}`),
    });

    const { mutate: updateProfile } = useMutation({
		mutationFn: async (updatedData) => {
			await axiosInstance.put("/users/profile", updatedData);
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries(["userProfile", username]);
		},
	});

    if(isLoading || isUserProfileLoading) return null;

    const isOwnProfile = authUser.username === userProfile.data.username;
    const userData = isOwnProfile? authUser : userProfile.data

    const handleSave =(updatedData) => {
        updateProfile(updatedData)
    }

     return(
        <div className="max-w-4xl mx-auto p-4 text-darkgray">
            <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
            <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
            <ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
            <EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
            <SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
        </div>
    )
}

export default ProfilePage;