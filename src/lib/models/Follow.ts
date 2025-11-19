import { Schema, model, models, type Document, type Model } from 'mongoose'

export interface FollowDocument extends Document {
  follower: Schema.Types.ObjectId
  following: Schema.Types.ObjectId
  createdAt: Date
}

const FollowSchema = new Schema<FollowDocument>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
)

FollowSchema.index({ follower: 1, following: 1 }, { unique: true })

export const FollowModel: Model<FollowDocument> =
  models.Follow || model<FollowDocument>('Follow', FollowSchema)

