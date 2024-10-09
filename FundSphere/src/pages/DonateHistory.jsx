import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Donations } from '../Components/Donations'
import { server } from '../server'

export const DonateHistory = () => {
    const campaign_id = useParams()
    const id = Number(campaign_id.campaign_id)
    console.log(id)

    const [donations, setDonations] = useState([])
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get(`${server}/campaignDonations/${id}`)
                setDonations(response.data)
                console.log(response.data)
            } catch (err) {
                console.error("can't get user donations", err.message)
            }
        }
        fetchDonations()
    }, [id])
    return (
        <>
            {donations ?(
                <div>
                    <Donations donations={donations} />
                </div>
            ):(
            <div>
                This campaign hasn't had any donations yet
            </div>
            )}
        </>
    )
}
