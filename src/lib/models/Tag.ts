import { Schema, model, models, type Document, type Model } from 'mongoose'

export interface TagDocument extends Document {
  name: string
  slug: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const TagSchema = new Schema<TagDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const TagModel: Model<TagDocument> = models.Tag || model<TagDocument>('Tag', TagSchema)

