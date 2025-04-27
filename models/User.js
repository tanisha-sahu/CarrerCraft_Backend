"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
// User Schema for MongoDB
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profession: { type: String, required: true },
    portfolios: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Portfolio' }], // Reference to Portfolio model
}, {
    timestamps: true // Adding timestamps for 'createdAt' and 'updatedAt'
});
// Create the model
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
