FROM node:18

COPY . app
WORKDIR /app
# Install dependencies
RUN npm ci

# Expose the application's port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]