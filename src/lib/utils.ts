import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import slugify from 'slugify'
import readingTime from 'reading-time'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function generateSlug(input: string) {
  return slugify(input, { lower: true, strict: true })
}

export function createExcerpt(content: string, length = 180) {
  const text = content.replace(/<[^>]+>/g, '')
  if (text.length <= length) {
    return text
  }
  return `${text.slice(0, length).trim()}…`
}

export function calculateReadingTime(content: string) {
  const stats = readingTime(content)
  return Math.max(1, Math.round(stats.minutes))
}