# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app/frontend

# Copy the package.json and package-lock.json files for frontend
COPY package.json .

# Install frontend dependencies
RUN npm install

# Copy frontend application code
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev"]