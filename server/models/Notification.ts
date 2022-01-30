import mongoose from "mongoose";
const Schema = mongoose.Schema;
// TODO add ts
const NotificationSchema = new Schema(
  {
    userFrom: { type: Schema.Types.ObjectId, ref: "User" },
    notificationType: String,
    read: { type: Boolean, default: false },
    entityId: Schema.Types.ObjectId,
    // message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Notification= mongoose.model("Notification", NotificationSchema);