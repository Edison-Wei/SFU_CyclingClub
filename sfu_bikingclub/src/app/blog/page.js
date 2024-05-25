import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import UserInfo from "@/components/UserInfo";

export default function Events() {
    return (
        <div className="w-full h-full py-6">
            <Header />
            <UserInfo />
            <div className="px-4">
                <button class="flex items-center justify-center w-12 h-12 bg-primary-red rounded-full text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                </button>
            </div>
        </div>
        
    );
}