import mongoose from "mongoose";

const talentApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Programming & Tech",
        "Graphics & Design",
        "Digital Marketing",
        "Video & Animation",
        "AI Services",
        "Business",
        "Writing & Translation",
        "Consulting",
      ],
    },
    services: [
      {
        type: String,
        trim: true,
        required: [true, "At least one service is required"],
      },
    ],
    portfolio: {
      type: String,
      trim: true,
    },
    experience: [
      {
        company: String,
        role: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    profileImage: {
      type: String,
      default: null, // Store Cloudinary URL
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const TalentApplication = mongoose.model('TalentApplication', talentApplicationSchema);