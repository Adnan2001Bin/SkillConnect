import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const TalentDetails = ({ talent, onEdit, onDelete }) => {
  // Custom toast confirmation for delete
  const confirmDelete = (id) => {
    toast(
      <div>
        <p>Are you sure you want to delete this talent?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              onDelete(id);
              toast.dismiss();
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  return (
    <div className="text-gray-300 space-y-6">
      {talent.portfolio && (
        <p>
          <span className="font-semibold text-white">Portfolio:</span>{" "}
          <a
            href={talent.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline"
          >
            {talent.portfolio}
          </a>
        </p>
      )}
      {talent.skills && talent.skills.length > 0 && (
        <div>
          <p className="font-semibold text-white">Skills:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {talent.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      {talent.experience && talent.experience.length > 0 && (
        <div>
          <p className="font-semibold text-white">Experience:</p>
          <ul className="mt-2 space-y-4">
            {talent.experience.map((exp, index) => (
              <li key={index} className="p-4 bg-gray-900 rounded-lg">
                <p className="text-white">{exp.role} at {exp.company}</p>
                <p className="text-gray-400">
                  {new Date(exp.startDate).toLocaleDateString()} -{" "}
                  {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                </p>
                <p className="text-gray-500 mt-1">{exp.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {talent.education && talent.education.length > 0 && (
        <div>
          <p className="font-semibold text-white">Education:</p>
          <ul className="mt-2 space-y-4">
            {talent.education.map((edu, index) => (
              <li key={index} className="p-4 bg-gray-900 rounded-lg">
                <p className="text-white">{edu.degree} in {edu.fieldOfStudy}</p>
                <p className="text-gray-400">{edu.institution}</p>
                <p className="text-gray-500">
                  {new Date(edu.startDate).toLocaleDateString()} -{" "}
                  {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex gap-4 mt-6">
        <button
          onClick={onEdit}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaEdit className="mr-2" /> Edit
        </button>
        <button
          onClick={() => confirmDelete(talent._id)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaTrash className="mr-2" /> Delete
        </button>
      </div>
    </div>
  );
};

export default TalentDetails;