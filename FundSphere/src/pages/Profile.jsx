import React, { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo_transparent.png';
import defaultProfile from '../assets/download (1).jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaSignOutAlt, FaUser } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { buttonStyles } from '../Components/navbar';
import axios from 'axios';
import { server } from '../server';
import { handleFullscreen } from '../Components/fullscreen';
import { Campaigns } from '../Components/campaigns';
import Popup from '../Components/popup';
import { Footer } from '../Components/footer';

export const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [showCampaigns, setShowCampaigns] = useState(false); // toggle campaigns list
    const [userCampaigns, setUserCampaigns] = useState([]); // User Campaigns data
    const [donations, setDonations] = useState(false);
    const [userDonations, setUserDonations] = useState([])
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

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get(`${server}/userDonations`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('authToken')}`
                    }
                });
                setUserDonations(response.data);
                console.log(response.data);
            } catch (err) {
                console.error("can't fetch donations", err.message);
            }
        };

        fetchDonations();
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
                        <Campaigns campaigns={userCampaigns} edit={1} />

                    </div>
                </section>

                {/* Donations Section */}
                <section className="relative mb-8 pb-4 flex flex-col justify-center">
                    <h2
                        className="text-xl font-semibold flex items-center cursor-pointer mb-5"
                        onClick={() => setDonations(!donations)}
                    >
                        Your Donations {donations ? <FaChevronUp /> : <FaChevronDown />}
                    </h2>
                    <div className={` ${donations ? 'max-h-full' : 'max-h-0'} overflow-hidden `}>
                        <div className='flex flex-wrap  justify-center mt-[10px] p-[20px] space-x-5'>
                            {userDonations &&
                                userDonations.map((donation) => {
                                    const id = donation.donation_id
                                    const date = new Date(donation.donation_date).toISOString().split('T')[0]
                                    const image = donation.campaign.campaign_photo;

                                    return (
                                        <div key={id} className='flex flex-col flex-wrap space-y-4 space-x-4 w-[40%] md:w-[90%] items-center justify-between mb-4 p-4 border border-gray-200 rounded-lg hover:bg-color1'>
                                            <Link to={`/campain/${donation.campaign_id}`} className='flex flex-1 text-color2  hover:text-inherit space-x-2'>
                                                <p className='flex items-center justify-center'>
                                                    You donate {donation.amount} for {donation.campaign.title} at {date}
                                                </p>
                                                <div className='flex items-center justify-center'>
                                                    <img src={image} alt={donation.campaign.title} className='h-[150px] w-[150px] object-contain' />
                                                </div>

                                            </Link>
                                        </div>
                                    )
                                })

                            }
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
            <Footer/>
        </>
    );
};
