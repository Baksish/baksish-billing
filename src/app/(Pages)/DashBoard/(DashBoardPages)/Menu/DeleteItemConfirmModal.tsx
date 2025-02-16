
type DeleteMenuItemModalProps = {
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (isDeleteModalOpen: boolean) => void;
    handleDeleteConfirm: ()=>void;
    isDeleting: boolean;
  };
  const DeleteItemConfirmModal = ({isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteConfirm, isDeleting}:DeleteMenuItemModalProps) => {
  return <div>{isDeleteModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this menu item? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )}</div>;
};

export default DeleteItemConfirmModal;


