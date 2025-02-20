import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import { MdAdd, MdClose } from "react-icons/md";
import axios from "axios";
import Sidebar from "../Components/SideBar";
import CreateAssignmentModal from "../Components/CreateAssignmentModal";
import AssignmentsTab from "./AssignmentsTab";
import ResultsTab from "./ResultsTab";

const ModuleDetails = () => {
  const { moduleId } = useParams();
  const api = import.meta.env.VITE_URL;
  const { authToken, role } = useContext(AuthContext);
  const [module, setModule] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [createAssignmentOpen, setCreateAssignmentOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    endDate: "",
    files: [],
  });
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [remarks, setRemarks] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleTabChange = (newValue) => {
    console.log("clicked");
    setActiveTab(newValue);
  };

  const handleOpenCreateAssignment = () => {
    setCreateAssignmentOpen(true);
  };

  const handleCloseCreateAssignment = () => {
    setCreateAssignmentOpen(false);
    resetNewAssignment();
  };

  const resetNewAssignment = () => {
    setNewAssignment({ title: "", description: "", endDate: "", files: [] });
  };

  const handleAssignmentInputChange = (e) => {
    setNewAssignment({ ...newAssignment, [e.target.name]: e.target.value });
  };

  const handleCreateAssignment = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newAssignment.title);
      formData.append("description", newAssignment.description);
      formData.append("endDate", newAssignment.endDate);
      formData.append("module", moduleId);
      newAssignment.files.forEach((fileObj) =>
        formData.append("files", fileObj.file)
      );
      const response = await axios.post(
        `${api}/assignments/${moduleId}/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchModule();
      handleCloseCreateAssignment();
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  const handleOpenSubmission = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleCloseSubmission = () => {
    setSelectedAssignment(null);
    setSubmissionFiles([]);
  };

  const handleAssignmentSubmission = async (assignmentId) => {
    try {
      const formData = new FormData();
      submissionFiles.forEach((fileObj) =>
        formData.append("files", fileObj.file)
      );
      formData.append("remarks", remarks);
      const response = await axios.post(
        `${api}/submissions/${assignmentId}/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status !== 201) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchModule();
      handleCloseSubmission();
    } catch (error) {
      console.error("Error creating submission: ", error);
    }
  };

  useEffect(() => {
    fetchModule();
  }, [moduleId, authToken, api]);

  const fetchModule = async () => {
    try {
      const response = await axios.get(`${api}/modules/getModule/${moduleId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setModule(response.data.data);
    } catch (error) {
      console.error("Error fetching module:", error);
    }
  };

  if (!module) {
    return <div className="text-center">Loading...</div>;
  }

  const isSubmissionAllowed = (assignment) => {
    return new Date(assignment.endDate) > new Date();
  };

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <div className="container mx-auto p-4 relative">
        {/* Module Details Header */}
        <h2 className="text-2xl font-bold mb-2">{module.name}</h2>
        <p className="text-gray-700 mb-4">{module.description}</p>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex">
            <button
              className={`px-4 py-2 rounded-t-md border-b-2 focus:outline-none
                  ${
                    activeTab === 0
                      ? "border-blue-500 text-blue-700 font-semibold"
                      : "border-transparent hover:border-gray-300 text-gray-500"
                  }`}
              onClick={() => handleTabChange(0)}
            >
              Assignments
            </button>
            <button
              className={`px-4 py-2 rounded-t-md border-b-2 focus:outline-none
                  ${
                    activeTab === 1
                      ? "border-blue-500 text-blue-700 font-semibold"
                      : "border-transparent hover:border-gray-300 text-gray-500"
                  }`}
              onClick={() => handleTabChange(1)}
            >
              Results
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 0 && (
          <div className="p-2">
            <AssignmentsTab
              module={module}
              role={role}
              handleOpenSubmission={handleOpenSubmission}
              isSubmissionAllowed={isSubmissionAllowed}
            />
          </div>
        )}
        {activeTab === 1 && (
          <div className="p-2">
            <ResultsTab moduleId={moduleId} />
          </div>
        )}

        {/* Floating Action Button (FAB) */}
        {role === "teacher" && activeTab === 0 && (
          <button
            className="w-14 h-14 rounded-full bg-purple-500 text-white shadow-lg flex items-center justify-center text-3xl transition-transform duration-300 hover:bg-purple-600 focus:outline-none absolute bottom-4 right-4"
            onClick={handleOpenCreateAssignment}
            style={{
              transform: `rotate(${createAssignmentOpen ? 135 : 0}deg)`,
            }}
          >
            <MdAdd />
          </button>
        )}

        {/* Modals */}
        <CreateAssignmentModal
          open={createAssignmentOpen}
          handleClose={handleCloseCreateAssignment}
          handleInputChange={handleAssignmentInputChange}
          handleCreate={handleCreateAssignment}
          newAssignment={newAssignment}
          setNewAssignment={setNewAssignment}
        />
      </div>
    </div>
  );
};

export default ModuleDetails;
