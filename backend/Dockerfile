FROM node:18-alpine

WORKDIR /app

# Install build dependencies for sqlite3
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Copy public images to production
COPY public ./public

# Rebuild sqlite3 for the target architecture
RUN npm rebuild sqlite3

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]
