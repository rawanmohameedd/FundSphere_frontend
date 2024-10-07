import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { server } from '../server'; 
import { buttonStyles } from '../Components/navbar';
import { BiDonateHeart } from 'react-icons/bi';

const Campaign = () => {
    const [campaign, setCampaign] = useState(null);
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(); 
    const [error, setError] = useState(''); 
    const  campaign_id  = useParams(); 
    const id = Number(campaign_id.camaign_id)

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await axios.get(`${server}/getCampaign/${id}`);
                setCampaign(response.data.result);
                setLoading(false); // Stop loading after fetching
            } catch (err) {
                console.error('Error fetching campaign:', err.message);
                setError('Failed to fetch campaign details.');
                setLoading(false); // Stop loading after error
            }
        };

        
        if (id) {
            fetchCampaign(); // Fetch campaign if ID is present
        }
    }, [id]);

    useEffect(() => {
        if (campaign) {
            const handleStatus = () => {
                const { end_date, goal_amount, current_amount } = campaign;
                const endDate = new Date(end_date).getTime();
                const now = Date.now();
                
                if (endDate < now) {
                    setStatus('Donation Period Closed');
                } else {
                    if (current_amount >= goal_amount) {
                        setStatus('Goal Achieved!');
                    } else {
                        setStatus('Still Accepting Donations');
                    }
                }
            };
            
            handleStatus(); 
        }
    }, [campaign]);


    return (
        <div className="flex justify-center items-center  mt-[350px] mb-[150px] mx-[50px]">
            <div className=" shadow-lg rounded-lg p-8 space-y-6 overflow-y-auto flex flex-col flex-wrap  space-x-4  items-center justify-between mb-4 border border-gray-200 ">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="loader" />
                        <p>Loading...</p>
                    </div>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : campaign ? (
                    <>
                        <h2 className="text-2xl font-bold text-center">{campaign.title}</h2>
                        <img 
                            src={campaign.campaign_photo} 
                            alt="Campaign"
                            className="w-[550px] h-[550px] rounded-md mt-4"
                        />
                        <div className='text-left space-y-4'>

                        <p><strong>Description:</strong> {campaign.description}</p>
                        <p><strong>Created At:</strong> {new Date(campaign.created_at).toLocaleDateString()}</p>
                        <p><strong>Start Date:</strong> {new Date(campaign.start_date).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(campaign.end_date).toLocaleDateString()}</p>
                        <p><strong>Goal Amount:</strong> ${campaign.goal_amount}</p>
                        <p><strong>Current Amount:</strong> ${campaign.current_amount}</p>
                        <p><strong>Created by:</strong> {campaign.user?.username}</p>
                        <p><strong>Status:</strong> {status}</p>
                        <p><strong>Category:</strong> {campaign.category?.name}</p>
                        </div>
                        <Link className={`${buttonStyles} flex flex-row justify-center w-[50%] `}> <BiDonateHeart/>Donate </Link>
                    </>
                ) : (
                    <p>No campaign found.</p>
                )}
            </div>
        </div>
    );
};

export default Campaign;
