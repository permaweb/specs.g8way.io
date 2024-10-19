const Modal = ({ open, setOpen }: {
  open: boolean,
  setOpen?: (checked: boolean) => void
}) => {
  const handleChange = (event) => {
    if (setOpen) {
      setOpen(event.target.checked);
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        id="loading"
        class="modal-toggle"
        checked={open}
        onChange={handleChange}
      />
      {open && (
        <div class="modal">
          <div class="modal-box">
            <div class="grid items-center justify-center bg-[#f2f3f4] p-4">
              <img class="text-center w-full" src="/arweave-loader.gif" alt="loading123" /> 
              <div class="text-center">Loading...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
