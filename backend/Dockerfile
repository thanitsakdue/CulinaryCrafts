# =================================
# 🐍 Python FastAPI Backend
# =================================
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
# Added g++ and libstdc++6 which are often required by FAISS and PyMuPDF
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip to ensure the latest wheel support
RUN pip install --no-cache-dir --upgrade pip

# Copy requirements first
COPY requirements.txt .

# Install Python dependencies
# If FAISS still fails, we install it with a longer timeout
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check (Note: Added curl to apt-get above so this works)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]