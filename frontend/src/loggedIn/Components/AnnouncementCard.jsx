import React, { useState } from "react";
import { TfiAnnouncement } from "react-icons/tfi";
import Popup from "./Popup";

export default function AnnouncementCard({ announcement }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div
        className="flex gap-3 items-center p-2 rounded cursor-pointer"
        onClick={openPopup}
      >
        <TfiAnnouncement className="text-xl" />
        <div>
          <h1 className="hover:underline">{announcement.name}</h1>
          <h2 className="text-gray-500">{announcement.course.name}</h2>
        </div>
      </div>

      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">{announcement.name}</h2>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Course:</span>{" "}
            {announcement.course.name}
          </p>
          <p className="text-gray-700 mb-4">{announcement.description}</p>

          {/* Add other details if needed */}
          <button
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            onClick={closePopup}
          >
            Close
          </button>
        </div>
      </Popup>
    </>
  );
}
