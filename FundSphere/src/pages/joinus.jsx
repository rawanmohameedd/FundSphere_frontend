import React, { useState } from "react";
import logo from '../assets/logo_transparent.png';
import { buttonStyles, inputStyles } from "../Components/navbar";
import { BsFacebook, BsGoogle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import Cookies from "js-cookie";
import { server } from "../server";
import Popup from "../Components/popup";  

export const Joinus = () => {
    const [signed, setSigned] = useState(false);
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [isPopupOpen, setPopupOpen] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupTitle, setPopupTitle] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (signed) {
            try {
                const payload = {
                    signed: user,
                    password,
                };
                const response = await axios.post(`${server}/signin`, payload);
                console.log('User Signed in Successfully!', response.data);
    
                //store the token in a cookie
                const { token } = response.data;
                Cookies.set("authToken", token, { expires: 2 });
    
                setPopupTitle("Welcome Back!");
                setPopupContent("You have successfully signed in.");
                setPopupOpen(true);
    
                // After closing the popup, navigate to the home page
                setTimeout(() => {
                    setPopupOpen(false);
                    navigate('/', { replace: true });
                }, 2000);
            } catch (err) {
                let errorMessage = "An error occurred. Please try again.";
                if (err.response) {
                    errorMessage = err.response.data.message || errorMessage;
                }
                setPopupTitle("Sign In Error");
                setPopupContent(errorMessage);
                setPopupOpen(true);
            }
        } else {
            // handle sign up logic
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    
            if (password !== confirmPass) {
                setPopupTitle("Password Mismatch");
                setPopupContent("Passwords do not match. Please try again.");
                setPopupOpen(true);
                return;
            }
            if (!passwordRegex.test(password)) {
                setPopupTitle("Weak Password");
                setPopupContent("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.");
                setPopupOpen(true);
                return;
            }
    
            setPopupTitle("Please Check Your Email");
            setPopupContent("You need to verify your account before signing in.");
            setPopupOpen(true);
    
            // Navigate to Verify component after closing the popup
            setTimeout(() => {
                setPopupOpen(false);
                navigate('/verfiy', { state: { email, username, password } });
            }, 2000);
        }
    };
    

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
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className={inputStyles}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button onClick={handleSubmit} className={`${buttonStyles} w-full mt-4`}>
                                Sign in
                            </button>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Enter Username"
                                className={inputStyles}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className={inputStyles}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className={inputStyles}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className={inputStyles}
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                            />
                            <button onClick={handleSubmit} className={`${buttonStyles} w-full mt-4`}>
                                Sign Up
                            </button>
                        </>
                    )}
                </div>

                <div className="text-color2 text-center font-medium">
                    <p>
                        {signed ? (
                            <>
                                <Link to={"/verfiy"} className="underline cursor-pointer">Forget your Password?</Link>
                                <p>Don't have an account? <a className='cursor-pointer' onClick={() => setSigned(false)}> Sign Up</a></p>
                            </>
                        ) : (
                            <>Already have an account? <a className='cursor-pointer' onClick={() => setSigned(true)}> Sign in</a></>
                        )}
                    </p>
                </div>
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
