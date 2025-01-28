import React, { useState } from "react";
import { AiFillCalendar } from "react-icons/ai";
import moment from "moment";
import Popup from "./Popup";
export default function EventCard({ event }) {
  const { title, startDate, endDate, startTime, endTime, location } = event;

  const formattedDate = moment(startDate).format("MMMM D, YYYY");
  const formattedStartTime = moment(startTime, "HH:mm").format("h:mma");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  return (
    <>
      <div className="flex gap-3 items-center" onClick={openPopup}>
        <AiFillCalendar className="text-2xl" />
        <div>
          <h1 className="hover:underline cursor-pointer">{title}</h1>
          <p className="text-sm text-gray-600">
            {formattedDate}, {formattedStartTime}
          </p>
          <p className="text-sm text-gray-600">{location}</p>
        </div>
      </div>
      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Start:</span> {formattedStartTime}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Location:</span> {event.location}
          </p>
          <p className="text-gray-700 mb-4">{event.description}</p>
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
