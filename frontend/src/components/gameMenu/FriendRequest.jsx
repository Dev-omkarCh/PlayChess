import React, { useState } from 'react';

const FriendRequest = () => {
    const [username, setUsername] = useState('');
    const [friendRequests, setFriendRequests] = useState([]);

    const sendFriendRequest = () => {
        if (username) {
            setFriendRequests([...friendRequests, username]);
            setUsername('');
        }
    };

    const acceptFriendRequest = (request) => {
        setFriendRequests(friendRequests.filter((req) => req !== request));
        // Add logic to handle accepted friend request
    };

    return (
        <div>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="border p-2 rounded"
            />
            <button onClick={sendFriendRequest} className="bg-blue-500 text-white p-2 rounded ml-2">
                Send Request
            </button>
            <ul className="mt-4">
                {friendRequests.map((request, index) => (
                    <li key={index} className="flex justify-between items-center">
                        <span>{request}</span>
                        <button onClick={() => acceptFriendRequest(request)} className="bg-green-500 text-white p-1 rounded">
                            Accept
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendRequest;