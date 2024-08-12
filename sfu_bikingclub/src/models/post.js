import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 1
    },
    desc: {
        type: String,
        required: true,
        min: 1
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
    authorName: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Single image URL
    }
}, { timestamps: true })

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;