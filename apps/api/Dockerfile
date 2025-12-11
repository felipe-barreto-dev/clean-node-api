# Development Dockerfile for Docker Compose
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose ports
EXPOSE 5050 9222

# Run in debug mode for development
CMD ["npm", "run", "debug"]
