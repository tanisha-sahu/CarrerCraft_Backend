"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/portfolio.ts
const express_1 = require("express");
const portfolio_1 = require("../controllers/portfolio");
const router = (0, express_1.Router)();
// No casting needed — createPortfolio is already a RequestHandler
router.post("/create", portfolio_1.createPortfolio);
router.get("/view/:portfolioId", portfolio_1.getPortfolioById);
router.get('/list/:userId', portfolio_1.getUserPortfolios);
router.put('/edit/:portfolioId', portfolio_1.updatePortfolioById);
router.delete('/delete/:id', portfolio_1.deletePortfolio);
exports.default = router;
