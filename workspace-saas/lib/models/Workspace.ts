import mongoose, { Schema, Document, Model, Types } from 'mongoose';

interface IMember {
  userId: Types.ObjectId;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: Date;
}

export interface IWorkspace extends Document {
  name: string;
  ownerId: Types.ObjectId;
  members: IMember[];
  settings: {
    isPublic: boolean;
    allowComments: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['owner', 'admin', 'editor', 'viewer'],
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    settings: {
      isPublic: {
        type: Boolean,
        default: false,
      },
      allowComments: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Workspace: Model<IWorkspace> =
  mongoose.models.Workspace || mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);

export default Workspace;
