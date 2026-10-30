# AG-media Digital CRM - Production Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build Vite React frontend
RUN npm run build

# Production Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm install --omit=dev

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Copy backend server code and database
COPY server ./server
COPY public ./public

# Expose server port
EXPOSE 5000

# Volume for persistent database storage
VOLUME ["/app/server/data"]

CMD ["npm", "start"]
