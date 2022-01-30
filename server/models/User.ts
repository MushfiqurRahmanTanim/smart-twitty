import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

import { IUser } from '../libs/types';

let randomString = (Math.random() + 1).toString(36).substring(4);

type UserDocument = IUser & Document;

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    profilePicture: {
      type: String,
      default: `https://avatars.dicebear.com/api/avataaars/${randomString}.svg`,
      // "https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg",
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
    // people follow this user
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  },
  {
    id: false,
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.virtual('noOfFollowers').get(function (this: UserDocument) {
  return this.followers?.length;
});
UserSchema.virtual('noOfFollowing').get(function (this: UserDocument) {
  return this.following?.length;
});
UserSchema.virtual('noOPosts').get(function (this: UserDocument) {
  return this.posts?.length;
});
UserSchema.virtual('noOfNotifications').get(function (this: UserDocument) {
  return this.notifications?.length;
});

UserSchema.methods.comparePassword = async function (password: string) {

  const user = this as UserDocument;
  return await bcrypt.compare(password, user.password);
  
};

UserSchema.pre<UserDocument>('save', async function (next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);

  return next();
});

export const User = mongoose.model<UserDocument>('User', UserSchema);
// cascading
