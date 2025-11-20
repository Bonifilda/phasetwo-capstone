import { Schema, model, models, type Document, type Model } from 'mongoose'

export interface PostDocument extends Document {
  title: string
  content: string
  excerpt?: string
  slug: string
  coverImage?: string
  published: boolean
  tags: string[]
  author: Schema.Types.ObjectId
  readingTime: number
  likesCount: number
  commentsCount: number
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<PostDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    coverImage: String,
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// Create indexes safely
PostSchema.index({ published: 1 })
PostSchema.index({ author: 1 })
PostSchema.index({ tags: 1 })

export const PostModel: Model<PostDocument> = models.Post || model<PostDocument>('Post', PostSchema)

