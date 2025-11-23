import { Schema, model, models, type Model, type Document } from 'mongoose'

export interface UserDocument extends Document {
  name: string
  email: string
  password?: string
  username?: string
  bio?: string
  avatar?: string
  headline?: string
  website?: string
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
  followers: Schema.Types.ObjectId[]
  following: Schema.Types.ObjectId[]
  lastLogin?: Date
  loginCount: number
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
      select: false,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    avatar: {
      type: String,
    },
    headline: {
      type: String,
    },
    website: {
      type: String,
    },
    social: {
      twitter: String,
      github: String,
      linkedin: String,
    },

    // ⭐⭐ ADD THESE TWO ⭐⭐
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],

    lastLogin: {
      type: Date,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password
        return ret
      },
    },
  }
)

export const UserModel: Model<UserDocument> =
  models.User || model<UserDocument>('User', UserSchema)
