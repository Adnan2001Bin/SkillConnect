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
      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden w-full"
    >
      <div
        className="flex flex-col sm:flex-row items-center p-4 sm:p-6 cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={() => toggleCard(talent._id)}
      >
        <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
          <img
            src={talent.profileImage || "https://via.placeholder.com/150?text=No+Image"}
            alt={`${talent.name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">{talent.name}</h2>
          <p className="text-gray-300 text-sm sm:text-base">{talent.email}</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">{talent.category}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
            {talent.services.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 bg-indigo-600 text-white text-xs sm:text-sm rounded-full"
              >
                {service}
              </span>
            ))}
            {talent.services.length > 3 && (
              <span className="text-gray-400 text-xs sm:text-sm">
                +{talent.services.length - 3}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4">
          {isExpanded ? (
            <FaChevronUp className="text-indigo-400 text-lg sm:text-xl" />
          ) : (
            <FaChevronDown className="text-indigo-400 text-lg sm:text-xl" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 bg-gray-850 border-t border-gray-700"
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