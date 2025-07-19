FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose the preview port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
