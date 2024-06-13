import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../Context/FeatureUser.jsx';
import { BsHeart } from 'react-icons/bs';
import axios from 'axios';

export default function Likes({ tripId, val }) {
    const { userToken } = useContext(UserContext);
    const [likesCount, setLikesCount] = useState(0);

    const handleLikes = async (tripId) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}${val}/like/${tripId}`, {}, 
                { headers: { Authorization: `Rufaidah__${userToken}` } }
            );

            if (response.data && response.data.like) {
                setLikesCount(response.data.like.like.length); 
            }
        } catch (error) {
            console.error("Error liking the trip:", error);
        }
    }
    // Fetch initial likes count
    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const {data} = await axios.get(`${import.meta.env.VITE_API_URL}${val}/getDetails/${tripId}`, 
                    { headers: { Authorization: `Rufaidah__${userToken}` } }
                );
                 setLikesCount(data[val].like.length)
                console.log(data[val].like.length)
            } catch (error) {
                console.error("Error fetching the initial likes count:", error);
            }
        };

        fetchLikes();
    }, [tripId, val, userToken]);

    return (
        <div className='text-danger d-flex'>
            <div className='py-2'>
                <BsHeart onClick={() => handleLikes(tripId)} style={{ cursor: 'pointer' }} />
            </div>
            <p className='mx-1 py-2'>{likesCount}</p>
        </div>
    );
}
