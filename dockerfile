# Use official Node.js image with Alpine (Node 20)
FROM node:20.12.0-alpine3.19

# Set the working directory in the container
WORKDIR /app

# Copy package files first for better caching
COPY . .

# Install ALL dependencies (including devDependencies needed for build)
RUN npm install


# Generate Prisma client
RUN npx prisma generate

RUN npm install -g typescript
 
RUN pwd
# Copy the rest of the application code


# Build TypeScript code
RUN npx tsc



# Expose the port the app will run on
EXPOSE 3000


# Start the Node.js application
CMD ["npm", "start"]