import { useState } from 'preact/hooks';

interface ErrorModalProps {
  open?: boolean;
  error?: string;
}

const ErrorModal = ({ open = false, error = "Unknown Error" }: ErrorModalProps) => {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <div>
      <input
        type="checkbox"
        id="error"
        className="modal-toggle"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="modal">
          <div className="modal-box">
            <div className="grid items-center justify-center bg-[#f2f3f4] p-4">
              <div className="my-8">
                An error occurred while trying to stamp specification.
              </div>
              <div className="my-4">{error}</div>
              <button
                className="btn btn-sm btn-error"
                onClick={() => setIsOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorModal;