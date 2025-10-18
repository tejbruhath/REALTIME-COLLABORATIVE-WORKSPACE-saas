import mongoose, { Schema, Document as MongooseDocument, Model, Types } from 'mongoose';

export interface IDocument extends MongooseDocument {
  workspaceId: Types.ObjectId;
  title: string;
  content: object;
  liveblocksRoomId: string;
  createdBy: Types.ObjectId;
  lastEditedBy: Types.ObjectId;
  lastEditedAt: Date;
  isArchived: boolean;
  folderId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled Document',
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
      default: {},
    },
    liveblocksRoomId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastEditedAt: {
      type: Date,
      default: Date.now,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
    },
  },
  {
    timestamps: true,
  }
);

DocumentSchema.index({ workspaceId: 1, isArchived: 1 });
DocumentSchema.index({ liveblocksRoomId: 1 }, { unique: true });

const DocumentModel: Model<IDocument> =
  mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

export default DocumentModel;
