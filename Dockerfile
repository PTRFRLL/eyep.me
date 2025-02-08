# Use Alpine Linux as base image
FROM node:18-alpine

# Install dig (bind-tools package in Alpine)
RUN apk add --no-cache bind-tools

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]