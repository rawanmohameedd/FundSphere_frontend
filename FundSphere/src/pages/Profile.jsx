import React, { useEffect, useState } from 'react';
import logo from '../assets/logo_transparent.png';
import defaultProfile from '../assets/download (1).jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';
import Cookies from 'js-cookie';
import { buttonStyles } from '../Components/navbar';
import axios from 'axios';
import { server } from '../server';

export const Profile = () => {
    const [profile, setProfile] = useState(null)
    const [campaigns, setCampaigns] = useState(false);
    const [donations, setDonations] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = () => {
        Cookies.remove('authToken'); // Remove the cookie
        navigate('/'); // Redirect to home page after popup is displayed
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${server}/getProfile`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('authToken')}`
                    }
                })
                console.log(response.data)
                setProfile(response.data)
            } catch (err) {
                console.error("can't fetch this profile", err.message)
            }
        }
        fetchProfile()
    }, [])
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

            <div className="flex flex-col p-8 min-h-screen pt-[160px] overflow-y-auto"> {/* Adjust padding-top for navbar height */}
                {/* User Data Section */}
                <section className="relative mb-8 pb-4 border-b border-gray-300 flex flex-col  w-screen">

                    <div>
                        {profile ? (
                            <div className="flex flex-row items-center space-x-4 mt-8">
                                <img src={profile.profile_photo || defaultProfile} alt="Profile" />
                                <div className='flex flex-col w-full'>
                                    <div>
                                    <p className="text-lg"> <span className='font-bold'>Username: </span>{profile.username}</p>
                                    <p className="text-lg"> <span className='font-bold'>Email: </span>{profile.email}</p>
                                </div>
                                    <button className={`${buttonStyles} ml-auto flex items-center space-x-2  right-0 top-0 mt-4  `}>
                                        <BiEdit /> <span>Edit Your Profile</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p>Loading profile...</p>
                        )}
                    </div>

                </section>

                {/* Campaigns Section */}
                <section className="relative mb-8 pb-4 border-b border-gray-300 flex flex-col w-screen">
                    <div className='flex flex-row  justify-between items-center space-x-2'>
                        <h2
                            className="text-xl font-semibold flex justify-between items-center cursor-pointer"
                            onClick={() => setCampaigns(!campaigns)}
                        >
                            Your Campaigns {campaigns ? <FaChevronUp /> : <FaChevronDown />}
                        </h2>
                        <button className={`${buttonStyles}  right-0 top-0 mr-5 z-20`}>
                            Start new project
                        </button>
                    </div>
                    <div className={`transition-all duration-500 ${campaigns ? 'max-h-[500px]' : 'max-h-0'} overflow-hidden`}>

                        <div className="mt-4">

                            <p className="text-lg">Campkhbihkjsldfhrfoifjfbhdsvogpouopgvtgjaign 1</p>
                            <p className="text-lg">Campaign 2</p>
                        </div>
                    </div>
                </section>

                {/* Donations Section */}
                <section className="relative mb-8 pb-4  flex flex-col  w-screen">
                    <h2
                        className="text-xl font-semibold flex  items-center cursor-pointer"
                        onClick={() => setDonations(!donations)}
                    >
                        Your Donations {donations ? <FaChevronUp /> : <FaChevronDown />}
                    </h2>
                    <div className={`transition-all duration-500 ${donations ? 'max-h-[500px]' : 'max-h-0'} overflow-hidden`}>
                        <div className="mt-4">
                            <p className="text-lg">Donatioiugyffdudftydyyrdujyuuxryhvjgfdtrxyhgjjkgftn 1</p>
                            <p className="text-lg">Donation 2</p>
                        </div>
                    </div>
                </section>
            </div >
        </>
    );
};
