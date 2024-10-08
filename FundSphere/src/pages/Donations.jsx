import React, { useState } from 'react';
import axios from 'axios';
import { BsPaypal } from 'react-icons/bs';
import { buttonStyles, inputStyles } from '../Components/navbar';
import { BiCreditCard } from 'react-icons/bi';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../Components/popup'; 
import Cookies from 'js-cookie';
import { server } from '../server';

export const Donations = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiryDate: '' });
  const [paypalEmail, setPaypalEmail] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: '', content: '' });

  const campaign_id = useParams();
  const id = Number(campaign_id.campaign_id);

  const navigate = useNavigate()
  const handleDonation = async (e) => {
    e.preventDefault();

    if (donationAmount && paymentMethod) {
      if (paymentMethod === "PayPal" && !paypalEmail) {
        setPopupContent({
          title: 'Email Verification',
          content: 'Email verification sent! Please check your inbox.'
        });
        setIsPopupOpen(true);
        return;
      } else if (paymentMethod === "Credit Card" && (!cardDetails.cardNumber || !cardDetails.expiryDate)) {
        setPopupContent({
          title: 'Missing Information',
          content: 'Please fill in all credit card details.'
        });
        setIsPopupOpen(true);
        return;
      }

      try {
        const payload = {
          campaign_id: id,
          amount: donationAmount
        }
        const response = await axios.post(`${server}/makeDonation`, payload, {
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`,
            'Content-Type': 'application/json'
          }
        });

        setPopupContent({
          title: 'Thank You!',
          content: `Thank you for your donation of $${donationAmount} using ${paymentMethod}!`
        });
        setIsPopupOpen(true);
        navigate(`/campain/${id}`)
        console.log(response.data);

      } catch (error) {
        console.error("Error making the donation:", error.message);
        setPopupContent({
          title: 'Error',
          content: 'An error occurred. Please try again.'
        });
        setIsPopupOpen(true);
      }

      // Reset form fields
      setDonationAmount('');
      setPaymentMethod('');
      setCardDetails({ cardNumber: '', expiryDate: '' });
      setPaypalEmail('');
    } else {
      setPopupContent({
        title: 'Incomplete Form',
        content: 'Please fill in all the fields.'
      });
      setIsPopupOpen(true);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value === "PayPal") {
      setCardDetails({ cardNumber: '', expiryDate: '' });
    } else {
      setPaypalEmail('');
    }
  };

  return (
    <div className='px-5 w-screen h-screen mx-0 flex justify-center items-center'>
      <div className="flex flex-col justify-center items-center bg-color1 shadow-lg rounded-lg p-9 space-y-6 overflow-y-auto">
        <h1 className='text-2xl text-center font-bold'>Make a Donation</h1>
        <form onSubmit={handleDonation} className='mt-5'>
          <div className='mb-4'>
            <label className='flex mb-1'>Donation Amount</label>
            <input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Amount in USD"
              className={inputStyles}
            />
          </div>

          <div className='mb-4'>
            <label className='flex mb-1'>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              className='p-3 w-full'
            >
              <option value="">Select a payment method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          {paymentMethod === "Credit Card" && (
            <div>
              <div className='mb-4'>
                <label className='flex flex-row mb-1'><BiCreditCard className='mr-2' />Card Number</label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                  placeholder="Credit Card Number"
                  className={inputStyles}
                />
              </div>

              <div className='mb-4'>
                <label className='flex mb-1'>Expiry Date</label>
                <input
                  type="text"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                  placeholder="MM/YY"
                  className={inputStyles}
                />
              </div>
            </div>
          )}

          {paymentMethod === "PayPal" && (
            <div className='mb-4'>
              <label className='flex flex-row mb-1'><BsPaypal className='mr-2' />PayPal Email</label>
              <input
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="Your PayPal Email"
                className='p-3 w-full'
              />
            </div>
          )}
          <div className='flex justify-center'>
            <button type="submit" className={`${buttonStyles} bg-none w-[50%]`}>
              Donate
            </button>
          </div>
        </form>

        {/* Popup for notifications */}
        <Popup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          title={popupContent.title}
          content={popupContent.content}
        />
      </div>
    </div>
  );
};
