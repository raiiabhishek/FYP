import React, { useState, useEffect, useRef } from "react";
import { MdClose, MdAdd } from "react-icons/md";
const Popup = ({ children, isOpen, onClose }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";

      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto"; // reset body overflow
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 pointer-events-none"
      style={{
        backdropFilter: "blur(0.5px)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        className="pointer-events-auto relative max-w-md p-6 rounded-lg shadow-xl bg-white bg-opacity-20 border border-gray-200"
        ref={overlayRef}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
