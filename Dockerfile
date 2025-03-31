# Use Node.js 16 as base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all app code (including public/)
COPY . .

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start the Express server
CMD ["npm", "start"]

# Optional: Environment variable for Cloud Run port
ENV PORT=8080