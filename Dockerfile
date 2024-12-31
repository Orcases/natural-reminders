FROM node:20-alpine

WORKDIR /app

# Install basic build tools
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

# Build the extension
RUN npm run build

# Expose ports for Vite dev server and API
EXPOSE 5173 3000

# Command to run development server
CMD ["npm", "run", "dev", "--", "--host"]
