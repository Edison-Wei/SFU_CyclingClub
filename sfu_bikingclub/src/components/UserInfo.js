export default function UserInfo() {
    return <div className="grid place-items-start h-screen px-2">
            <div className="shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6">
                <div>
                    Name: <span className="font-bold">Claire</span>
                </div>
                <div>
                    Email: <span className="font-bold">cas32@sfu.ca</span>
                </div>
                <button className="bg-[#890B29] text-white text-sm font-bold cursor-pointer px-6 py-2 rounded-lg">
                    Log Out
                </button>
            </div>

        </div>
}