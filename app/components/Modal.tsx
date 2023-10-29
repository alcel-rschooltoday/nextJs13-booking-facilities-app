import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSave?: () => void;
  onSaveButtonLabel?: string;
  onCloseButtonLabel?: string;
  children: React.ReactNode;
  customWidthClass?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  onSave,
  onSaveButtonLabel,
  onCloseButtonLabel,
  children,
  customWidthClass,
}) => {
  const modalClass = isOpen ? "opacity-100" : "opacity-0 pointer-events-none";
  const overlayClass = isOpen ? "opacity-100" : "opacity-0 pointer-events-none";

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity ${modalClass}`}
    >
      <div className="fixed inset-0 bg-black opacity-50 transition-opacity" />
      <div
        className={`bg-white p-6 ${
          customWidthClass || ""
        } rounded-lg shadow-lg z-10 relative transform transition-transform opacity-100`}
      >
        <h2 className="mb-4 text-2xl">{title}</h2>
        {children}
        <div className="flex justify-end mt-5">
          {onSave && (
            <button
              className="px-4 py-2 mr-2 bg-blue-500 text-white"
              onClick={onSave}
            >
              {onSaveButtonLabel || "Save"}
            </button>
          )}
          <button className="px-4 py-2 bg-gray-300" onClick={onClose}>
            {onCloseButtonLabel || "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
