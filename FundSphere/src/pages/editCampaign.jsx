import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { server } from '../server';
import { buttonStyles, inputStyles } from '../Components/navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { BiTrash } from 'react-icons/bi';
import Popup from '../Components/popup'; 

const CreateEditCampaign = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [goal_amount, setGoal_amount] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [cat, setCat] = useState("");
    const [photo, setPhoto] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [campaignId, setCampaignId] = useState(null);
    const [loading, setLoading] = useState(false);

    // State for handling the popup
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupContent, setPopupContent] = useState("");

    const navigate = useNavigate();
    const campain_id = useParams();
    const id = Number(campain_id.campaign_id);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            setCampaignId(id);
            setLoading(true);
            // Fetch campaign data for editing
            axios.get(`${server}/getCampaign/${id}`)
                .then((response) => {
                    const campaign = response.data.result;
                    console.log(campaign);
                    setTitle(campaign.title);
                    setDesc(campaign.description);
                    setGoal_amount(campaign.goal_amount);
                    setStart(new Date(campaign.start_date).toISOString().split('T')[0]);
                    setEnd(new Date(campaign.end_date).toISOString().split('T')[0]);
                    setCat(campaign.category.name);
                    setPhoto(campaign.campaign_photo);
                })
                .catch((error) => {
                    console.error("Failed to fetch campaign data:", error.message);
                })
                .finally(() => {
                    setLoading(false); // End loading after fetching data
                });
        }
    }, []);

    const handleSubmit = async () => {
        console.log(title, desc, goal_amount, start, end, cat, photo);
        setLoading(true); // Start loading when submitting
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', desc);
        formData.append('goal_amount', goal_amount);
        formData.append('start_date', start);
        formData.append('end_date', end);
        formData.append('category', cat);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            if (isEditing) {
                // Edit campaign
                await axios.put(`${server}/editCampaign/${campaignId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${Cookies.get('authToken')}`
                    }
                });
                setPopupTitle("Success");
                setPopupContent("Campaign updated successfully!");
            } else {
                // Create new campaign
                await axios.post(`${server}/createCampaign`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${Cookies.get('authToken')}`
                    }
                });
                setPopupTitle("Success");
                setPopupContent("Campaign created successfully!");
            }
        } catch (error) {
            console.error("Failed to submit campaign:", error.message);
            setPopupTitle("Error");
            setPopupContent("Failed to submit campaign. Please try again.");
        } finally {
            setLoading(false); // End loading after submission
            setIsPopupOpen(true); // Show popup after submission
            navigate(`/campain/${id}`);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${server}/deleteCampaign/${id}`);
            setPopupTitle("Deleted");
            setPopupContent(response.data.message || "Campaign deleted successfully.");
            setIsPopupOpen(true); // Show popup first
    
            // Delay navigation for 2 seconds to show the popup
            setTimeout(() => {
                navigate('/profile');
            }, 2000); // 2000ms delay (2 seconds)
        } catch (error) {
            console.error("Error deleting this Campaign", error.message);
            setPopupTitle("Error");
            setPopupContent("Failed to delete campaign. Please try again.");
            setIsPopupOpen(true); // Show popup after failure
        }
    };    

    return (
        <div className="flex justify-center items-center w-full my-[350px]">
            <div className="bg-color1 shadow-lg rounded-lg p-8 max-w-lg space-y-6 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="loader" />
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl text-center font-bold">
                            {isEditing ? "Edit Campaign" : "Create Campaign"}
                        </h1>

                        <input
                            type="text"
                            placeholder="Campaign Title"
                            className={`${inputStyles} w-full border rounded-md p-2`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Campaign Description"
                            className={`${inputStyles} w-full border rounded-md p-2 h-24`}
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Goal Amount"
                            className={`${inputStyles} w-full border rounded-md p-2`}
                            value={goal_amount}
                            onChange={(e) => setGoal_amount(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold">Start Date</label>
                                <input
                                    type="date"
                                    className={`${inputStyles} w-full border rounded-md p-2`}
                                    value={start}
                                    onChange={(e) => setStart(e.target.value)}
                                    min={today}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold">End Date</label>
                                <input
                                    type="date"
                                    className={`${inputStyles} w-full border rounded-md p-2`}
                                    value={end}
                                    onChange={(e) => setEnd(e.target.value)}
                                    min={start||today}
                                />
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="Category"
                            className={`${inputStyles} w-full border rounded-md p-2`}
                            value={cat}
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <div className="flex flex-row space-x-3">
                            <img src={photo} className="h-[150px] w-[150px]" />
                            <input
                                type="file"
                                onChange={(e) => setPhoto(e.target.files[0])}
                            />
                        </div>
                        <button
                            className={`${buttonStyles} w-full`}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {isEditing ? "Save Changes" : "Create Campaign"}
                        </button>
                        {isEditing && (
                            <button
                                className={`${buttonStyles} bg-red-500 flex flex-row w-full justify-center`}
                                onClick={handleDelete}
                            >
                                <BiTrash />Delete Campaign
                            </button>
                        )}
                        <button
                            className={`${buttonStyles} w-full`}
                            onClick={() => navigate(`/campain/${id}`)}
                            disabled={loading} // Disable button while loading
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>

            {/* Popup component */}
            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={popupTitle}
                content={popupContent}
            />
        </div>
    );
};

export default CreateEditCampaign;
