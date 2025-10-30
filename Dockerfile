# Use official Node.js 18 Alpine image for smaller size
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install dependencies (production only for final stage)
FROM base AS dependencies
# Skip prepare scripts (like husky) during install
RUN npm ci --omit=dev --ignore-scripts

# Development dependencies for build stage
FROM base AS dev-dependencies
RUN npm ci

# Production build stage
FROM base AS production

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 5000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "src/index.js"]

# Development stage
FROM base AS development

# Install dev dependencies
COPY --from=dev-dependencies /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Expose the application port
EXPOSE 5000

# Use dumb-init and nodemon for hot reload
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "dev"]
