import React, { useState } from "react";
import logo from '../assets/logo_transparent.png';
import { buttonStyles, inputStyles } from "../Components/navbar";
import { BsFacebook, BsGoogle } from "react-icons/bs";

export const Joinus = () => {
    const [signed, setSigned] = useState(false);

    return (
        <div className="grid grid-cols-2 w-screen h-screen bg-gradient-to-r from-color1 to-color1">
            {/* Left Section - Logo */}
            <div className="flex justify-center items-center">
                <img src={logo} alt="Logo" className="h-[250px] w-[300px]" />
            </div>

            {/* Right Section - Sign in/up form */}
            <div className="flex flex-col justify-center items-center text-lg font-bold text-color2 space-y-8 p-5">
                
                <div className="flex flex-col w-full items-center space-y-4">
                    <button className={`${buttonStyles} flex items-center justify-center w-full max-w-[300px]`}>
                        Continue with Google <span className="ml-2"><BsGoogle /></span>
                    </button>
                    <button className={`${buttonStyles} flex items-center justify-center w-full max-w-[300px]`}>
                        Continue with Facebook <span className="ml-2"><BsFacebook /></span>
                    </button>
                </div>

                <div className="text-color2 text-center font-medium">
                    <p>OR</p>
                </div>

                <div className="flex flex-col space-y-4 w-full max-w-[300px]">
                    {signed ? (
                        <>
                            <input
                                type="email"
                                placeholder="Enter Email or Username"
                                className={inputStyles}
                            />
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className={inputStyles}
                            />
                            <button className={`${buttonStyles} w-full mt-4`}>
                                Sign in
                            </button>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Enter Username"
                                className={inputStyles}
                            />
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className={inputStyles}
                            />
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className={inputStyles}
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className={inputStyles}
                            />
                            <button className={`${buttonStyles} w-full mt-4`}>
                                Sign Up
                            </button>
                        </>
                    )}
                </div>

                <div className="text-color2 text-center font-medium">
                    <p>
                        {signed ? (
                            <>Don't have an account? <a  className='cursor-pointer' onClick={() => setSigned(false)}> Sign Up</a></>
                        ) : (
                            <>Already have an account? <a className='cursor-pointer'  onClick={() => setSigned(true)}> Sign in</a></>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};
