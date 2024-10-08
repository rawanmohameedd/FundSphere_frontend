import React from 'react'
import { useParams } from 'react-router-dom'

export const DonateHistory = () => {
    const campaign_id = useParams()
    const id = Number(campaign_id.campaign_id)
    console.log(id)
  return (
    <div>DonateHistory</div>
  )
}
