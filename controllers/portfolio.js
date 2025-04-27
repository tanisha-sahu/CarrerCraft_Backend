"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePortfolio = exports.updatePortfolioById = exports.getUserPortfolios = exports.getPortfolioById = exports.createPortfolio = void 0;
const Portfolio_1 = require("../models/Portfolio");
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
// ─── DO NOT TOUCH: Create Portfolio ────────────────────────────────
const createPortfolio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionUser = req.session.user;
        if (!sessionUser) {
            res.status(401).json({ message: "Unauthorized Ho tum" });
            return;
        }
        const { template, personalInfo, skills, projects, education, experience, certifications, achievements, } = req.body;
        const portfolio = new Portfolio_1.PortfolioModel({
            userId: sessionUser.id,
            template,
            personalInfo,
            skills,
            projects,
            education,
            experience,
            certifications,
            achievements,
        });
        yield portfolio.save();
        yield User_1.UserModel.findByIdAndUpdate(sessionUser.id, { $push: { portfolios: portfolio._id } }, { new: true });
        res.status(201).json({ message: "Portfolio created", portfolio });
    }
    catch (err) {
        console.error("🔥 Error creating portfolio:", err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});
exports.createPortfolio = createPortfolio;
// ─── ✅ Fixed: Get Portfolio by User ID ─────────────────────────────
const getPortfolioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { portfolioId } = req.params;
        console.log("chala");
        if (!portfolioId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        console.log(portfolioId);
        const portfolio = yield Portfolio_1.PortfolioModel.findOne({ _id: portfolioId });
        // const portfolio = await PortfolioModel.find();
        console.log(portfolio);
        if (!portfolio) {
            res.status(404).json({ message: "Portfolio not found" });
            return;
        }
        res.status(200).json({ portfolio });
    }
    catch (error) {
        console.error("❌ Error fetching portfolio:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getPortfolioById = getPortfolioById;
const getUserPortfolios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Validate user existence
        const user = yield User_1.UserModel.findById(userId).populate('portfolios');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user.portfolios);
    }
    catch (error) {
        console.error('🔥 Error fetching user portfolios:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});
exports.getUserPortfolios = getUserPortfolios;
const updatePortfolioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { portfolioId } = req.params;
        const updatedData = req.body;
        if (!portfolioId) {
            res.status(400).json({ message: "Portfolio ID is required" });
            return;
        }
        const portfolio = yield Portfolio_1.PortfolioModel.findByIdAndUpdate(portfolioId, updatedData, { new: true } // Return the updated document
        );
        if (!portfolio) {
            res.status(404).json({ message: "Portfolio not found" });
            return;
        }
        res.status(200).json({ message: "Portfolio updated", portfolio });
    }
    catch (error) {
        console.error("❌ Error updating portfolio:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.updatePortfolioById = updatePortfolioById;
const deletePortfolio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const portfolioId = req.params.id;
        console.log("HEY");
        if (!mongoose_1.default.Types.ObjectId.isValid(portfolioId)) {
            res.status(400).json({ message: "Invalid Portfolio ID" });
            return;
        }
        // Find and delete the portfolio
        const deletedPortfolio = yield Portfolio_1.PortfolioModel.findByIdAndDelete(portfolioId);
        if (!deletedPortfolio) {
            res.status(404).json({ message: "Portfolio not found" });
            return;
        }
        // Also remove portfolio ID from the user's document
        yield User_1.UserModel.findByIdAndUpdate(deletedPortfolio === null || deletedPortfolio === void 0 ? void 0 : deletedPortfolio.userId, {
            $pull: { portfolios: deletedPortfolio === null || deletedPortfolio === void 0 ? void 0 : deletedPortfolio._id },
        });
        console.log("by");
        res.status(200).json({ message: "Portfolio deleted successfully" });
        return;
    }
    catch (error) {
        console.error("🔥 Error deleting portfolio:", error);
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.deletePortfolio = deletePortfolio;
