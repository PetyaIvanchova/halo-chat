import Chat from "@models/Chat";
import Message from "@models/Message";
import { connectToDB } from "@mongodb"

export const POST = async (req) => {
    try{
        await connectToDB();

        const body = await req.json();

        const {chatId, currentUserId, text, photo} = body;

        const newMessage = await Message.create({
            chat: chatId,
            sender: currentUserId,
            text,
            photo,
            seenBy: currentUserId
        });

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {$push : {messages: newMessage._id},
            $set: {lastMessageAt: newMessage.createdAt}},
            {new: true}
        ).populate({
            path: "messages",
            model: Message,
            populate: {path: "sender seenBy", model: "User"}
        }).populate({
            path: "members",
            model: 'User'
        }).exec();

        return new Response(JSON.stringify(newMessage), {status: 200})
    } catch (error){
        console.log(error);
        return new Response("Failed to create new message!", {status: 500})

    }
}