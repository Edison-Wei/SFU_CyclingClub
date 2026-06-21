interface DeletionModalProps {
    rid: number
    title: string
    setShowDeletionModal: (change: boolean) => void
    handleDeleteRoute: (rid: number | string) => void
}

export default function DeletionModal({ rid, title, setShowDeletionModal, handleDeleteRoute }: DeletionModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeletionModal(false)} />
            
            {/* Modal Content */}
            <div className="relative bg-base-200 border border-base-300 w-full max-w-md rounded-box shadow-2xl p-6 lg:p-8">
                <h2 className="text-primary text-xl lg:text-2xl font-bold text-center mb-2">
                    Confirm Deletion
                </h2>
                <p className="text-base-content text-center mb-8">
                    Are you sure you want to delete <span className="font-bold italic">"{title}"</span>? This action cannot be undone.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                        onClick={() => handleDeleteRoute(rid)} 
                        className="flex-1 btn btn-secondary text-white font-bold"
                    >
                        Delete Route
                    </button>
                    <button 
                        onClick={() => setShowDeletionModal(false)} 
                        className="flex-1 btn btn-ghost border border-base-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}