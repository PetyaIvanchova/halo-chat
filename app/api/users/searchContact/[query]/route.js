import User from "@models/User";
import { connectToDB } from "@mongodb"

export const GET = async (req, {params}) => {
    try{
        await connectToDB();

        const {query} = params;

        const searchContacts = await User.find({
            $or: [
                {username: {$regex: query, $options: 'i'}},
                {email: {$regex: query, $options: 'i'}}
            ]
        })

        return new Response(JSON.stringify(searchContacts), {status: 200})
    } catch(error){
        console.log(error);
        return new Response("Failed to search contacts!", {status:500})
    }
}