import dotenv from 'dotenv'; 
dotenv.config();
import express from 'express';
import connectDB from './src/database'; 
import authRoutes from './routes/auth'; // Auth routes
import resumeRoute from './routes/resume'; // Resume routes
import session from 'express-session'; // Session management
import MongoStore from 'connect-mongo'; // ← added for Mongo-backed sessions
import cookieParser from 'cookie-parser'; 
import cors from 'cors';
import portfolioRoute from "./routes/portfolio";

connectDB(); // Connect to the database

const app: express.Application = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Default route
app.get('/', (_req, res) => {
  res.send("TypeScript with Express");
});

// CORS setup
app.use(cors({
  origin: process.env.FRONTEND, // Frontend URL 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Session setup (using MongoStore instead of MemoryStore)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecretkey",
    resave: false,
    saveUninitialized: false, 
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI!,    
      collectionName: "sessions",         
      ttl: 24 * 60 * 60,               
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,                               
      maxAge: 24 * 60 * 60 * 1000,       
    },
  })
);

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/resume", resumeRoute); // Resume-related routes
app.use("/api/portfolio", portfolioRoute);


// Start the server
const port: number = parseInt(process.env.PORT!); // Use Railway's assigned port
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
