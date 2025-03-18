# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the application source code (this will be overridden by a volume in docker-compose)
COPY . .

# Expose port 3000 for the React dev server
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
