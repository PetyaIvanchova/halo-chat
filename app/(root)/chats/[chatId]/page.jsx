'use client'

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React from 'react';
import ChatList from '@components/ChatList';
import ChatDetails from '@components/ChatDetails';

const ChatPage = () =>{

    const {chatId} = useParams();

    const {data: session} = useSession();
    const currentUser = session?.user;

    return (
        <div className="main-container">
            <div className='w-1/3 max-lg:w-full'><ChatList currentChatId={chatId}/></div>
            <div className='w-2/3 max-lg:w-full'><ChatDetails chatId={chatId}/></div>
        </div>
    )
}

export default ChatPage;