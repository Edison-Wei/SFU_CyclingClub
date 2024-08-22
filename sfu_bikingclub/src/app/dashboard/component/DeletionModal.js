export default function DeletionModal({ routeinfo, setShowDeletionModal, handleDeleteRoute }) {
    const handleClose = () => {
        setShowDeletionModal(false);
    }

    return (
        <div className="fixed inset-0 z-20 flex justify-center md:grid md:grid-cols-2 md:justify-items-center items-center bg-gray-600 bg-opacity-40" onClick={handleClose}>
            <div className="ml-4 bg-white border-2 border-primary-red rounded-md">
                <div className="rounded-lg p-4 md:p-6 lg:p-8 shadow-xl text-center">
                    <h2 className="pb-6 sm:text-[15px] md:text-[20px] lg:text-[25px]">
                        {`Are you sure you want to delete this route?`}
                        <br/>
                        "{routeinfo.title}"?
                    </h2>
                    <div className="flex justify-around p-2 text-[12px] md:text-[15px] lg:text-[20px]">
                        <button onClick={() => handleDeleteRoute(routeinfo.rid)} className="p-1.5 rounded-md underline underline-offset-2 bg-red-500 hover:bg-primary-red">Delete Route</button>
                        <button onClick={handleClose} className="underline underline-offset-2 hover:opacity-40">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}