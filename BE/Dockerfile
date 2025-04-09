# ./Proj/BE/Dockerfile

FROM node:18-alpine
WORKDIR /app

# --- Installation ---
# Copy package files FROM THE CONTEXT (./BE)
COPY package.json package-lock.json* ./
# Install dependencies (ensure nodemon is in dependencies in package.json)
RUN npm ci

# --- Copy Artifacts Placeholder (Optional but good practice) ---
# Create the directory where artifacts will be mounted later
# This isn't strictly necessary with the volume mount, but doesn't hurt
RUN mkdir -p /app/Blockchain/artifacts  

# --- Copy Backend Source Code ---
# Copy everything from the context (./BE) to /app
# This happens AFTER npm ci

COPY . /app

# --- Runtime ---
EXPOSE 3001

# CMD should now find src/server.ts correctly within /app
CMD [ "npx", "nodemon", "/app/src/server.ts" ]


