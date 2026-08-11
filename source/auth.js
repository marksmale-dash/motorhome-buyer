export const normalizeEmail = (value) => value.trim().toLowerCase()

export const normalizeOtp = (value) => value.replace(/\D/g, '').slice(0, 6)

export const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(normalizeEmail(value))

export const isValidOtp = (value) => /^\d{6}$/.test(normalizeOtp(value))

export const verifyEmailOtp = (supabase, email, token) =>
  supabase.auth.verifyOtp({
    email: normalizeEmail(email),
    token: normalizeOtp(token),
    type: 'email',
  })
