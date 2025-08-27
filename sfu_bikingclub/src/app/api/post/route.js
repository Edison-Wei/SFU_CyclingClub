import { connectMongoDB } from "../../../lib/mongodb";
import { NextResponse } from "next/server";
import Post from "../../../models/post";
import mysql from 'mysql2/promise';
import connectionCredentials from "@/app/utils/dbConnection";

export async function GET(req) {
    // await connectMongoDB();

    try {
        const page = req.nextUrl.searchParams.get("page") // page number 0,1,2,...
        // const query = `WITH Posts2 AS (SELECT (MAX(pid)-2) as start, MAX(pid) as end FROM Blog.Posts)
        //                 SELECT pid, title, desc, category, authorName, image, datePosted FROM Blog.Posts as Posts1, Posts2 WHERE Posts1.pid BETWEEN Posts2.start AND Posts2.end`
        const querypid = `SELECT MAX(pid) AS pid FROM Blog.Posts`;
        const connection = await mysql.createConnection(connectionCredentials('blog'));

        const [resultpid] = await connection.query(querypid);
        if (!resultpid[0].pid) 
            return []
        
        const maxpid = resultpid[0].pid - (16 * page)
        const minpid = ((maxpid - 16) < 0) ? 0 : (maxpid - 16)

        const queryPosts = `SELECT pid, title, Posts.desc, category, authorName, image, datePosted FROM Blog.Posts AS Posts WHERE pid Between ${minpid} AND ${maxpid}`
        const [resultPosts] = await connection.query(queryPosts)
        connection.end()
        
        // const posts = await Post.find({}).limit(16).populate("authorId");
        return NextResponse.json(resultPosts, { status: 200 });
    } catch (error) {
        return NextResponse.json([{title: "An error occurred while getting posts"}], {status: 500});
    }
}

export async function POST(req) {
    // await connectMongoDB();

    try {
        const {title, desc, category, authorUid, authorName, image} = await req.json();

        // const newPost = await Post.create(body);
        const queryInsertPost = `INSERT INTO Blog.Posts VALUES (?, ?, ?, ?, ?, ?, ?, NULL, CURRENT_DATE())`;
        const querypid = `SELECT MAX(pid) AS pid FROM Blog.Posts`;

        const connection = await mysql.createConnection(connectionCredentials('blog'));
        await connection.beginTransaction();

        const [resultpid] = await connection.query(querypid);
        const pid = resultpid[0].pid == null ? 0 : (resultpid[0].pid + 1);

        let postImage = image;
        if (!image || image == "" )
            postImage = null;

        await connection.query(queryPost, [pid, title, desc, category, authorUid, authorName, postImage]);
        connection.commit();
        connection.end();

        return NextResponse.json({ status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while making post" }, { status: 500 });
    }
}