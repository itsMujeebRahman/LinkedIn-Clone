import { useState } from "react";

const AboutSection =({userData, isOwnProfile, onSave}) => {

    const [isEditing, setIsEditing] =useState(false);
    const [about, setAbout] = useState(userData.about || "");

    const handleSave =() => {
        setIsEditing(false);
        onSave({about});
    }

    return(
        <div className="bg-white shadow rounded-lg p-6 mb-3">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            {isOwnProfile &&(
                <>
                    {isEditing ? (
                        <>
                            <textarea
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className="w-full p-2 border rounded edit border-gray-400 focus:border-gray-600 
                                focus:outline-none"
                                rows="4"
                            />
                            <button
                                onClick={handleSave}
                                className="mt-2 Agree text-white py-2 px-4 rounded linkedBtn transition duration-300"
                            >
                                Save
                            </button>
                        </> 
                    ):(
                        <>
                            <p>{userData.about}</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-2 linkedBtn2  transition dutration-300"
                            >
                                Edit                   
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    )
    
}

export default AboutSection;