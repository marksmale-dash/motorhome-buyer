export const normalizeEmail = (value) => value.trim().toLowerCase()

export const EMAIL_OTP_MIN_LENGTH = 6
export const EMAIL_OTP_MAX_LENGTH = 10

export const normalizeOtp = (value) =>
  value.replace(/\D/g, '').slice(0, EMAIL_OTP_MAX_LENGTH)

export const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(normalizeEmail(value))

export const isValidOtp = (value) => {
  const token = value.replace(/\D/g, '')
  return token.length >= EMAIL_OTP_MIN_LENGTH && token.length <= EMAIL_OTP_MAX_LENGTH
}

export const verifyEmailOtp = (supabase, email, token) =>
  supabase.auth.verifyOtp({
    email: normalizeEmail(email),
    token: normalizeOtp(token),
    type: 'email',
  })
