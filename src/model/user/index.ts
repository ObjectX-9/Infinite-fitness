import mongoose, { Schema } from "mongoose";
import { UserStatus, User } from "./type";


// 用户基本信息Schema
const userSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    nickname: { type: String },
    avatar: { type: String },
    email: { type: String },
    phone: { type: String },
    password: { type: String, required: true },
    gender: { 
      type: String,
      enum: ['male', 'female', 'other']
    },
    birthdate: { type: Date },
    status: { 
      type: String, 
      required: true,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    lastLoginAt: { type: Date }
  },
);


// 创建模型 - 防止热重载时重复定义模型
export const UserModel = mongoose.models.User || mongoose.model<User>('User', userSchema);