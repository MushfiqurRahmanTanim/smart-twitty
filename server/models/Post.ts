import mongoose, { Document } from "mongoose";
// import User from "./User";
// import Tag from "./Tag";
import { IPost } from "../libs/types";

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      // User ? not "User"
      ref: "User",
    },
    // change this to text
    content: {
      type: String,
      required: true,
    },
    attachmentURL: {
      type: String,
    },
    cloudinaryImageId: {
      type: String,
    },
   
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
       
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// create virtual fields on comment count, like count etc
type PostDocument = IPost & Document;

export const Post =mongoose.model<PostDocument>("Post", PostSchema);


