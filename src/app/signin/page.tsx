'use client'

import dynamic from 'next/dynamic'

const SignInForm = dynamic(
  () => import('@/components/auth/signInForm'),
  { ssr: false }
)

export default function Page() {
  return <SignInForm />
}