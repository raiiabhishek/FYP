import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserGrowth = () => {
  const api = import.meta.env.VITE_URL;
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${api}/users`);
        if (response.status === 200) {
          const users = response.data.data;
          const historicalData = processUserData(users);
          setUserHistory(historicalData);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const processUserData = (users) => {
    const timeMap = {};
    const sortedUsers = [...users].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    sortedUsers.forEach((user) => {
      const date = moment(user.createdAt).format("YYYY-MM-DD");

      if (!timeMap[date]) {
        timeMap[date] = {
          timestamp: date,
          teacherCount: 0,
          studentCount: 0,
        };
      }

      if (user.role === "teacher") {
        timeMap[date].teacherCount++;
      } else if (user.role === "student") {
        timeMap[date].studentCount++;
      }
    });

    // Convert map values to an array and sort it
    const sortedData = Object.values(timeMap).sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Accumulate the counts per day
    const accumulatedData = sortedData.reduce((acc, curr, index) => {
      const prev = acc[index - 1] || { teacherCount: 0, studentCount: 0 };

      acc.push({
        ...curr,
        teacherCount: curr.teacherCount + prev.teacherCount,
        studentCount: curr.studentCount + prev.studentCount,
      });

      return acc;
    }, []);

    return accumulatedData;
  };

  if (loading) {
    return <div className="text-center mt-4">Loading data...</div>;
  }

  if (error) {
    return <div className="text-center mt-4 text-red-500">Error: {error}</div>;
  }

  if (!userHistory || userHistory.length === 0) {
    return (
      <div className="text-center mt-4">No historical data available.</div>
    );
  }

  return (
    <div className="w-full bg-white rounded-md ">
      <h2 className="text-xl font-semibold mb-4 text-center">
        User Growth Over Time
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={userHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="teacherCount"
            stroke="#1447E6"
            name="Teachers"
          />
          <Line
            type="monotone"
            dataKey="studentCount"
            stroke="#008236"
            name="Students"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowth;
