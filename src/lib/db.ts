import mongoose from 'mongoose'

const { MONGODB_URI } = process.env

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: MongooseCache | undefined
}

const globalCache = global.mongooseConnection ?? {
  conn: null,
  promise: null,
}

export async function connectToDatabase() {
  if (globalCache.conn) {
    return globalCache.conn
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI!, {
      dbName: process.env.MONGODB_DB || 'medium_platform',
    })
  }

  globalCache.conn = await globalCache.promise
  global.mongooseConnection = globalCache

  return globalCache.conn
}

export type WithId<T> = T & { _id: mongoose.Types.ObjectId }

