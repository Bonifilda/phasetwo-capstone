import type { FilterQuery } from 'mongoose'
import { PostModel, type PostDocument } from '@/lib/models/Post'
import { connectToDatabase } from '@/lib/db'
import { generateSlug, createExcerpt, calculateReadingTime } from '@/lib/utils'
import type { TagDocument } from '@/lib/models/Tag'
import { TagModel } from '@/lib/models/Tag'

export interface PostFilters {
  authorId?: string
  tag?: string
  search?: string
  published?: boolean
}

export interface PostInput {
  title: string
  content: string
  excerpt?: string
  tags?: string[]
  coverImage?: string
  published?: boolean
}

export async function ensureTagsExist(tags: string[] = []) {
  if (!tags.length) return []

  await Promise.all(
    tags.map(async (tag) => {
      const slug = generateSlug(tag)
      await TagModel.updateOne(
        { slug },
        { name: tag, slug },
        {
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )
    })
  )

  return (
    await TagModel.find({
      slug: { $in: tags.map((tag) => generateSlug(tag)) },
    })
  ).map((tag: TagDocument) => tag.slug)
}

export async function listPosts(filters: PostFilters, page = 1, limit = 10) {
  await connectToDatabase()
  const query: FilterQuery<PostDocument> = {}

  if (filters.authorId) {
    query.author = filters.authorId
  }

  if (filters.published !== undefined) {
    query.published = filters.published
  }

  if (filters.tag) {
    query.tags = filters.tag.toLowerCase()
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { content: { $regex: filters.search, $options: 'i' } }
    ]
  }

  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    PostModel.find(query)
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    PostModel.countDocuments(query),
  ])

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + data.length < total,
    },
  }
}

export async function getPost(identifier: string) {
  await connectToDatabase()
  
  if (!identifier) {
    return null
  }
  
  const query = identifier.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: identifier }
    : { slug: identifier.toLowerCase() }

  return PostModel.findOne(query).populate('author', 'name username avatar bio').lean()
}

// Helper function to clean and validate tags
function cleanTags(tags: string[] = []): string[] {
  return tags
    .map(tag => 
      tag
        .toString()
        .toLowerCase()
        .trim()
        // Remove special characters and limit length
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 30) // Limit tag length to 30 characters
    )
    .filter(Boolean) // Remove empty strings
    .filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates
}

export async function createPost(input: PostInput, authorId: string) {
  await connectToDatabase()

  const slugBase = generateSlug(input.title)
  let slug = slugBase
  let counter = 1
  
  while (await PostModel.exists({ slug })) {
    slug = `${slugBase}-${counter}`
    counter += 1
  }

  // Simplified tag handling - just use the tags as strings
  const tags = input.tags ? cleanTags(input.tags) : []

  const postData = {
    title: input.title,
    content: input.content,
    slug,
    author: authorId,
    tags,
    published: Boolean(input.published),
    coverImage: input.coverImage,
    excerpt: input.excerpt ?? createExcerpt(input.content),
    readingTime: calculateReadingTime(input.content),
  }

  const post = await PostModel.create(postData)

  return post.populate('author', 'name username avatar')
}

export async function updatePost(id: string, data: Partial<PostInput>, authorId: string) {
  await connectToDatabase()

  const updatePayload: Partial<PostDocument> = { ...data }

  if (data.title) {
    updatePayload.slug = generateSlug(data.title)
  }

  if (data.content) {
    updatePayload.excerpt = createExcerpt(data.content)
    updatePayload.readingTime = calculateReadingTime(data.content)
  }

  if (data.tags) {
    updatePayload.tags = await ensureTagsExist(data.tags)
  }

  const post = await PostModel.findOneAndUpdate(
    { _id: id, author: authorId },
    updatePayload,
    { new: true }
  ).populate('author', 'name username avatar')

  return post
}

export async function deletePost(id: string, authorId: string) {
  await connectToDatabase()
  await PostModel.findOneAndDelete({ _id: id, author: authorId })
}

export async function togglePublishPost(id: string, authorId: string, published: boolean) {
  await connectToDatabase()

  return PostModel.findOneAndUpdate(
    { _id: id, author: authorId },
    { published },
    { new: true }
  ).populate('author', 'name username avatar')
}

export async function getFeed(
  type: 'latest' | 'recommended' | 'following',
  userId?: string,
  page = 1,
  limit = 10
) {
  await connectToDatabase()
  const query: FilterQuery<PostDocument> = { published: true }

  if (type === 'following' && userId) {
    const { FollowModel } = await import('@/lib/models/Follow')
    const followingIds = await FollowModel.find({ follower: userId }).distinct('following')
    query.author = { $in: followingIds }
  }

  const sort =
    type === 'recommended'
      ? { likesCount: -1 as const, commentsCount: -1 as const }
      : { createdAt: -1 as const }

  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    PostModel.find(query)
      .populate('author', 'name username avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    PostModel.countDocuments(query),
  ])

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + data.length < total,
    },
  }
}

