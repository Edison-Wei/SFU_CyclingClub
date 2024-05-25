import { connectMongoDB } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import Post from "../../../../models/post";

export async function PUT(req, ctx) {
    await connectMongoDB();

    const id = ctx.params.id;

    try {
        const body = await req.json();
        const userId = body.authorId; 
        const post = await Post.findbyId(id);

        if(post.likes.includes(userId)) {
            return NextResponse.json({ error: 'User has already liked this post' }, { status: 400 });
        }
        else {
            post.likes.push(userId);
        }

        await post.save();

        return NextResponse.json({ message: 'Post liked successfully', post }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Error liking the post' }, { status: 500 });
    }

}