import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUrl extends Document {
  userId: Types.ObjectId;
  originalUrl: string;
  shortUrl: string;
  visitCount: number;
  createdAt: Date;
  // expiresAt?: Date;
}

const UrlSchema = new Schema<IUrl>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    visitCount: { type: Number, default: 0 },
    // expiresAt: {
    //   type: Date,
    //   index: { expires: 0 },
    // },
  },
  { timestamps: true }
);

export const UrlModel = mongoose.model<IUrl>("Url", UrlSchema);
