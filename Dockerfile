# Use Node.js 16 as base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package files (assuming package.json exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app code
COPY . .

# Expose port (assuming 8080 for Express)
EXPOSE 8080

# Start the app (assuming an entry point like server.js or index.js)
CMD ["node", "server.js"]