import BlogPost from "@/components/BlogPost";
import Header from "@/components/Header";
import NewPost from "@/components/NewPost";
import UserInfo from "@/components/UserInfo";

export default function Blog() {
    return (
        <div className="w-full h-full py-2">
            <Header />
            <UserInfo />
            <div className="flex flex-wrap justify-center">
                <BlogPost />
                <BlogPost />
                <BlogPost />
                <BlogPost />
                <BlogPost />
                {/* Add more BlogPost components here as needed */}
            </div>
            <div className="sticky bottom-0 flex justify-center w-full">
                <NewPost />
            </div>
        </div>
        
    );
}