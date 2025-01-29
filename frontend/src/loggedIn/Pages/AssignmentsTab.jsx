import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import { MdAdd, MdClose, MdEdit } from "react-icons/md";
import axios from "axios";
import Popup from "../Components/Popup";

const AssignmentsTab = ({
  module,
  role,
  handleOpenSubmission,
  isSubmissionAllowed,
}) => {
  const api = import.meta.env.VITE_URL;
  const { authToken, id } = useContext(AuthContext);
  const [openAssignmentId, setOpenAssignmentId] = useState(null);
  const [fileInputs, setFileInputs] = useState([{ id: 0 }]);
  const fileInputRefs = useRef({});
  const [fileUploads, setFileUploads] = useState({});
  const [submissionRemarks, setSubmissionRemarks] = useState("");
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [isEditingSubmission, setIsEditingSubmission] = useState(false);
  const [isEditingAssignment, setIsEditingAssignment] = useState(false);
  const [originalSubmissionRemarks, setOriginalSubmissionRemarks] =
    useState("");
  const [editedAssignment, setEditedAssignment] = useState({
    title: "",
    description: "",
    endDate: "",
  });

  const handleAddFileInput = () => {
    const newId = fileInputs.length;
    setFileInputs((prev) => [...prev, { id: newId }]);
  };
  const handleRemoveFileInput = (id) => {
    setFileInputs((prev) => prev.filter((input) => input.id !== id));
    // Remove the file from the fileUploads state
    setFileUploads((prevFileUploads) => {
      const { [id]: removed, ...rest } = prevFileUploads;
      return rest;
    });
  };
  // Handles changes to file inputs
  const handleFileChangeMultiple = (e, id) => {
    // Update fileUploads state to store files using id as the key
    setFileUploads((prev) => ({ ...prev, [id]: e.target.files }));
  };

  const handleAssignmentInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const openPopup = (assignmentId) => {
    setOpenAssignmentId(assignmentId);
    setCurrentSubmission(null);
    setIsEditingSubmission(false);
    setIsEditingAssignment(false);
    setEditedAssignment({ title: "", description: "", endDate: "" });
    setFileInputs([{ id: 0 }]); // Reset file inputs

    const selectedAssignment = module.assignments.find(
      (assignment) => assignment._id === assignmentId
    );

    if (selectedAssignment) {
      setEditedAssignment({
        title: selectedAssignment.title,
        description: selectedAssignment.description,
        endDate: selectedAssignment.endDate,
      });
    }

    if (
      selectedAssignment &&
      role === "student" &&
      selectedAssignment.submissions
    ) {
      const userSubmission = selectedAssignment.submissions.find(
        (sub) => sub.user._id === id
      );
      if (userSubmission) {
        setCurrentSubmission(userSubmission);
        setSubmissionRemarks(userSubmission.remarks || "");
        setOriginalSubmissionRemarks(userSubmission.remarks || "");

        // Load files into fileUploads
        if (userSubmission.files) {
          const initialFiles = {};
          userSubmission.files.forEach((file, index) => {
            initialFiles[index] = file; // Store the file URL/path
            if (fileInputs.length <= index) {
              setFileInputs((prev) => [...prev, { id: index }]);
            }
          });
          // Store old file paths using the file input id
          setFileUploads(initialFiles);
        } else {
          setFileUploads({});
        }
      } else {
        setFileUploads({});
      }
    } else {
      setFileUploads({});
    }
  };
  const closePopup = () => {
    setOpenAssignmentId(null);
    setSubmissionError(null);
    setSubmissionSuccess(null);
    setFileUploads({});
    setSubmissionRemarks("");
    setCurrentSubmission(null);
    setIsEditingSubmission(false);
    setIsEditingAssignment(false);
    setEditedAssignment({ title: "", description: "", endDate: "" });
    setFileInputs([{ id: 0 }]); // Reset file inputs on close
  };

  const handleEditedAssignment = async (assignment) => {
    setSubmissionError(null);
    setSubmissionSuccess(null);
    try {
      const response = await axios.put(
        `${api}/assignments/${assignment._id}`,
        editedAssignment,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.data.status === "success") {
        setSubmissionSuccess("Assignment updated successfully!");
        setIsEditingAssignment(false);
        setTimeout(() => {
          closePopup();
        }, 1000);
      } else {
        setSubmissionError(
          response.data.message || "Failed to edit assignment."
        );
      }
    } catch (error) {
      setSubmissionError(
        error.response?.data?.message || "An error occurred during submission."
      );
    }
  };

  const handleCreateSubmission = async (assignment) => {
    setSubmissionError(null);
    setSubmissionSuccess(null);
    if (!isSubmissionAllowed(assignment)) {
      setSubmissionError("Submission is not allowed for this assignment.");
      return;
    }
    const formData = new FormData();

    // Iterate through the fileUploads and append all the files
    for (const key in fileUploads) {
      const files = fileUploads[key];
      if (Array.isArray(files)) {
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
      }
    }
    formData.append("remarks", submissionRemarks);
    try {
      const response = await axios.post(
        `${api}/submissions/${assignment._id}/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.data.status === "success") {
        setSubmissionSuccess("Submission successful!");
        // Reset file inputs and uploads after successful submission
        setFileUploads({});
        setCurrentSubmission(response.data.submission);
        setSubmissionRemarks(response.data.submission.remarks);
        setIsEditingSubmission(false);
        setOriginalSubmissionRemarks(response.data.submission.remarks);
        setTimeout(() => {
          closePopup();
        }, 1000);
      } else {
        setSubmissionError(response.data.message || "Submission failed");
      }
    } catch (error) {
      setSubmissionError(
        error.response?.data?.message || "An error occurred during submission."
      );
    }
  };
  const handleEditSubmission = async (assignment) => {
    setSubmissionError(null);
    setSubmissionSuccess(null);

    const formData = new FormData();
    for (const key in fileUploads) {
      const files = fileUploads[key];

      if (files instanceof FileList) {
        for (const file of files) {
          formData.append("files", file);
        }
      }
    }

    formData.append("remarks", submissionRemarks);
    try {
      const response = await axios.patch(
        `${api}/submissions/${assignment._id}/edit/${currentSubmission._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        setSubmissionSuccess("Submission updated successfully!");
        closePopup();
        // Reset file inputs and uploads after successful submission
        setFileUploads({});
        setCurrentSubmission(response.data.submission);
        setSubmissionRemarks(response.data.submission.remarks);
        setIsEditingSubmission(false);
        setOriginalSubmissionRemarks(response.data.submission.remarks);
      } else {
        setSubmissionError(response.data.message || "Submission failed");
      }
    } catch (error) {
      setSubmissionError(
        error.response?.data?.message || "An error occurred during submission."
      );
    }
  };
  const handleSubmission = async (assignment, isEdit = false) => {
    if (isEdit) {
      handleEditSubmission(assignment);
    } else {
      handleCreateSubmission(assignment);
    }
  };

  const handleEditSubmissionClick = () => {
    setIsEditingSubmission(true);
    setOriginalSubmissionRemarks(submissionRemarks);
    //keep the file inputs and uploads as they are for editing purpose
  };
  const handleEditAssignmentClick = () => {
    setIsEditingAssignment(true);
  };

  const handleCancelAssignmentEdit = () => {
    setIsEditingAssignment(false);
    const selectedAssignment = module.assignments.find(
      (assignment) => assignment._id === openAssignmentId
    );
    if (selectedAssignment) {
      setEditedAssignment({
        title: selectedAssignment.title,
        description: selectedAssignment.description,
        endDate: selectedAssignment.endDate,
      });
    }
    setSubmissionError(null);
    setSubmissionSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsEditingSubmission(false);
    setSubmissionRemarks(originalSubmissionRemarks);
    //reset the file inputs, as it does not need to be populated anymore
    setFileUploads({});
    setFileInputs([{ id: 0 }]);
  };

  return (
    <ul className="space-y-2">
      {module.assignments.map((assignment) => (
        <li
          key={assignment._id}
          className="border p-4 rounded flex justify-between items-center"
          onClick={() => openPopup(assignment._id)}
        >
          <div className="flex-grow">
            <h3 className="font-semibold text-lg">{assignment.title}</h3>
            <p className="text-gray-600">{assignment.description}</p>
            <p className="text-sm text-gray-500">
              End Date: {new Date(assignment.endDate).toLocaleDateString()}
            </p>
          </div>
          {role === "instructor" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditAssignmentClick();
              }}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              <MdEdit size={20} /> Edit Assignment
            </button>
          )}
        </li>
      ))}
      <Popup isOpen={openAssignmentId !== null} onClose={closePopup}>
        <div className="p-4">
          {isEditingAssignment ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Edit Assignment</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editedAssignment.title}
                  onChange={handleAssignmentInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editedAssignment.description}
                  onChange={handleAssignmentInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={
                    editedAssignment.endDate
                      ? new Date(editedAssignment.endDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleAssignmentInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {submissionError && (
                <p className="text-red-500 mb-2">{submissionError}</p>
              )}
              {submissionSuccess && (
                <p className="text-green-500 mb-2">{submissionSuccess}</p>
              )}
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 rounded bg-green-500 text-white focus:outline-none hover:bg-green-600"
                  onClick={() =>
                    handleEditedAssignment(
                      module.assignments.find(
                        (assignment) => assignment._id === openAssignmentId
                      )
                    )
                  }
                >
                  Submit Edits
                </button>
                <button
                  className="px-4 py-2 rounded bg-gray-400 text-white focus:outline-none hover:bg-gray-500"
                  onClick={handleCancelAssignmentEdit}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            module.assignments.find(
              (assignment) => assignment._id === openAssignmentId
            ) && (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  {
                    module.assignments.find(
                      (assignment) => assignment._id === openAssignmentId
                    ).title
                  }
                </h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Files:</span>{" "}
                  <div className="flex gap-2">
                    {module.assignments
                      .find((assignment) => assignment._id === openAssignmentId)
                      .files?.map((file, index) => (
                        <button
                          key={index}
                          className="p-2 bg-green-700 text-white rounded"
                        >
                          <a href={`${api}/files/${file}`}>File {index + 1}</a>
                        </button>
                      ))}
                  </div>
                </p>
                <p className="text-gray-700 mb-4">
                  {
                    module.assignments.find(
                      (assignment) => assignment._id === openAssignmentId
                    ).description
                  }
                </p>
                {role === "student" && (
                  <>
                    {currentSubmission ? (
                      <>
                        <p className="text-gray-600 mb-2">
                          <span className="font-semibold">
                            Submitted Files:
                          </span>{" "}
                          <div className="flex gap-2">
                            {currentSubmission.files?.map((file, index) => (
                              <button
                                key={index}
                                className="p-2 bg-blue-700 text-white rounded"
                              >
                                <a href={`${api}/files/${file}`}>
                                  File {index + 1}
                                </a>
                              </button>
                            ))}
                          </div>
                        </p>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Remarks
                          </label>
                          <textarea
                            value={submissionRemarks}
                            readOnly={!isEditingSubmission}
                            onChange={(e) =>
                              setSubmissionRemarks(e.target.value)
                            }
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        {isEditingSubmission ? (
                          <>
                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Upload Files
                              </label>
                              {fileInputs.map((input, index) => (
                                <div
                                  key={input.id}
                                  className="flex items-center mb-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    {typeof fileUploads[input.id] ===
                                      "string" && (
                                      <span className="text-gray-600">
                                        {fileUploads[input.id].split("/").pop()}
                                      </span>
                                    )}
                                    <input
                                      accept="image/*"
                                      type="file"
                                      multiple
                                      ref={(el) =>
                                        (fileInputRefs.current[input.id] = el)
                                      }
                                      onChange={(e) =>
                                        handleFileChangeMultiple(e, input.id)
                                      }
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveFileInput(input.id)
                                    }
                                    className="text-red-600 hover:text-red-800 ml-2"
                                  >
                                    <MdClose size={20} />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={handleAddFileInput}
                                className="flex items-center mt-2 bg-gray-100 text-gray-700  rounded px-2 py-1 hover:bg-gray-200 "
                              >
                                <MdAdd size={20} className="mr-1" /> Add File
                                Upload
                              </button>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                className="px-4 py-2 rounded bg-green-500 text-white focus:outline-none hover:bg-green-600"
                                onClick={() =>
                                  handleSubmission(
                                    module.assignments.find(
                                      (assignment) =>
                                        assignment._id === openAssignmentId
                                    ),
                                    true
                                  )
                                }
                              >
                                Submit Edits
                              </button>
                              <button
                                className="px-4 py-2 rounded bg-gray-400 text-white focus:outline-none hover:bg-gray-500"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <p className="text-green-500 mb-2">
                              You have already submitted this assignment.
                            </p>
                            <button
                              onClick={handleEditSubmissionClick}
                              className="text-blue-600 hover:text-blue-800 focus:outline-none"
                            >
                              <MdEdit size={20} /> Edit Submission
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Upload Files
                          </label>
                          {fileInputs.map((input, index) => (
                            <div
                              key={input.id}
                              className="flex items-center mb-2"
                            >
                              <input
                                accept="image/*"
                                type="file"
                                multiple
                                ref={(el) =>
                                  (fileInputRefs.current[input.id] = el)
                                }
                                onChange={(e) =>
                                  handleFileChangeMultiple(e, input.id)
                                }
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveFileInput(input.id)}
                                className="text-red-600 hover:text-red-800 ml-2"
                              >
                                <MdClose size={20} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={handleAddFileInput}
                            className="flex items-center mt-2 bg-gray-100 text-gray-700  rounded px-2 py-1 hover:bg-gray-200 "
                          >
                            <MdAdd size={20} className="mr-1" /> Add File Upload
                          </button>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Remarks
                          </label>
                          <textarea
                            value={submissionRemarks}
                            onChange={(e) =>
                              setSubmissionRemarks(e.target.value)
                            }
                            placeholder="Enter your remarks here..."
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        {submissionError && (
                          <p className="text-red-500 mb-2">{submissionError}</p>
                        )}
                        {submissionSuccess && (
                          <p className="text-green-500 mb-2">
                            {submissionSuccess}
                          </p>
                        )}
                        <button
                          className={`ml-4 px-4 py-2 rounded bg-blue-500 text-white focus:outline-none hover:bg-blue-600 ${
                            !isSubmissionAllowed(
                              module.assignments.find(
                                (assignment) =>
                                  assignment._id === openAssignmentId
                              )
                            )
                              ? "opacity-50 cursor-not-allowed hover:bg-blue-500"
                              : ""
                          }`}
                          onClick={() =>
                            handleSubmission(
                              module.assignments.find(
                                (assignment) =>
                                  assignment._id === openAssignmentId
                              )
                            )
                          }
                          disabled={
                            !isSubmissionAllowed(
                              module.assignments.find(
                                (assignment) =>
                                  assignment._id === openAssignmentId
                              )
                            )
                          }
                        >
                          {isSubmissionAllowed(
                            module.assignments.find(
                              (assignment) =>
                                assignment._id === openAssignmentId
                            )
                          )
                            ? "Submit Assignment"
                            : "Submission Closed"}
                        </button>
                      </>
                    )}
                  </>
                )}
                <button
                  className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                  onClick={closePopup}
                >
                  Close
                </button>
              </>
            )
          )}
        </div>
      </Popup>
    </ul>
  );
};

export default AssignmentsTab;
