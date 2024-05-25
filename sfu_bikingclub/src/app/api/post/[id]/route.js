import { connectMongoDB } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import Post from "../../../../models/post";
import User from "../../../../models/user";


export async function GET(req, ctx) {
    await connectMongoDB();

    const id = ctx.params.id;

    try {
        const post = await Post.findbyId(id).populate("authorId").select('password');
        return new Response(JSON.stringify(post), {status: 200})
    } catch (error) {
        return NextResponse.json({message: "An error occured while getting post id"}, {status: 500});
    }

}

export async function PUT(req, ctx) {
    await connectMongoDB();

    const id = ctx.params.id;
    
    try {
        const body = await req.json();
        const userId = body.authorId; 
        const post = await Post.findbyId(id).populate('authorId');

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (post.authorId._id.toString() !== userId) {
            return NextResponse.json({ error: 'Only author can edit their post' }, { status: 403 });
        }

        const updatedPost = await Post.findbyIdAndUpdate(id, {$set: {...body}}, {new: true});

        return new Response(JSON.stringify(updatedPost), { status: 200});

    } catch (error) {
        return NextResponse.json({message: "An error occured while updating post"}, {status: 500});
    }
}


export async function DELETE(req, ctx) {

    await connectMongoDB();

    const id = ctx.params.id;

    try {
        const body = await req.json();
        const userId = body.authorId;
        const post = await post.findById(id).populate('authorId');

        if (post.authorId._id.toString() !== userId) {
            return NextResponse.json({ error: 'Only author can delete their post' }, { status: 403 });
        }

        await Post.findbyIdAndDelete(id);

        return NextResponse.json({message: "Successfully deleted post"}, {status: 200});

    } catch (error) {
        return NextResponse.json({message: "An error occured while deleting post"}, {status: 500});
    }

}