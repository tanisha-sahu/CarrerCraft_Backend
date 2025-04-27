"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioModel = void 0;
// models/Portfolio.ts
const mongoose_1 = require("mongoose");
const PortfolioSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    template: { type: String, enum: ["dark", "light", "modern"], required: true },
    personalInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        location: { type: String, required: true },
        bio: { type: String, required: true },
        profileImage: { type: String, required: true },
        resumeLink: { type: String, required: true },
        socialLinks: [
            {
                platform: { type: String, required: true },
                url: { type: String, required: true },
            },
        ],
    },
    skills: [
        {
            name: { type: String, required: true },
            level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
            category: { type: String, required: true },
        },
    ],
    projects: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            techStack: [{ type: String }],
            liveUrl: { type: String, required: true },
            githubUrl: { type: String, required: true },
            image: { type: String, required: true },
            featured: { type: Boolean, required: true },
        },
    ],
    education: [
        {
            institution: { type: String, required: true },
            degree: { type: String, required: true },
            fieldOfStudy: { type: String, required: true },
            startDate: { type: String, required: true },
            endDate: { type: String, required: true },
            grade: { type: String, required: true },
        },
    ],
    experience: [
        {
            title: { type: String, required: true },
            company: { type: String, required: true },
            location: { type: String, required: true },
            startDate: { type: String, required: true },
            endDate: { type: String, required: true },
            description: { type: String, required: true },
            type: {
                type: String,
                enum: ["Internship", "Full-Time", "Part-Time", "Freelance"],
                required: true,
            },
        },
    ],
    certifications: [
        {
            title: { type: String, required: true },
            issuer: { type: String, required: true },
            issueDate: { type: String, required: true },
            certificateUrl: { type: String, required: true },
        },
    ],
    achievements: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            date: { type: String, required: true },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: false,
});
exports.PortfolioModel = (0, mongoose_1.model)("Portfolio", PortfolioSchema);
