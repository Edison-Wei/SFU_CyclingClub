export default function AppFooter() {
    return (
        <footer className="footer footer-start bg-primary text-primary-content py-2 px-3 shadow-inner">
            <div className="flex flex-col items-center gap-1">
                <p className="text-xs font-medium tracking-wide">
                    Made by Edison Wei and Claire Shou
                </p>
                {/* <p className="text-xs opacity-70">
                    © {new Date().getFullYear()} All rights reserved
                </p> */}
            </div>
        </footer>
    )
}