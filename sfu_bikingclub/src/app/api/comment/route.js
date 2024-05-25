import { connectMongoDB } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import Comment from "../../../../models/comment";


export async function POST(req) {
    await connectMongoDB();

    try {
        const body = await req.json();
        
        let newComment = await Comment.create(body);
        newComment = await newComment.populate('authorId');

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {

        return NextResponse.json({ error: 'Error making new comment' }, { status: 500 });
    }


}