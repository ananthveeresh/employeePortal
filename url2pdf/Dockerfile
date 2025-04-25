FROM node:18

# Install dependencies for Puppeteer and Headless Chrome
RUN apt-get update && \
    apt-get install -y chromium && \
    rm -rf /var/lib/apt/lists/*

# Set environment variable for Puppeteer to use Headless Chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY . app
WORKDIR /app
# Install dependencies
RUN npm ci

# Expose the application's port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]