import { Schema, model, models, type Document, type Model } from 'mongoose'

export interface CommentDocument extends Document {
  content: string
  author: Schema.Types.ObjectId
  post: Schema.Types.ObjectId
  parent?: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<CommentDocument>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

CommentSchema.index({ post: 1, parent: 1, createdAt: -1 })

export const CommentModel: Model<CommentDocument> =
  models.Comment || model<CommentDocument>('Comment', CommentSchema)

