import { connectMongoDB } from "../../../lib/mongodb";
import { NextResponse } from "next/server";
import Post from "../../../models/post";

export async function GET(req) {
    await connectMongoDB();

    try {
        const posts = await Post.find({}).limit(16).populate("authorId");
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        return NextResponse.json({message: "An error occurred while getting posts"}, {status: 500});
    }
}

export async function POST(req) {
    await connectMongoDB();

    try {
        const body = await req.json();
        const newPost = await Post.create(body);

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while making post" }, { status: 500 });
    }
}
