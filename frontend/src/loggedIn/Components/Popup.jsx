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
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 pointer-events-none transition-all"
      style={{
        backdropFilter: "blur(0.5px)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        className="pointer-events-auto relative p-6 rounded-lg shadow-xl bg-white bg-opacity-20 transition-all max-w-md sm:max-w-lg md:max-w-xl"
        ref={overlayRef}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
