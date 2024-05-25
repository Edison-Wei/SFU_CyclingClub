import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 4
    },
    desc: {
        type: String,
        required: true,
        min: 6
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Routes',
            'Gear',
            'Deals',
            'Safety',
            'Misc',
        ]
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    }
}, {timestamps: true})

const Post = models.Post || mongoose.model("Post", postSchema);
export default Post;