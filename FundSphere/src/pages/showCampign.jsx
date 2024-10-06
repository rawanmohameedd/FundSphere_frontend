import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { server } from '../server'; 

const Campaign = () => {
    const [campaign, setCampaign] = useState(null); // Set initial state to null
    const [loading, setLoading] = useState(); // Set loading state
    const [error, setError] = useState(''); // State to handle errors
    const  campaign_id  = 5; // Get campaign_id from the URL

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await axios.get(`${server}/getCampaign/${campaign_id}`);
                setCampaign(response.data.result);
                console.log(response.data.result) // Assuming API response is in 'result'
                setLoading(false); // Stop loading after fetching
            } catch (err) {
                console.error('Error fetching campaign:', err.message);
                setError('Failed to fetch campaign details.');
                setLoading(false); // Stop loading after error
            }
        };

        
        if (campaign_id) {
            fetchCampaign(); // Fetch campaign if ID is present
        }
    }, [campaign_id]);

    return (
        <div className="flex justify-center items-center w-full my-[350px]">
            <div className="bg-color1 shadow-lg rounded-lg p-8 max-w-lg space-y-6 overflow-y-auto">
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
                            src={campaign.campaign_photo || 'https://via.placeholder.com/150'} 
                            alt="Campaign"
                            className="w-full h-auto rounded-md mt-4"
                        />
                        <p><strong>Description:</strong> {campaign.description}</p>
                        <p><strong>Created At:</strong> {new Date(campaign.created_at).toLocaleDateString()}</p>
                        <p><strong>Start Date:</strong> {new Date(campaign.start_date).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(campaign.end_date).toLocaleDateString()}</p>
                        <p><strong>Goal Amount:</strong> ${campaign.goal_amount}</p>
                        <p><strong>Current Amount:</strong> ${campaign.current_amount}</p>
                        <p><strong>Created by:</strong> {campaign.user?.username}</p>
                        <p><strong>Status:</strong> Ongoing</p>
                        {/* Render the category name from the category object */}
                        <p><strong>Category:</strong> {campaign.category?.name}</p>
                    </>
                ) : (
                    <p>No campaign found.</p>
                )}
            </div>
        </div>
    );
};

export default Campaign;
