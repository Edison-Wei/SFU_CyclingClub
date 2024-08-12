import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    }, 
    {timestamps: true }
);

// determines if the user exists or creates a new Schema if not
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;