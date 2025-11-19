'use client'

import dynamic from 'next/dynamic'

const SignUpForm = dynamic(
  () => import('@/components/auth/signupForm'),
  { ssr: false }
)

export default function Page() {
  return <SignUpForm />
}