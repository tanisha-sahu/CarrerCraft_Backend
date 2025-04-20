import express, {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from 'express';
import multer from 'multer';
import { extractTextFromPDF } from '../utils/extractText';
// import { GoogleGenerativeAI } from '@google/generative-ai';

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const fs = require("node:fs");
const mime = require("mime-types");


// 1) Define an interface that includes Multer's file property
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// 2) Define your handler using RequestHandler
const analyzeHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 3) Cast `req` to MulterRequest so TS knows about `file`
    const mReq = req as MulterRequest;

    if (!mReq.file || !mReq.file.buffer) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const resumeText = await extractTextFromPDF(mReq.file.buffer);


    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey)


    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-thinking-exp-01-21",
      systemInstruction: "ATS Score checking and Review providing.The response must be in JSON format containing: 'ats_score' (number between 0-100), 'improvement_points' (array of strings suggesting resume improvements), 'review' (a detailed ATS compatibility review), and 'file_validation' (if the file is not a valid resume PDF, set ats_score to 0 and return 'This is not the correct file.'). Do not generate PDF, write text only."
    });
    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 65536,
      responseModalities: [
      ],
      responseMimeType: "text/plain",
    };
    

    async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });

  const result = await chatSession.sendMessage(resumeText);

  console.log(result.response);
  res.json({ result: result});
  return;
}

run();




  } catch (error: any) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
    return;
  }
};

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 5) Attach your handler with multer middleware
router.post('/analyze', upload.single('resume'), analyzeHandler);

export default router;
