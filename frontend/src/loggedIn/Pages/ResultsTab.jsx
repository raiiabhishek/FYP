import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MdAdd, MdClose } from "react-icons/md";
import { AuthContext } from "../../../AuthContext";

const ResultsTab = ({ moduleId }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken, role, id } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateResultModalOpen, setIsCreateResultModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [obtainedGrade, setObtainedGrade] = useState("");
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${api}/students/teacher`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setStudents(response.data.data);
    } catch (e) {
      setError("Error Fetching Studnets");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${api}/results/module/${moduleId}`;
        if (role === "student") url = `${api}/results/std/${moduleId}/${id}`;

        const response = await axios.get(url, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response.data.data);
        setResults(response.data.data);
      } catch (err) {
        setError("Failed to fetch results.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (role === "teacher") {
      fetchStudents();
    }

    fetchData();
  }, [role, id]);

  const handleCreateResult = async () => {
    try {
      console.log({
        selectedStudent,
        moduleId,
        obtainedGrade,
      });
      const result = await axios.post(
        `${api}/results/create`,
        {
          student: selectedStudent,
          moduleId: moduleId,
          obtainedGrade: obtainedGrade,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setIsCreateResultModalOpen(false);
      setObtainedGrade("");
      setSelectedStudent("");
      // Optionally, refetch results after successful creation
      if (role === "teacher") {
        const response = await axios.get(`${api}/results/module/${moduleId}`);
        setResults(response.data.data);
      }
    } catch (e) {
      setError("Error Creating Result");
    }
  };
  const renderResults = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    if (results.length == 0) {
      return <p>No results available.</p>;
    }

    if (role === "student") {
      return (
        <div className="overflow-x-auto h-screen">
          <table className="min-w-full leading-normal">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {results?.length > 0 &&
                results.map((result, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {result.obtainedGrade}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      );
    } else if (role === "teacher") {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {results?.length > 0 &&
                results.map((result, index) => (
                  <tr key={`${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {result.student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {result.obtainedGrade}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-4 relative ">
      <h2 className="text-2xl font-bold mb-4 ">Results</h2>
      {renderResults()}

      {isCreateResultModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Create Result</h3>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Student:
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Select a Student</option>
                {students &&
                  students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Obtained Grade:
              </label>
              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={obtainedGrade}
                onChange={(e) => setObtainedGrade(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsCreateResultModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateResult}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {role === "teacher" && (
        <button
          className="w-14 h-14 rounded-full bg-purple-500 text-white shadow-lg flex items-center justify-center text-3xl transition-transform duration-300 hover:bg-purple-600 focus:outline-none absolute bottom-4 right-4"
          onClick={() => setIsCreateResultModalOpen(true)}
          style={{
            transform: `rotate(${isCreateResultModalOpen ? 135 : 0}deg)`,
          }}
        >
          <MdAdd />
        </button>
      )}
    </div>
  );
};

export default ResultsTab;
