import React, { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo_transparent.png';
import defaultProfile from '../assets/download (1).jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';
import Cookies from 'js-cookie';
import { buttonStyles } from '../Components/navbar';
import axios from 'axios';
import { server } from '../server';
import { handleFullscreen } from '../Components/fullscreen';
import { Campaigns } from '../Components/campaigns';
import Popup from '../Components/popup'; 

export const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [showCampaigns, setShowCampaigns] = useState(false); // toggle campaigns list
    const [userCampaigns, setUserCampaigns] = useState([]); // User Campaigns data
    const [donations, setDonations] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showFileInput, setShowFileInput] = useState(false);
    const [popupMessage, setPopupMessage] = useState(''); // State for popup message
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility
    const navigate = useNavigate();
    const mediaRef = useRef(null);

    const handleSignOut = () => {
        Cookies.remove('authToken'); // Remove the cookie
        navigate('/'); // Redirect to home page after popup is displayed
    };

    const handleFileChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleProfileUpload = async () => {
        if (!selectedImage) {
            setPopupMessage('Please select a file first.');
            setIsPopupOpen(true);
            return;
        }

        const formData = new FormData();
        formData.append('photo', selectedImage);

        try {
            const response = await axios.post(`${server}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('authToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProfile(response.data.user);
            setPopupMessage('Profile photo updated successfully');
            setIsPopupOpen(true);
            setShowFileInput(false); // Hide file input after successful upload
        } catch (err) {
            console.error("Error uploading profile photo:", err.message);
            setPopupMessage('Failed to upload profile photo');
            setIsPopupOpen(true);
        }
    };

    const handleProfileDelete = async () => {
        try {
            const response = await axios.delete(`${server}/deleteProfilePhoto`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('authToken')}`
                }
            });
            setProfile(response.data.user);
            setPopupMessage('Profile photo deleted successfully');
            setIsPopupOpen(true);
        } catch (err) {
            console.error("Error deleting profile photo:", err.message);
            setPopupMessage('Failed to delete profile photo');
            setIsPopupOpen(true);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${server}/getProfile`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('authToken')}`
                    }
                });
                setProfile(response.data);
            } catch (err) {
                console.error("can't fetch this profile", err.message);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get(`${server}/getCampainsbyUser`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('authToken')}`
                    }
                });
                setUserCampaigns(response.data);
                console.log(response.data);
            } catch (err) {
                console.error("can't fetch campaigns", err.message);
            }
        };

        fetchCampaigns();
    }, []);

    return (
        <>
            {/* Different Navbar */}
            <header className="flex justify-between items-center bg-color1 text-color2 text-lg font-bold w-full fixed top-0 left-0 p-4 z-50">
                <Link to={'/'}>
                    <img src={logo} alt="Logo" className='object-contain w-[150px] h-[100px]' />
                </Link>
                <button onClick={handleSignOut} className={`${buttonStyles} flex items-center space-x-2`} >
                    <FaSignOutAlt /> <span>Sign out</span>
                </button>
            </header>

            <div className="flex flex-col justify-center p-8 min-h-screen pt-[120px] overflow-y-auto w-screen">
                {/* User Data Section */}
                <section className="relative mb-8 pb-4 border-b border-gray-300 flex flex-col  ">
                    <div>
                        {profile ? (
                            <div className="flex flex-row items-center space-x-4 mt-8">
                                <img
                                    src={profile.profile_photo || defaultProfile}
                                    alt="Profile"
                                    className='w-[250px] h-[250px]'
                                    ref={mediaRef}
                                    onClick={() => handleFullscreen(mediaRef)}
                                />
                                <div className='flex flex-col w-full'>
                                    <div>
                                        <p className="text-lg"> <span className='font-bold'>Username: </span>{profile.username}</p>
                                        <p className="text-lg"> <span className='font-bold'>Email: </span>{profile.email}</p>
                                    </div>

                                    {showFileInput && (
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="mt-4"
                                        />
                                    )}
                                    <div className='flex flex-row space-x-7 justify-between'>
                                        <button
                                            onClick={() => setShowFileInput(!showFileInput)}
                                            className={`${buttonStyles} ml-auto flex items-center space-x-2 right-0 top-0 mt-4`}
                                        >
                                            {showFileInput ? 'Cancel' : 'Upload your Profile Photo'}
                                        </button>
                                        {showFileInput && <button onClick={handleProfileUpload} className={`${buttonStyles} ml-auto flex items-center space-x-2 right-0 top-0 mt-4`}> Save</button>}

                                    </div>

                                    <button
                                        onClick={handleProfileDelete}
                                        className={`${buttonStyles} ml-auto flex items-center space-x-2 right-0 top-0 mt-4`}
                                    >
                                        Delete your Profile Photo
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p>Loading profile...</p>
                        )}
                    </div>
                </section>

                {/* Campaigns Section */}
                <section className="relative mb-8 pb-4 border-b border-gray-300 flex flex-col ">
                    <div className='flex flex-row justify-between items-center space-x-2'>
                        <h2
                            className="text-xl font-semibold flex justify-between items-center cursor-pointer"
                            onClick={() => setShowCampaigns(!showCampaigns)}
                        >
                            Your Campaigns {showCampaigns ? <FaChevronUp /> : <FaChevronDown />}
                        </h2>
                        <Link to={'/create'} className={`${buttonStyles} right-0 top-0 mr-5 z-20`}>
                            Start new Campaign
                        </Link>
                    </div>

                    <div className={` ${showCampaigns ? 'max-h-full' : 'max-h-0'} overflow-hidden`}>
                        <Campaigns campaigns={userCampaigns} edit={1}/>
                        
                    </div>
                </section>

                {/* Donations Section */}
                <section className="relative mb-8 pb-4 flex flex-col ">
                    <h2
                        className="text-xl font-semibold flex items-center cursor-pointer"
                        onClick={() => setDonations(!donations)}
                    >
                        Your Donations {donations ? <FaChevronUp /> : <FaChevronDown />}
                    </h2>
                    <div className={`transition-all duration-500 ${donations ? 'max-h-[500px]' : 'max-h-0'} overflow-hidden`}>
                        <div className="mt-4">
                            <p className="text-lg">Donation 1</p>
                            <p className="text-lg">Donation 2</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Popup for messages */}
            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Notification"
                content={popupMessage}
            />
        </>
    );
};
