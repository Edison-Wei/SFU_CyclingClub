export default function DeletionModal({ routeinfo, setShowModal, handleDeleteRoute }) {
    const handleClose = () => {
        setShowModal(false);
    }

    return (
        <div className="relative p-3 z-10" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="p-4">
                            {`Are you sure you want to delete this route?\n '${routeinfo.title}?'`}
                        </div>
                        <div className="flex justify-around p-2">
                            <button onClick={() => handleDeleteRoute(routeinfo.id)} className="p-1 rounded-md bg-red-500 hover:bg-primary-red">Delete Route</button>
                            <button onClick={handleClose} className="underline">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}