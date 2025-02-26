import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'

const Project = () => {
    const location = useLocation();
    const { user } = useContext(UserContext);

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(new Set());
    const [project, setProject] = useState(location.state?.project || null);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([
        { sender: { _id: '1', email: 'user1@example.com' }, message: 'Hello!' },
        { sender: { _id: '2', email: 'user2@example.com' }, message: 'Hey there!' },
        { sender: { _id: user?._id, email: user?.email }, message: 'How are you?' }
    ]);
    
    const messageBox = useRef(null);

    useEffect(() => {
        if (!project) {
            console.error("Project data not found in location.state.");
        }
    }, [project]);

    const handleUserClick = (id) => {
        setSelectedUserId((prevSelectedUserId) => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }
            return newSelectedUserId;
        });
    };

    const addCollaborators = () => {
        if (!project) return;

        axios.put("/projects/add-user", {
            projectId: project._id,
            users: Array.from(selectedUserId),
        })
            .then((res) => {
                console.log(res.data);
                setIsModalOpen(false);
            })
            .catch((err) => {
                console.error("Error adding collaborators:", err);
            });
    };

    const send = () => {
        if (!user) {
            console.error("User context not found.");
            return;
        }

        setMessages((prevMessages) => [...prevMessages, { sender: user, message }]);
        setMessage("");
    };

    return (
        <main className="h-screen w-screen flex bg-gray-100">
            <section className="left relative flex flex-col h-screen min-w-96 bg-white shadow-md">
                <header className="flex justify-between items-center p-4 w-full bg-gray-200 border-b">
                    <button className="flex gap-2 bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-fill mr-1"></i>
                        <p>Add Collaborator</p>
                    </button>
                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className="p-2">
                        <i className="ri-group-fill"></i>
                    </button>
                </header>

                <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative px-4">
                    <div ref={messageBox} className="message-box p-1 flex-grow flex flex-col gap-2 overflow-auto max-h-full scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message flex flex-col p-3 text-white rounded-lg w-fit ${msg.sender._id === user?._id ? 'ml-auto bg-blue-500' : 'mr-auto bg-gray-600'}`}>
                                <small className="opacity-75 text-xs">{msg.sender.email}</small>
                                <p className="text-sm mt-1">{msg.message}</p>
                            </div>
                        ))}
                    </div>

                    <div className="inputField w-full flex absolute bottom-0 p-2 bg-gray-100 border-t">
                        <input value={message} onChange={(e) => setMessage(e.target.value)} className="p-2 px-4 border border-gray-300 outline-none flex-grow rounded-md" type="text" placeholder="Enter message" />
                        <button onClick={send} className="px-5 bg-blue-600 text-white rounded-md ml-2">
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>
                </div>

                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-gray-50 absolute transition-all shadow-lg ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}> 
                    <header className="flex justify-between items-center px-4 p-2 bg-gray-200 border-b">
                        <h1 className="font-semibold text-lg">Collaborators</h1>
                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className="p-2">
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>

                    <div className="users flex flex-col gap-2 p-2">
                        {project?.users?.map((collaborator) => (
                            <div key={collaborator._id} className="user cursor-pointer hover:bg-gray-100 p-2 flex gap-2 items-center rounded-md">
                                <div className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full">
                                    <i className="ri-user-fill"></i>
                                </div>
                                <h1 className="font-semibold text-lg">{collaborator.email}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md w-96 max-w-full shadow-lg relative">
                        <header className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2">
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>

                        <div className="text-gray-700 mb-2 text-sm">Logged in as: <strong>{user?.email}</strong></div>

                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map((user) => (
                                <div key={user._id} className={`user cursor-pointer hover:bg-gray-100 ${selectedUserId.has(user._id) ? 'bg-gray-200' : ''} p-2 flex gap-2 items-center rounded-md`} onClick={() => handleUserClick(user._id)}>
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full">
                                        <i className="ri-user-fill"></i>
                                    </div>
                                    <h1 className="font-semibold text-lg">{user.email}</h1>
                                </div>
                            ))}
                        </div>

                        <button onClick={addCollaborators} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md">
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Project;
