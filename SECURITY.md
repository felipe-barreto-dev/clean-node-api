# Security Guidelines

## Environment Variables

### Required Variables in Production

The following environment variables **MUST** be set in production:

- `JWT_SECRET`: Secret key for signing JWT tokens

### Setting Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Generate a secure JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Update the `.env` file with the generated secret:
   ```
   JWT_SECRET=<your-generated-secret-here>
   ```

### Production Deployment

**IMPORTANT:** The application will throw an error and refuse to start in production mode if `JWT_SECRET` is not set.

Never commit the `.env` file or expose secrets in:
- Git repositories
- Docker images
- Logs
- Error messages
- Environment variable dumps

### Recommended Practices

1. **Use different secrets for different environments** (dev, staging, production)
2. **Rotate secrets periodically** (e.g., every 90 days)
3. **Use a secret management service** in production (e.g., AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)
4. **Never share secrets** via email, chat, or other insecure channels
5. **Use strong, randomly generated secrets** (minimum 256 bits / 32 bytes)

## Security Features

### Authentication
- Passwords are hashed using bcrypt with salt rounds
- JWT tokens are used for stateless authentication
- Token expiration should be configured appropriately

### Authorization
- Role-based access control (RBAC) is implemented
- Admin role has elevated privileges
- Regular users have restricted access

### Data Validation
- Input validation is performed on all endpoints
- Email format validation
- Password confirmation validation

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainer directly instead of opening a public issue.

**Contact:** fbarreto.dev@gmail.com

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work on a fix as soon as possible.
