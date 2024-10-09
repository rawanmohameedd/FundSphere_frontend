import React from 'react'
import { Link } from 'react-router-dom'

export const Donations = ({ donations }) => {
    return (
        <div className='flex flex-wrap  justify-center mt-[10px] p-[20px] space-x-5'>
            {donations &&
                donations.map((donation) => {
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
    )
}
