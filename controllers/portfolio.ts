import { Request, Response, RequestHandler } from "express";
import { PortfolioModel } from "../models/Portfolio";
import { UserModel } from '../models/User'; 
import mongoose from "mongoose";

// ─── DO NOT TOUCH: Create Portfolio ────────────────────────────────
export const createPortfolio: RequestHandler = async (req, res, next) => {
  try {
    const sessionUser = req.session.user;
    if (!sessionUser) {
      res.status(401).json({ message: "Unauthorized Ho tum" });
      return;
    }

    const {
      template,
      personalInfo,
      skills,
      projects,
      education,
      experience,
      certifications,
      achievements,
    } = req.body;

    const portfolio = new PortfolioModel({
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

    await portfolio.save();

    await UserModel.findByIdAndUpdate(
      sessionUser.id,
      { $push: { portfolios: portfolio._id } },
      { new: true }
    );

    res.status(201).json({ message: "Portfolio created", portfolio });
  } catch (err) {
    console.error("🔥 Error creating portfolio:", err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

// ─── ✅ Fixed: Get Portfolio by User ID ─────────────────────────────
export const getPortfolioById: RequestHandler = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    console.log("chala");
    if (!portfolioId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    console.log(portfolioId)
    const portfolio = await PortfolioModel.findOne({_id:portfolioId});
    // const portfolio = await PortfolioModel.find();
    console.log(portfolio);
    if (!portfolio) {
      res.status(404).json({ message: "Portfolio not found" });
      return;
    }

    res.status(200).json({ portfolio });
  } catch (error) {
    console.error("❌ Error fetching portfolio:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const getUserPortfolios: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user existence
    const user = await UserModel.findById(userId).populate('portfolios');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user.portfolios);
  } catch (error) {
    console.error('🔥 Error fetching user portfolios:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

export const updatePortfolioById: RequestHandler = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const updatedData = req.body;

    if (!portfolioId) {
      res.status(400).json({ message: "Portfolio ID is required" });
      return;
    }
    const portfolio = await PortfolioModel.findByIdAndUpdate(
      portfolioId,
      updatedData,
      { new: true } // Return the updated document
    );

    if (!portfolio) {
      res.status(404).json({ message: "Portfolio not found" });
      return;
    }

    res.status(200).json({ message: "Portfolio updated", portfolio });
  } catch (error) {
    console.error("❌ Error updating portfolio:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deletePortfolio: RequestHandler = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    console.log("HEY");
    if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
      res.status(400).json({ message: "Invalid Portfolio ID" });
      return;
    }

    // Find and delete the portfolio
    const deletedPortfolio = await PortfolioModel.findByIdAndDelete(portfolioId);

    if (!deletedPortfolio) {
      res.status(404).json({ message: "Portfolio not found" });
      return;
    }

    // Also remove portfolio ID from the user's document
    await UserModel.findByIdAndUpdate(deletedPortfolio?.userId, {
      $pull: { portfolios: deletedPortfolio?._id },
    });
    console.log("by");

    res.status(200).json({ message: "Portfolio deleted successfully" });
    return;
  } catch (error) {
    console.error("🔥 Error deleting portfolio:", error);
    res.status(500).json({ message: "Server error", error });
    return
  }
};