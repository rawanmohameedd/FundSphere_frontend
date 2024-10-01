import React, { useState, useEffect } from "react";
import logo from '../assets/logo_transparent.png';
import { buttonStyles, inputStyles } from "../Components/navbar";

export const Verify = () => {
    const [clicked, isClicked] = useState(false)
    const [countdown, setCountdown] = useState(180)
    const [resend, setResend] = useState(false)

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

    const handleResend = () => {
        setCountdown(180)
        setResend(false)
        isClicked(false)
    }

    return (
        <div className="grid grid-cols-2 w-screen h-screen bg-gradient-to-r from-color1 to-color1">
            {/* Left Section - Logo */}
            <div className="flex justify-center items-center">
                <img src={logo} alt="Logo" className="h-[250px] w-[300px]" />
            </div>

            {/* Right Section - email OTP */}
            <div className="flex flex-col justify-center items-center text-lg font-bold text-color2 space-y-8 p-5">

                {
                    !clicked && !resend && (
                        <>
                            <input
                                type="email"
                                placeholder="Enter your Email"
                                className={inputStyles}
                            />

                            <button onClick={() => isClicked(true)}
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
                                >
                                    Verify OTP
                                </button>
                                <p>Your OTP will expire in {countdown} seconds.</p>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
