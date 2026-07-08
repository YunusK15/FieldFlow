# Use python base image for ML compatibility and dependencies
FROM python:3.10-slim

# Install system dependencies, curl, and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Copy python dependencies and build virtual environment (so predict.py runs inside venv as expected)
COPY requirements.txt .
RUN python -m venv venv
RUN ./venv/bin/pip install --upgrade pip
RUN ./venv/bin/pip install --no-cache-dir -r requirements.txt

# Copy backend package and install Node dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci

# Copy the rest of the application files
COPY . .

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose backend port
EXPOSE 5000

# Run the app from root
CMD ["node", "backend/index.js"]
