"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./src/database"));
const auth_1 = __importDefault(require("./routes/auth")); // Auth routes
const resume_1 = __importDefault(require("./routes/resume")); // Resume routes
const express_session_1 = __importDefault(require("express-session")); // Session management
const connect_mongo_1 = __importDefault(require("connect-mongo")); // ← added for Mongo-backed sessions
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const portfolio_1 = __importDefault(require("./routes/portfolio"));
(0, database_1.default)(); // Connect to the database
const app = (0, express_1.default)();
// Middleware setup
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Default route
app.get('/', (_req, res) => {
    res.send("TypeScript with Express");
});
// CORS setup
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND, // Frontend URL 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Session setup (using MongoStore instead of MemoryStore)
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "mysecretkey",
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
        ttl: 24 * 60 * 60,
    }),
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
// Routes
app.use("/api/auth", auth_1.default); // Authentication routes
app.use("/api/resume", resume_1.default); // Resume-related routes
app.use("/api/portfolio", portfolio_1.default);
// Start the server
const port = parseInt(process.env.PORT); // Use Railway's assigned port
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
