// Authentication related types

export interface AuthUser {
  id: string
  email: string
  name?: string
  username?: string
  avatar?: string
}

export interface SignUpCredentials {
  email: string
  password: string
  name: string
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser | null
  error: AuthError | null
}

export interface AuthError {
  message: string
  code?: string
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
  refreshToken?: string
  expiresAt: number
}

export interface ResetPasswordRequest {
  email: string
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (credentials: SignInCredentials) => Promise<AuthResponse>
  signUp: (credentials: SignUpCredentials) => Promise<AuthResponse>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<AuthUser>) => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}
