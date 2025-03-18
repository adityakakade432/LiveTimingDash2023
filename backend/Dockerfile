# Use a lightweight Python base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only the contents of the backend folder into the container's working directory
COPY ./ ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set the Python path
ENV PYTHONPATH=/app

# Expose the port the app will run on
EXPOSE 8000

# Create a non-root user and switch to it
RUN useradd -m myuser
RUN chown -R myuser:myuser /app
USER myuser

# Command to run the application with uvicorn
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
