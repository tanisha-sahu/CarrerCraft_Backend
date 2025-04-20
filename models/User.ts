import { Schema, model, Document, Types } from 'mongoose';

// Interface for the User data
export interface IUser {
  name: string;
  email: string;
  password: string;
  profession: string;
  portfolios: Types.ObjectId[]; // Array of Portfolio IDs
}

// The IUserDocument extends both the IUser interface and Mongoose's Document
export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId; // Ensuring the _id is of the correct type
}

// User Schema for MongoDB
const UserSchema = new Schema<IUserDocument>({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  profession: { type: String, required: true },
  portfolios: [{ type: Schema.Types.ObjectId, ref: 'Portfolio' }], // Reference to Portfolio model
}, {
  timestamps: true // Adding timestamps for 'createdAt' and 'updatedAt'
});

// Create the model
export const UserModel = model<IUserDocument>('User', UserSchema);
