import { h } from 'preact';
import { useState } from 'preact/hooks';

const Modal = ({ open, setOpen }) => {
  const handleChange = (event) => {
    setOpen(event.target.checked);
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
              <img class="text-center w-full" src="arweave-loader.gif" alt="loading" />
              <div class="text-center">Loading Specs...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
