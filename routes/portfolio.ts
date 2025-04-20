// src/routes/portfolio.ts
import { Router } from "express";
import { createPortfolio, deletePortfolio, getPortfolioById, getUserPortfolios, updatePortfolioById } from "../controllers/portfolio";

const router = Router();

// No casting needed — createPortfolio is already a RequestHandler
router.post("/create", createPortfolio);

router.get("/view/:portfolioId", getPortfolioById);

router.get('/list/:userId', getUserPortfolios);

router.put('/edit/:portfolioId', updatePortfolioById);

router.delete('/delete/:id', deletePortfolio);

export default router;
