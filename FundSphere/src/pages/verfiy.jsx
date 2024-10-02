import React, { useState, useEffect } from "react";
import logo from '../assets/logo_transparent.png';
import { buttonStyles, inputStyles } from "../Components/navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { server } from "../server";
import axios from "axios";
import Popup from "../Components/popup";
import Cookies from "js-cookie";

export const Verify = () => {
    const [clicked, isClicked] = useState(false)
    const [countdown, setCountdown] = useState(180)
    const [resend, setResend] = useState(false)

    const [otp, setotp]=useState("")
    const [message, setMessage]=useState("")

    const [isPopupOpen, setPopupOpen] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupTitle, setPopupTitle] = useState("");


    const location = useLocation()
    const navigate = useNavigate()
    const email = location.state?.email
    const username = location.state?.username
    const password = location.state?.password

    useEffect(() => {
        let timer
        if (clicked && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)
        } else if (countdown == 0)
            setResend(true)

        return () => clearInterval(timer)
    }, [clicked, countdown])

    const handleSendOtp = async () => {
        try {
            const response = await axios.post(`${server}/send-otp`, { email });
            console.log(response.data);
            setMessage("OTP sent successfully. Please check your email.");
            isClicked(true);
            setResend(false)
        } catch (error) {
            console.error("Error sending OTP:", error);
            setMessage("Error sending OTP. Please try again.");
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post(`${server}/verify-otp`, { email, otp });
            console.log(response.data);
            setMessage("OTP verified successfully!");
            

                // After verfying the otp, navigate to the home page
                try {
                    const payload = {
                        email,
                        username,
                        password
                    };
    
                    const response = await axios.post(`${server}/signup`, payload);
                    console.log('Account created', response.data);

                    // store the token in a cookie
                    const {token} = response.data
                    Cookies.set("authToken", token, { /*secure: true, sameSite: 'Strict',*/ expires: 2 });

                    setPopupTitle("Welcome to FundSphere!");
                    setPopupContent("Your account has been craeted.");
                    setPopupOpen(true);
                    setTimeout(() => {
                        setPopupOpen(false);
                        navigate('/',{replace:true});
                    }, 2000);
                } catch (err) {
                    if (err.response) {
                        console.error("Sign up error", err.response.data);
                    } else {
                        console.error("Error", err.message);
                    }
                }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setMessage("OTP verification failed. Please try again.");
        }
    };

    const handleResend = () => {
        setCountdown(180)
        setResend(false)
        isClicked(false)
        handleSendOtp()
    }

    return (
        <div className="grid grid-cols-2 w-screen h-screen bg-gradient-to-r from-color1 to-color1">
            {/* Left Section - Logo */}
            <div className="flex justify-center items-center">
                <img src={logo} alt="Logo" className="h-[250px] w-[300px]" />
            </div>

            {/* Right Section - email OTP */}
            <div className="flex flex-col justify-center items-center text-lg font-bold text-color2 space-y-8 p-5">
             <div className="text-red-500">{message}</div> {/* Feedback Message */}

                {
                    !clicked && !resend && (
                        <>
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            className={inputStyles}
                            value={email}  
                            readOnly  
                        />

                            <button onClick={handleSendOtp}
                                className={`${buttonStyles} w-full mt-4`}>
                                Send OTP
                            </button>
                        </>
                    )
                }
                {clicked && (
                    <>
                        <input
                            type="text" 
                            placeholder="Enter OTP"
                            className={inputStyles}
                            value={otp}
                            onChange={(e)=> setotp(e.target.value)}
                        />

                        {resend ? (
                            <button
                                onClick={handleResend}
                                className={`${buttonStyles} w-full mt-4`}
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <>
                                <button
                                    className={`${buttonStyles} w-full mt-4`}
                                    onClick={handleVerifyOtp}
                                >
                                    Verify OTP
                                </button>
                                <p>Your OTP will expire in {countdown} seconds.</p>
                            </>
                        )}
                    </>
                )}
            </div>
            {/* Popup Component */}
            <Popup
                isOpen={isPopupOpen} 
                onClose={() => setPopupOpen(false)} 
                title={popupTitle} 
                content={popupContent} 
            />
        </div>
    );
};
