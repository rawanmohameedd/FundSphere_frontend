import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { BiArrowFromBottom, BiArrowFromTop, BiTrash, BiUser } from 'react-icons/bi';
import logo from '../assets/logo_transparent.png';
import axios from 'axios';
import { server } from '../server';
import { Link, useNavigate } from 'react-router-dom';
import Popup from './popup';
import Cookies from 'js-cookie';

const buttonStyles = 'p-[10px] text-[16px] text-base text-color2 border border-color2 bg-transparent rounded hover:bg-color2 hover:text-color1 transition duration-300 cursor-pointer';
const inputStyles = 'p-[10px] text-[16px] text-base shadow-md rounded-xl w-full max-w-[400px]';

const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isSignOutPopupOpen, setIsSignOutPopupOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);  

    const catRef = useRef(null);
    const userRef = useRef(null);

    const navigate = useNavigate();
    const isLoggedIn = !!Cookies.get('authToken');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${server}/getCategories`);
                if (response) {
                    setCategories(response.data);
                }
            } catch (err) {
                console.error('Error Fetching Categories:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutsideUser = (event) => {
            if (userRef.current && !userRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        const handleClickOutsideCategories = (event) => {
            if (catRef.current && !catRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutsideUser);
        document.addEventListener('click', handleClickOutsideCategories);

        return () => {
            document.removeEventListener('click', handleClickOutsideUser);
            document.removeEventListener('click', handleClickOutsideCategories);
        };
    }, []);

    const handleStartProjectClick = () => {
        if (isLoggedIn) navigate('/create');
        else setIsPopupOpen(true);
    };

    const handleSignOut = () => {
        Cookies.remove('authToken');
        setUserMenuOpen(false);
        setIsSignOutPopupOpen(true);
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    // Handle search input
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle search submission
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const [campaigns, categories] = await Promise.all([
                axios.get(`${server}/searchCamp/${searchTerm}`),
                axios.get(`${server}/searchCat/${searchTerm}`),
            ]);

            console.log("Campaigns: ", campaigns.data);
            console.log("Categories: ", categories.data);

            // Combine results and filter out any undefined/null values
            const combinedResults = [
                ...campaigns.data,
                ...categories.data,
            ].filter(result => result);  

            console.log(combinedResults)
            setSearchResults(combinedResults);  // Set combined results
        } catch (err) {
            console.error('Error searching:', err);
        }
    };

    // Handle clearing the search term and results
    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <>
        <header className="flex flex-row md:flex-col items-center bg-color1 text-color2 text-lg font-bold w-screen fixed top-0 left-0 p-2 m-0">
            <Link to={'/'} className='flex'>
                <img src={logo} alt="Logo" className='object-contain w-[150px] h-[150px]' />
            </Link>

            <div className='relative flex-grow mx-5 my-5 flex justify-center items-center'>
                <span className='mr-2'><FaSearch /></span>
                <form onSubmit={handleSearchSubmit} className="flex">
                    <input
                        type='text'
                        placeholder='Search by Projects, Categories or creators'
                        className={inputStyles}
                        value={searchTerm}
                        onChange={handleSearchChange} 
                    />
                    <button type="submit" className={`${buttonStyles} ml-2`}>Search</button>
                    {searchTerm && (
                        <button
                            type="button"
                            className={`${buttonStyles} ml-2`} 
                            onClick={handleClearSearch}
                        >
                            <BiTrash />
                        </button>
                    )}
                </form>
            </div>

            <div className='flex space-x-2'>
                {isLoggedIn ? (
                    <div className='relative' ref={userRef}>
                        <button
                            className={`flex items-center space-x-1 ${buttonStyles}`}
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            User <span>{userMenuOpen ? <BiArrowFromBottom /> : <BiArrowFromTop />}</span>
                        </button>
                        {userMenuOpen && (
                            <ul className='absolute z-10 bg-color1 text-color2 shadow-md border border-color2 rounded-lg mt-2 mr-5'>
                                <li className='p-2 hover:bg-color2 hover:text-color1 cursor-pointer'>
                                    <Link to='/profile' className='text-inherit hover:text-inherit flex flex-row '><BiUser /> Profile</Link>
                                </li>
                                <li onClick={handleSignOut} className='bg-color1 p-2 hover:bg-color2 text-inherit hover:text-color1 cursor-pointer flex flex-row'>
                                    <FaSignOutAlt /> Sign out
                                </li>
                            </ul>
                        )}
                    </div>
                ) : (
                    <input
                        type='button'
                        value='Join us'
                        className={buttonStyles}
                        onClick={() => navigate('/join')}
                    />
                )}
                <input
                    type='button'
                    value='Start a Project'
                    className={buttonStyles}
                    onClick={handleStartProjectClick}
                />

                <div className='relative' ref={catRef}>
                    <button
                        className={`flex items-center space-x-1 ${buttonStyles}`}
                        onClick={() => setOpen(!open)}
                    >
                        Categories <span>{open ? <BiArrowFromBottom /> : <BiArrowFromTop />}</span>
                    </button>
                    {open && (
                        <ul className='absolute z-10 bg-color1 text-color2 shadow-md border border-color2 rounded-lg mt-2 mr-5'>
                            {categories.map((category) => (
                                <li key={category.category_id} className='p-2 hover:bg-color2 hover:text-color1 border-b border-color2 last:border-0'>
                                    <Link to={`/category/${category.category_id}`} className='text-inherit hover:text-inherit hover:underline'
                                    onClick={() => setOpen(false)}>{category.name}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
                </header>

            {/* Search Results */}
<div className='w-[50%] max-h-[350px] mx-auto mt-[300px] '>
    {searchResults.length > 0 && (
        <ul className="z-10 bg-color1 text-color2 shadow-lg border border-color2 rounded-lg overflow-y-auto max-h-[300px] space-y-2">
            {searchResults.map((result, index) => (
                <li
                    key={index}
                    className='border-b border-color2 p-3 hover:bg-color2 hover:text-color1 transition-colors duration-300 last:border-none'
                >
                    {result.name ? (
                        <Link
                            to={`/category/${result.category_id}`}
                            onClick={handleClearSearch}
                            className='text-inherit font-semibold hover:underline'
                        >
                            {result.name}
                        </Link>
                    ) : result.title ? (
                        <Link
                            to={`/campain/${result.campaign_id}`}
                            onClick={handleClearSearch}
                            className='text-inherit font-semibold hover:underline'
                        >
                            {result.title}
                        </Link>
                    ) : (
                        <span className='text-gray-500'>No valid result found</span>
                    )}
                </li>
            ))}
        </ul>
    )}
</div>


            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Registration Required"
                content={
                    <span>
                        You need to
                        <Link to={'/join'} className="text-color2 hover:underline"> Register </Link>
                        first before starting a project.
                    </span>
                }
            />

            <Popup
                isOpen={isSignOutPopupOpen}
                onClose={() => setIsSignOutPopupOpen(false)}
                title="Signed Out"
                content={<span>You have signed out successfully! Goodbye!</span>}
            />
            </>
    );
};

export { Navbar, buttonStyles, inputStyles };
