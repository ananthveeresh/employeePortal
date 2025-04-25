# Stage 1: Build environment with GCC

FROM python:3.8-slim

# Install GCC and other build essentials
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Install any Python packages you need
# For example, you can use pip to install additional packages



# Set up your application and working directory
WORKDIR /app
COPY app /app
# For example, you can use pip to install additional packages
RUN pip install --upgrade pip
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Define the command to run your application
CMD ["python", "main.py"]
