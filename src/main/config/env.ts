const requiredEnvVars = ['JWT_SECRET']

if (process.env.NODE_ENV === 'production') {
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar])
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}

export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-please-change-in-production'
}
