import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["admin", "talent", "user"],
      default: "user",
      required: true,
    },
    category: {
      type: String,
      trim: true,
      required: [function () { return this.role === "talent"; }, "Category is required for talents"],
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
        required: [function () { return this.role === "talent"; }, "At least one service is required for talents"],
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
      default: null,
    },
    projects: [
      {
        title: {
          type: String,
          required: [true, "Project title is required"],
          trim: true,
        },
        description: {
          type: String,
          required: [true, "Project description is required"],
          trim: true,
        },
        images: [
          {
            type: String,
          },
        ],
        projectLink: {
          type: String,
          trim: true,
        },
        technologies: [
          {
            type: String,
            trim: true,
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);