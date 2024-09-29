import React from 'react';
import { FaTimes } from 'react-icons/fa'; 

const Popup = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-color1 p-5 rounded-lg shadow-lg max-w-sm w-full">
                <button
                    className="absolute top-2 right-2 text-color2 hover:text-color1 transition duration-200"
                    onClick={onClose}
                >
                    <FaTimes size={18} />
                </button>
                
                <h2 className="text-lg font-bold mb-4">{title}</h2>

                <p className=' text-color2'>{content}</p>

            </div>
        </div>
    );
};

export default Popup;
