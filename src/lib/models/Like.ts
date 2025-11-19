import { Schema, model, models, type Document, type Model } from 'mongoose'

export interface LikeDocument extends Document {
  user: Schema.Types.ObjectId
  post: Schema.Types.ObjectId
  createdAt: Date
}

const LikeSchema = new Schema<LikeDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
)

LikeSchema.index({ user: 1, post: 1 }, { unique: true })

export const LikeModel: Model<LikeDocument> = models.Like || model<LikeDocument>('Like', LikeSchema)

