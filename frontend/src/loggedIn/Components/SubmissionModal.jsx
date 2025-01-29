import { React, useState } from "react";
const SubmissionModal = ({
  open,
  handleClose,
  selectedAssignment,
  submissionFiles,
  handleAssignmentSubmission,
  isSubmissionAllowed,
}) => {
  const [submissionFileInputs, setSubmissionFileInputs] = useState([
    { id: Date.now() },
  ]);

  const handleAddSubmissionFileInput = () => {
    setSubmissionFileInputs([...submissionFileInputs, { id: Date.now() }]);
  };

  const handleRemoveSubmissionFileInput = (id) => {
    setSubmissionFileInputs(
      submissionFileInputs.filter((input) => input.id !== id)
    );
    const updatedFiles = submissionFiles.filter(
      (fileObj) =>
        !submissionFileInputs.find((input) => input.id === fileObj.id)
    );
    setSubmissionFiles(updatedFiles);
  };

  const handleSubmissionFileChangeMultiple = (e, id) => {
    const filesArray = Array.from(e.target.files).map((file) => ({
      file: file,
      id: id,
    }));
    setSubmissionFiles([...submissionFiles, ...filesArray]);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {selectedAssignment && (
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            Submit Assignment: {selectedAssignment.title}
          </h2>
          <div className="mb-4">
            <p className="text-gray-600">{selectedAssignment.description}</p>
            <p className="text-sm text-gray-500">
              End Date:{" "}
              {new Date(selectedAssignment.endDate).toLocaleDateString()}
            </p>
            {isSubmissionAllowed && (
              <>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Upload Files
                </label>
                {submissionFileInputs.map((input, index) => (
                  <div key={input.id} className="flex items-center mb-2">
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id={`contained-button-file-submission-${input.id}`}
                      type="file"
                      multiple
                      onChange={(e) =>
                        handleSubmissionFileChangeMultiple(e, input.id)
                      }
                    />
                    <label
                      htmlFor={`contained-button-file-submission-${input.id}`}
                    >
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                        type="button"
                      >
                        Upload Files
                      </button>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubmissionFileInput(input.id)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <MdClose size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddSubmissionFileInput}
                  className="flex items-center mt-2 bg-gray-100 text-gray-700  rounded px-2 py-1 hover:bg-gray-200 "
                >
                  <MdAdd size={20} className="mr-1" /> Add File Upload
                </button>
                {submissionFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Uploaded Files:</h4>
                    <ul>
                      {submissionFiles.map((fileObj) => (
                        <li
                          key={fileObj.id}
                          className="flex items-center justify-between py-1"
                        >
                          <span>{fileObj.file.name}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveSubmissionFileInput(fileObj.id)
                            }
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            <MdClose size={20} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            {isSubmissionAllowed && (
              <button
                onClick={() =>
                  handleAssignmentSubmission(selectedAssignment._id)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionModal;
