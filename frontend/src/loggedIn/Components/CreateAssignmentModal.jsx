import { React, useState, useRef, useEffect } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const CreateAssignmentModal = ({
  open,
  handleClose,
  handleInputChange,
  handleCreate,
  newAssignment,
  setNewAssignment,
}) => {
  const [fileInputs, setFileInputs] = useState([{ id: Date.now() }]);
  const fileInputRefs = useRef({});

  useEffect(() => {
    // When modal is closed, clear all file inputs
    if (!open) {
      fileInputRefs.current = {};
      setFileInputs([{ id: Date.now() }]); //Reset to have a single input ready
    }
  }, [open]);

  const handleAddFileInput = () => {
    setFileInputs([...fileInputs, { id: Date.now() }]);
  };

  const handleRemoveFileInput = (id) => {
    setFileInputs(fileInputs.filter((input) => input.id !== id));
    const updatedFiles = newAssignment.files.filter(
      (fileObj) => fileObj.id !== id
    );
    setNewAssignment({ ...newAssignment, files: updatedFiles });
    delete fileInputRefs.current[id];
  };

  const handleFileChangeMultiple = (e, id) => {
    const filesArray = Array.from(e.target.files).map((file) => ({
      file: file,
      id: id,
    }));
    setNewAssignment({
      ...newAssignment,
      files: [...newAssignment.files, ...filesArray],
    });
  };

  const resetFileInputs = () => {
    Object.values(fileInputRefs.current).forEach((inputRef) => {
      if (inputRef && inputRef.current) {
        inputRef.current.value = "";
      }
    });
  };

  const handleCreateWrapper = () => {
    resetFileInputs();
    setNewAssignment({ ...newAssignment, files: [] }); //Clear files from parent
    handleCreate(); //Call parent create action
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center  bg-opacity-50 transition-opacity duration-300 backdrop-blur-xs ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Assignment</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={newAssignment.title}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={newAssignment.description}
            onChange={handleInputChange}
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            End Date
          </label>
          <input
            type="datetime-local"
            name="endDate"
            value={newAssignment.endDate}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload Files
          </label>
          {fileInputs.map((input, index) => (
            <div key={input.id} className="flex items-center mb-2">
              <input
                accept="image/*"
                type="file"
                multiple
                ref={(el) => (fileInputRefs.current[input.id] = el)}
                onChange={(e) => handleFileChangeMultiple(e, input.id)}
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
        {newAssignment.files && newAssignment.files.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Uploaded Files:</h4>
            <ul>
              {newAssignment.files.map((fileObj) => (
                <li
                  key={fileObj.id}
                  className="flex items-center justify-between py-1"
                >
                  <span>{fileObj.file.name}</span>
                  <button
                    onClick={() => handleRemoveFileInput(fileObj.id)}
                    type="button"
                    className="text-red-600 hover:text-red-800"
                  >
                    <MdClose size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateWrapper}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignmentModal;
