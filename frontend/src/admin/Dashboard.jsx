// Dashboard.js
import React from "react";
import CalendarView from "./Components/CalendarView";
import Chart from "./Components/Chart";

export default function Dashboard() {
  return (
    <div className="md:flex justify-between">
      <div></div> {/* Placeholder */}
      <div>
        <CalendarView />
        <Chart />
      </div>
    </div>
  );
}
