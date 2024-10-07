import React from 'react';
import { BiEdit } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { buttonStyles } from './navbar'; 

export const Campaigns = ({ campaigns, edit }) => {
    return (
        <div className='flex flex-wrap justify-between mt-[80px] p-[20px]'>
            {campaigns &&
                campaigns.map((campaign) => {
                    const id = campaign.campaign_id;
                    const image = campaign.campaign_photo;

                    return (
                        <div key={id} className='flex flex-row flex-wrap space-y-4 space-x-4 w-[40%] md:w-[90%] items-center justify-between mb-4 p-4 border border-gray-200 rounded-lg hover:bg-color1'>
                            <Link to={`/campain/${id}`} className='flex flex-1 text-color2  hover:text-inherit space-x-2'>
                                <div>
                                    <h2>{campaign.title}</h2>
                                    <p>{campaign.description}</p>
                                    <p>Goal Amount: ${campaign.goal_amount}</p>
                                    <p>Current Amount: ${campaign.current_amount}</p>
                                </div>
                                <div className='flex items-center justify-center'>
                                    <img src={image} alt={campaign.title} className='h-[150px] w-[150px] object-contain' />
                                </div>
                            </Link>
                            
                            {edit && (
                                <Link
                                    className={`${buttonStyles} flex items-center space-x-2`}
                                    to={`/edit/${id}`}
                                >
                                    <BiEdit /> Edit Campaign
                                </Link>
                            )}
                        </div>
                    );
                })}
        </div>
    );
};
