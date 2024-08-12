import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Comment from "@/models/comment";


export async function GET(req, ctx) {
    await connectMongoDB();

    const id = ctx.params.id;

    try {
        const comments = await Comment.find({postId: id}).populate('authorId');

        return NextResponse.json(comments, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: 'Error making getting comments' }, { status: 500 });
    }


}

export async function DELETE(req, ctx) {
    await connectMongoDB();

    const id = ctx.params.id;

    try {
        const body = await req.json();
        const userId = body.authorId;
        const comment = await Comment.findById(id).populate('authorId');

        if (comment.authorId._id.toString() !== userId) {
            return NextResponse.json({ error: 'Only author can delete their comment' }, { status: 403 });
        }

        await Comment.findbyIdAndDelete(id);

        return NextResponse.json({message: "Successfully deleted comment"}, {status: 200});

    } catch (error) {
        return NextResponse.json({message: "An error occured while deleting comment"}, {status: 500});
    }
}
