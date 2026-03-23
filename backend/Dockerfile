# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src

# Expose port
EXPOSE 5000

# Start command
CMD ["node", "src/index.js"]
