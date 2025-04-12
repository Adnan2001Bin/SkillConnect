// src/components/Admin/Talent/TalentCard.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import TalentDetails from "./TalentDetails";
import EditForm from "./EditForm";

const TalentCard = ({
  talent,
  expandedCard,
  toggleCard,
  handleEdit,
  handleDelete,
  editTalent,
  setEditTalent,
  setTalents,
  setExpandedCard,
}) => {
  const isExpanded = expandedCard === talent._id;
  const isEditing = editTalent && editTalent._id === talent._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Card Header */}
      <div
        className="flex items-center p-6 cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={() => toggleCard(talent._id)}
      >
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 mr-6">
          <img
            src={talent.profileImage || "https://via.placeholder.com/150?text=No+Image"}
            alt={`${talent.name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-white">{talent.name}</h2>
          <p className="text-gray-300">{talent.email}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {talent.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
            {talent.skills.length > 3 && (
              <span className="text-gray-400">+{talent.skills.length - 3}</span>
            )}
          </div>
        </div>
        <div className="ml-4">
          {isExpanded ? (
            <FaChevronUp className="text-indigo-400 text-xl" />
          ) : (
            <FaChevronDown className="text-indigo-400 text-xl" />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-gray-850 border-t border-gray-700"
          >
            {isEditing ? (
              <EditForm
                editTalent={editTalent}
                setEditTalent={setEditTalent}
                talent={talent}
                setTalents={setTalents}
                setExpandedCard={setExpandedCard}
              />
            ) : (
              <TalentDetails
                talent={talent}
                onEdit={() => handleEdit(talent)}
                onDelete={handleDelete}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TalentCard;