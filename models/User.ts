import { Schema, model, models } from "mongoose";

export interface UserDocument {
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  {
    timestamps: true
  }
);

export const User = models.User || model<UserDocument>("User", UserSchema);
