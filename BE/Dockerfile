# Dockerfile

# ---- Base Stage ----
# Use a Node version that supports your TypeScript target (e.g., ES2020 needs Node 14+)
FROM node:18-slim AS base
WORKDIR /usr/src/app
# Install OS-level dependencies if needed (e.g., for certain npm packages)
# RUN apt-get update && apt-get install -y --no-install-recommends some-package && rm -rf /var/lib/apt/lists/*

# ---- Dependencies Stage ----
FROM base AS dependencies
# Copy only package files
COPY package*.json ./
# Install ALL dependencies (including devDependencies needed for build)
RUN npm install

# ---- Build Stage ----
FROM dependencies AS build
# Copy all source code (including tsconfig.json)
COPY . .
# Compile TypeScript to JavaScript
RUN npm run build
# Remove devDependencies after build
RUN npm prune --production

# ---- Production Stage ----
FROM base AS production
# Set NODE_ENV to production
ENV NODE_ENV=production
# Copy only necessary files from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json
# Copy .env handling might be needed if not solely relying on Docker env vars
# COPY --from=build /usr/src/app/.env.production ./.env

# Expose the port the app runs on (read from env var or default)
EXPOSE ${PORT:-3000}

# Command to run the application
CMD [ "node", "dist/server.js" ]
