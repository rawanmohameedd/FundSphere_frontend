import React, { useState, useEffect } from 'react';
import { Campaigns } from '../Components/campaigns';
import axios from 'axios';
import { server } from '../server';

export const Dashboard = () => {
    const [campaigns, setCampaigns] = useState(null);  
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get(`${server}/getCampains`);  
                setCampaigns(response.data);
            } catch (error) {
                console.error('Error fetching campaigns:', error); 
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    },[]);  

    if (loading) return <div>Loading...</div>;  

    return (
        <div className='flex flex-wrap justify-between  mt-[80px] md:mt-[200px] p-0'>
            <Campaigns campaigns={campaigns}  /> 
        </div>
    );
};
