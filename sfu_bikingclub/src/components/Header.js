// TO DO: Move Navigation elements into the header or vise versa?

import Link from "next/link";

export default function Header() {

    return (
        <div className="w-screen bg-white-500">
            <Link href="#joinInformation">JOIN SFU BIKING</Link>
        </div>
    )
}