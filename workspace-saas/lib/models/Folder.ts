import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IFolder extends Document {
  workspaceId: Types.ObjectId;
  name: string;
  parentId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FolderSchema = new Schema<IFolder>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
    },
  },
  {
    timestamps: true,
  }
);

const Folder: Model<IFolder> =
  mongoose.models.Folder || mongoose.model<IFolder>('Folder', FolderSchema);

export default Folder;
