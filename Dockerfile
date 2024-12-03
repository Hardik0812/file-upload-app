# Use an official Node.js runtime as the base image
FROM node:20.5.1-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN npm run build

# Expose the port for the Vite preview server
EXPOSE 5173

# Set environment variables required by Google Cloud Run
ENV NODE_ENV=production

# Use the Vite preview server, ensuring it binds to all network interfaces
CMD ["sh", "-c", "npm run preview -- --host"]