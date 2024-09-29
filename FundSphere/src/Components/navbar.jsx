import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { BiArrowFromBottom, BiArrowFromTop } from 'react-icons/bi';
import logo from '../assets/logo_transparent.png';
import axios from 'axios';
import { server } from '../server';
import { Link, useNavigate } from 'react-router-dom';
import Popup from './popup';

// common styles to reduce repetation
const buttonStyles = 'p-[10px] text-[16px] text-base text-color2 border border-color2 bg-transparent rounded hover:bg-color2 hover:text-color1 transition duration-300 cursor-pointer';
const inputStyles = 'p-[10px] text-[16px] text-base shadow-md rounded-xl w-full max-w-[400px]'

const Navbar = () => {
    // state to store fetched project categories
    const [Categories, setCategories] = useState([]);

    // State to manage register popup visibility
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    /* state to manage wether the categories list is open or closed 
    & REf to determine the outside clicks
    */
    const [open, setOpen] = useState(false);
    const catRef = useRef(null);

    // Buttons navigations with react router dom
    const navigate = useNavigate()

    // fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${server}/categories`);
                if (response) {
                    setCategories(response.data);
                }
            } catch (err) {
                console.error('Error Fetching Categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // handle clicking outside with adding event listeners
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (catRef.current && !catRef.current.contains(event.target))
                setOpen(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []); // the empty dependency to make it only runs once

    const handleStartProjectClick = () => {
        setIsPopupOpen(true); // Open the popup
    };

    return (
        <header className="flex flex-row md:flex-col items-center bg-color1 text-color2 text-lg font-bold w-full fixed top-0 left-0 p-2 m-0">
            <a href='/' className='flex'>
                <img src={logo} alt="Logo" className='object-contain w-[150px] h-[150px]' />
            </a>

            <div className='relative flex-grow mx-5 my-5 flex justify-center items-center'>
                <span className='mr-2'><FaSearch /></span>
                <input
                    type='text'
                    placeholder='Search by Projects, Categories or creators'
                    className={inputStyles} />
            </div>

            <div className='flex space-x-2'>
                <input
                    type='button'
                    value='Start a Project'
                    className={buttonStyles}
                    onClick={handleStartProjectClick}
                />
                <input
                    type='button'
                    value='Join us'
                    className={buttonStyles}
                    onClick={() => navigate('/join')}
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
                            {Categories.map((category) => (
                                <li key={category.category_id} className='p-2 hover:bg-color2 hover:text-color1 border-b border-color2 last:border-0'>
                                    <a href='#' className='text-inherit hover:text-inherit hover:underline'>{category.name}</a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Registration Required"
                content={
                    <span>
                        You need to 
                        <Link to={'/join'}  className="text-color2 hover:underline"> Register </Link> 
                        first before starting a project.
                    </span>
                } />
        </header>
    );
};

export { Navbar, buttonStyles, inputStyles }