# Stage 1: Builder
FROM node:18-alpine AS builder

# Install basic tools for Prisma
RUN apk add --no-cache bash curl git python3 make g++

WORKDIR /app

# Copy package files and prisma schema first for caching
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies including devDependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Install runtime dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built app, prisma folder, and Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Create necessary directories
RUN mkdir -p uploads/audio logs

EXPOSE 3001

# Start the backend
CMD ["node", "dist/app.js"]
