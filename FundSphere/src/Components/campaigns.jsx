import React from 'react'
import { Link } from 'react-router-dom'

export const Campaigns = ({ campaigns }) => {
    return (
        <div className='flex flex-wrap justify-between mt-[80px] p-[20px]'>
            {campaigns &&
                campaigns.map((campaign) => {
                    let id = campaign.campaign_id;
                    let image = campaign.campaign_photo;
                    return (
                        <Link to={`/campaign/${id}`} key={id}
                            className='flex flex-row flex-wrap space-y-4
                             items-center justify-between my-[20px] p-[15px] border-r-4 w-[40%] bg-color2 text-color1 hover:bg-color1 hover:text-color2'>
                            <div>
                                <h2>{campaign.title}</h2>
                                <p>{campaign.description}</p>
                            </div>
                            <div className='flex items-center justify-center'>

                            <img src={image} className=' h-[150px] w-[150px] object-contain ' />
                            </div>
                        </Link>
                    );
                })}
        </div>
    );
};
