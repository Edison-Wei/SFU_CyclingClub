import mongoose, { mongo } from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true
    }

}, {timestamps: true})

const Comment = models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;