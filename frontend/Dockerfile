# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (if you use it) to install dependencies
COPY package.json ./
# If you have package-lock.json or yarn.lock, copy that too:
# COPY package-lock.json ./

RUN npm install --legacy-peer-deps

# Copy the rest of your React app
COPY . ./

# Build the React application for production
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:stable-alpine

# Copy the built React app from the build stage to Nginx's default public directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration (optional, but recommended for single-page apps)
# This prevents issues with direct URL access (e.g., refresh on a sub-route)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]