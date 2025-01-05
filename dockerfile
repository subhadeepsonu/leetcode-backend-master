# Use official Node.js image with Alpine (Node 20)
FROM node:20.12.0-alpine3.19

# Set the working directory in the container
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm install

# Copy prisma schema (needed for generation)
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npx tsc

# Clean up dev dependencies
RUN npm prune --production

# Expose the port the app will run on
EXPOSE 3000


# Start the Node.js application
CMD ["npm", "start"]