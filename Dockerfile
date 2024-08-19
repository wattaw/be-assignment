# Base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

RUN npx prisma migrate dev --name init

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start the application
# For accountManager service
CMD ["npx", "ts-node", "src/accountManager.ts"]