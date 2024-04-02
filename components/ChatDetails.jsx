'use client'

import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import Link from 'next/link';
import { AddPhotoAlternate } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { CldUploadButton } from 'next-cloudinary';
import MessageBox from './MessageBox';

const ChatDetails = ({ chatId }) => {

    const { data: session } = useSession();
    const currentUser = session?.user;

    const [loading, setLoading] = useState(true);
    const [chat, setChat] = useState({});
    const [otherMembers, setOtherMembers] = useState([]);
    const [text, setText] = useState('');

    const getChatDetails = async () => {
        try {
            const res = await fetch(`/api/chats/${chatId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json();
            setChat(data);
            setOtherMembers(data?.members?.filter(member => member._id !== currentUser._id))
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (currentUser && chatId) getChatDetails();
    }, [currentUser, chatId])

    const sendText = async () => {
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatId,
                    currentUserId: currentUser._id,
                    text
                })
            })

            if(res.ok){
                setText("");
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    const sendPhoto = async (result) => {
        try{
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    chatId,
                    currentUserId: currentUser._id,
                    photo: result?.info?.secure_url
                })
            });
        } catch (error) {
            console.log(error);
        }
    }


    return loading ? <Loader /> : (
        <div className="chat-details">
            <div className='chat-header'>
                {chat?.isGroup ? (
                    <>
                        <Link href={`/chats/${chatId}/group-info`}>
                            <img
                                src={chat?.groupPhoto || '/assets/group.png'}
                                alt="group-photo"
                                className="profilePhoto" />
                        </Link>
                        <div className='text'>
                            <p>
                                {chat?.name} &#160; &#183; &#160; {chat?.members?.length} members
                            </p>
                        </div>

                    </>

                ) : (
                    <>
                        <img
                            src={otherMembers[0].profileImage || '/assets/person.jpg'}
                            alt="profilePhoto"
                            className="profilePhoto" />
                        <div className="text">
                            <p>{otherMembers[0].username}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="chat-body">
                {chat?.messages?.map((message, index) => (
                    <MessageBox key={index} message={message} currentUser={currentUser}/>
                ))}
            </div>

            <div className="send-message">
                <div className="prepare-message">
                    <CldUploadButton
                    options={{maxFiles: 1}}
                    onSuccess={sendPhoto}
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}>
                        <AddPhotoAlternate sx={{ fontSize: "35px", color: "#737373", "&:hover": { color: "red" } }} />
                    </CldUploadButton>
                    <input type="text" className="input-field" placeholder="Write a message..." value={text} onChange={(e) => setText(e.target.value)} required />
                </div>
                <div onClick={sendText}>
                    <img src="/assets/send.jpg" alt="send" className="send-icon" />
                </div>
            </div>
        </div>
    )
}

export default ChatDetails;