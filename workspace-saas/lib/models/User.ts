import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  color: string;
  subscription: {
    plan: 'free' | 'pro' | 'team' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    color: {
      type: String,
      default: () => {
        const colors = ['#3B82F6', '#0EA5E9', '#06B6D4', '#14B8A6', '#10B981'];
        return colors[Math.floor(Math.random() * colors.length)];
      },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'pro', 'team', 'enterprise'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
      },
      expiresAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
