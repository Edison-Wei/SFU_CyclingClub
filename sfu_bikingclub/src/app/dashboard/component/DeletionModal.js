export default function DeletionModal({ routeinfo, setShowModal, handleDeleteRoute }) {
    const handleClose = () => {
        setShowModal(false);
    }

    return (
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-40 transition-opacity" onClick={handleClose}>

                <div className="flex min-h-full w-1/2 items-end justify-center text-center sm:items-center sm:p-0">
                    <div className="relative transform sm:p-6 md:p-8 lg:p-10 overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="pb-6 sm:text-[15px] md:text-[20px] lg:text-[25px]">
                            Delete Route ""
                            {`Are you sure you want to delete this route? '${routeinfo.title}?'`}
                        </div>
                        <div className="flex justify-around p-2 sm:text-[12px] md:text-[15px] lg:text-[20px]">
                            <button onClick={() => handleDeleteRoute(routeinfo.id)} className="p-1.5 rounded-md bg-red-500 hover:bg-primary-red">Delete Route</button>
                            <button onClick={handleClose} className="underline underline-offset-2">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        // <div className="fixed inset-0 w-full flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={() => setShowModal(!showModal)}>
        //     <div className="p-1.5 bg-gradient-to-b from-[#7CC5FA] to-[#5A20BA] rounded-[53.39px]">
        //         <div className="py-6 px-8 bg-white rounded-[53.39px] shadow-lg">
    
        //             <div className="flex justify-end">
        //                 <button className="text-2xl text-gray-500 hover:text-gray-700">
        //                     &#9932;
        //                 </button>
        //             </div>
    
        //             {children}
        //         </div>
        //     </div>
        // </div>
    )
}