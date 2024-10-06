import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { server } from '../server';
import { buttonStyles, inputStyles } from '../Components/navbar';
import { useNavigate, useParams } from 'react-router-dom';

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
    const [loading, setLoading] = useState(false); // Loading state

    const navigate = useNavigate();
    const { campain_id } = useParams(); // Fetch campaign ID from route params if editing

    useEffect(() => {
        // If campaign ID is present, fetch the data and set editing mode to true
        if (campain_id) {
            setIsEditing(true);
            setCampaignId(campain_id);
            setLoading(true); // Start loading while fetching data
            // Fetch campaign data for editing
            axios.get(`${server}/campaign/${campain_id}`, {
                headers: { Authorization: `Bearer ${Cookies.get('authToken')}` }
            })
                .then((response) => {
                    const campaign = response.data.campaign;
                    setTitle(campaign.title);
                    setDesc(campaign.description);
                    setGoal_amount(campaign.goal_amount);
                    setStart(campaign.start_date);
                    setEnd(campaign.end_date);
                    setCat(campaign.category);
                })
                .catch((error) => {
                    console.error("Failed to fetch campaign data:", error);
                })
                .finally(() => {
                    setLoading(false); // End loading after fetching data
                });
        }
    }, []);

    const handleSubmit = async () => {
        console.log(title, desc, goal_amount, start, end, cat, photo)
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
            } else {
                // Create new campaign
                const result = await axios.post(`${server}/createCampaign`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${Cookies.get('authToken')}`
                    }
                });
                const id = result.data.campaign.campain_id
                console.log(id)

            }
        } catch (error) {
            console.error("Failed to submit campaign:", error.message);
        } finally {
            setLoading(false); // End loading after submission
            navigate(`/campain`)
        }
    };

    return (
        <div className="flex justify-center items-center w-full  my-[350px]">
            <div className="bg-color1 shadow-lg rounded-lg p-8  max-w-lg space-y-6 overflow-y-auto ">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="loader" />
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl  text-center font-bold">
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
                                <label className="text-sm font-semibold ">Start Date</label>
                                <input
                                    type="date"
                                    className={`${inputStyles} w-full border rounded-md p-2`}
                                    value={start}
                                    onChange={(e) => setStart(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold ">End Date</label>
                                <input
                                    type="date"
                                    className={`${inputStyles} w-full border rounded-md p-2`}
                                    value={end}
                                    onChange={(e) => setEnd(e.target.value)}
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
                        <input
                            type="file"
                            className={`${inputStyles} w-full border rounded-md p-2`}
                            onChange={(e) => setPhoto(e.target.files[0])}
                        />

                        <button
                            className={`${buttonStyles} w-full`}
                            onClick={handleSubmit}
                            disabled={loading} // Disable button while loading
                        >
                            {isEditing ? "Save Changes" : "Create Campaign"}
                        </button>
                        <button
                            className={`${buttonStyles} w-full`}
                            onClick={()=> navigate('/')}
                            disabled={loading} // Disable button while loading
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateEditCampaign;
