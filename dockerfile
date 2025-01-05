# Use official Node.js image with Alpine (Node 20)
FROM node:20.12.0-alpine3.19

# Set the working directory in the container
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

# Install TypeScript globally if needed
RUN npm install -g typescript



# Generate Prisma client
RUN npx prisma generate



# Expose the port the app will run on
EXPOSE 3000

# Start the Node.js application
CMD ["npm", "start"]
