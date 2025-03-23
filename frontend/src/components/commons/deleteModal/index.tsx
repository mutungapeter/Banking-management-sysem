import { IoCloseOutline } from "react-icons/io5";
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  confirmationMessage: string;
  deleteMessage: string;
  isLoading: boolean;
}
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onDelete,
  confirmationMessage,
  deleteMessage,
  isLoading,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;
  return (
    <>
      <div
        className="relative z-9999 animate-fadeIn"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn"
          aria-hidden="true"
        ></div>

        <div className="fixed inset-0 z-9999 w-screen overflow-y-auto font-nunito">
          <div className="flex min-h-full items-center justify-center p-4 text-center  sm:p-0">
            <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all  w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
              <div className="">
                <div className="p-4 flex  justify-center items-center flex-wrap gap-2">
                  <h2 className="lg:text-lg md:text-lg text-sm font-light ">
                    {confirmationMessage}
                    
                  </h2>
                  <span className="lg:text-lg md:text-lg text-sm font-medium">
                      {deleteMessage}
                    </span>
                </div>
              </div>
              <div className="flex justify-center  space-x-5 text-center mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white border shadow-md  rounded-md  py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 text-xs lg:text-sm md:text-sm focus:outline-none"
                >
                  No, Cancel
                </button>
                <button
                  onClick={onDelete}
                  disabled={isLoading}
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4  focus:ring-red-300 rounded-md  py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 text-xs lg:text-sm md:text-sm shadow-md focus:outline-none"
                >
                  {isLoading ? "Deleting..." : "Yes, I am Sure"}
                </button>
              </div>
              <div
                className="absolute top-4 right-4 cursor-pointer"
                onClick={onClose}
              >
                <IoCloseOutline
                        size={30}
                        onClick={onClose}
                        className=" text-[#1C3988] "
                      />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DeleteConfirmationModal;
