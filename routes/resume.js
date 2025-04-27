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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const extractText_1 = require("../utils/extractText");
// import { GoogleGenerativeAI } from '@google/generative-ai';
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, } = require("@google/generative-ai");
const fs = require("node:fs");
const mime = require("mime-types");
// 2) Define your handler using RequestHandler
const analyzeHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 3) Cast `req` to MulterRequest so TS knows about `file`
        const mReq = req;
        if (!mReq.file || !mReq.file.buffer) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const resumeText = yield (0, extractText_1.extractTextFromPDF)(mReq.file.buffer);
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-thinking-exp-01-21",
            systemInstruction: "ATS Score checking and Review providing.The response must be in JSON format containing: 'ats_score' (number between 0-100), 'improvement_points' (array of strings suggesting resume improvements), 'review' (a detailed ATS compatibility review), and 'file_validation' (if the file is not a valid resume PDF, set ats_score to 0 and return 'This is not the correct file.'). Do not generate PDF, write text only."
        });
        const generationConfig = {
            temperature: 0.7,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 65536,
            responseModalities: [],
            responseMimeType: "text/plain",
        };
        function run() {
            return __awaiter(this, void 0, void 0, function* () {
                const chatSession = model.startChat({
                    generationConfig,
                    history: [],
                });
                const result = yield chatSession.sendMessage(resumeText);
                console.log(result.response);
                res.json({ result: result });
                return;
            });
        }
        run();
    }
    catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
        return;
    }
});
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// 5) Attach your handler with multer middleware
router.post('/analyze', upload.single('resume'), analyzeHandler);
exports.default = router;
