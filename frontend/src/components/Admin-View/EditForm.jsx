import React from "react";
import { toast } from "react-toastify";

const EditForm = ({ editTalent, setEditTalent, talent, setTalents, setExpandedCard }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditTalent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditTalent((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editTalent.name);
      formData.append("email", editTalent.email);
      formData.append("skills", editTalent.skills);
      formData.append("portfolio", editTalent.portfolio || "");
      formData.append("experience", JSON.stringify(editTalent.experience));
      formData.append("education", JSON.stringify(editTalent.education));
      if (editTalent.profileImage instanceof File) {
        formData.append("profileImage", editTalent.profileImage);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/talents/${editTalent._id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setTalents((prev) =>
        prev.map((t) => (t._id === editTalent._id ? data.talent : t))
      );
      setEditTalent(null);
      setExpandedCard(null);
      toast.success("Talent updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.message || "Failed to update talent", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-300">Name</label>
        <input
          name="name"
          type="text"
          value={editTalent.name}
          onChange={handleChange}
          className="w-full p-2 sm:p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-300">Email</label>
        <input
          name="email"
          type="email"
          value={editTalent.email}
          onChange={handleChange}
          className="w-full p-2 sm:p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-300">
          Skills (comma-separated)
        </label>
        <input
          name="skills"
          type="text"
          value={editTalent.skills}
          onChange={handleChange}
          className="w-full p-2 sm:p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-300">
          Portfolio URL
        </label>
        <input
          name="portfolio"
          type="url"
          value={editTalent.portfolio || ""}
          onChange={handleChange}
          className="w-full p-2 sm:p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-300">
          Profile Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 text-gray-300 text-sm sm:text-base"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <button
          type="submit"
          className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => setEditTalent(null)}
          className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditForm;