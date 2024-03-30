import Chat from "@models/Chat";
import User from "@models/User";
import { connectToDB } from "@mongodb"

export const GET = async (req, {params}) => {
    try{
        await connectToDB();

        const {userId, query} = params;

        const searchChat = await Chat.find({
            members: userId,
            name: {$regex: query, $options: 'i'},
        }).populate({
            path: 'members',
            model: User
        }).exec();

        return new Response(JSON.stringify(searchChat), {status: 200})
    } catch (error){
        console.log(error);
        return new Response("Failed to search chats!", {status: 500})
    }
}