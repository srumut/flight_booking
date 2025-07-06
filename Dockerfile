FROM node:lts-alpine3.21 AS deps
WORKDIR /app

# Copy only the files needed to install dependencies
COPY package*.json .

RUN npm ci;

FROM node:lts-alpine3.21 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the files
COPY . .

RUN chmod +x wait-for-it.sh && npx prisma generate && npm run build

ENV NODE_ENV=production

# Re-run install only for production dependencies
RUN npm ci --only=production && npm cache clean --force

FROM node:lts-alpine3.21 AS runner
WORKDIR /app

RUN apk add --no-cache bash

# Copy the bundled code from the builder stage
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/generated ./generated
COPY --from=builder --chown=node:node /app/wait-for-it.sh ./wait-for-it.sh

# Use the node user from the image
USER node

# Start the server
CMD ["node", "dist/main.js"]
