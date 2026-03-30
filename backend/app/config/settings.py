"""
⚙️ Culinary Crafts - Application Settings
Configuration management using Pydantic Settings
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List, Optional
from functools import lru_cache
import os
from pathlib import Path

class Settings(BaseSettings):
    """Application settings with environment variable support."""

    model_config = SettingsConfigDict(
            env_file=".env",
            extra="ignore",
            case_sensitive=False
        )
    
    # =================================
    # 🔐 SECURITY CONFIGURATION
    # =================================
    JWT_SECRET: str = Field(default="your-super-secret-jwt-key-here", description="JWT Secret Key")
    JWT_ALGORITHM: str = Field(default="HS256", description="JWT Algorithm")
    JWT_EXPIRE_MINUTES: int = Field(default=30, description="JWT Expiration Time")
    
    # =================================
    # 🤖 AI SERVICES
    # =================================
    GOOGLE_CLOUD_PROJECT: str = Field(default="", description="Google Cloud Project ID")
    GOOGLE_APPLICATION_CREDENTIALS: str = Field(default="", description="Service Account Path")
    
    # Gemini Configuration
    GEMINI_API_KEY: str = Field(default="", description="Gemini API Key")
    GEMINI_MODEL: str = Field(default="gemini-1.5-pro-latest", description="Gemini Model")
    GEMINI_TEMPERATURE: float = Field(default=0.1, description="Gemini Temperature")
    
    # Vertex AI Search
    VERTEX_AI_LOCATION: str = Field(default="global", description="Vertex AI Location")
    VERTEX_AI_SEARCH_APP_ID: str = Field(default="", description="Search App ID")
    VERTEX_AI_SEARCH_ENGINE_ID: str = Field(default="", description="Search Engine ID")
    
    # =================================
    # 📱 LINE INTEGRATION  
    # =================================
    LINE_CHANNEL_ACCESS_TOKEN: str = Field(default="", description="LINE Channel Access Token")
    LINE_CHANNEL_SECRET: str = Field(default="", description="LINE Channel Secret")
    LINE_LIFF_APP_ID: str = Field(default="", description="LIFF App ID")
    
    # =================================
    # 🗄️ DATABASE CONFIGURATION
    # =================================
    FIRESTORE_PROJECT_ID: str = Field(default="", description="Firestore Project ID")
    FIRESTORE_DATABASE_ID: str = Field(default="culinary-crafts-db", description="Firestore Database ID")
    
    # Redis Configuration
    REDIS_URL: str = Field(default="redis://localhost:6379", description="Redis Connection URL")
    REDIS_TTL: int = Field(default=3600, description="Redis TTL in seconds")
    
    # =================================
    # 🌐 APPLICATION SETTINGS
    # =================================
    ENVIRONMENT: str = Field(default="development", description="Environment")
    DEBUG: bool = Field(default=True, description="Debug Mode")
    
    # API Configuration
    API_HOST: str = Field(default="localhost", description="API Host")
    API_PORT: int = Field(default=8000, description="API Port")
    API_VERSION: str = Field(default="v1", description="API Version")
    
    # CORS Settings
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "https://localhost:3000"], 
        description="Allowed CORS Origins"
    )
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = Field(default=60, description="Rate Limit per Minute")
    RATE_LIMIT_BURST: int = Field(default=10, description="Rate Limit Burst")
    
    # =================================
    # 📊 MONITORING & LOGGING
    # =================================
    LOG_LEVEL: str = Field(default="INFO", description="Logging Level")
    LOG_FORMAT: str = Field(default="json", description="Log Format")
    
    # Google Cloud Monitoring
    ENABLE_CLOUD_MONITORING: bool = Field(default=False, description="Enable Cloud Monitoring")
    ENABLE_CLOUD_LOGGING: bool = Field(default=False, description="Enable Cloud Logging")
    
    # =================================
    # 🔒 SECURITY HEADERS
    # =================================
    SECURITY_HEADERS_ENABLED: bool = Field(default=True, description="Enable Security Headers")
    ALLOWED_HOSTS: List[str] = Field(
        default=["localhost", "127.0.0.1"], 
        description="Allowed Hosts"
    )
    TRUSTED_PROXIES: List[str] = Field(
        default=["127.0.0.1"],
        description="Trusted Proxy IPs"
    )
    
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.ENVIRONMENT.lower() == "production"
    
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.ENVIRONMENT.lower() == "development"
    
    def get_database_url(self) -> str:
        """Get Firestore connection URL."""
        return f"firestore://{self.FIRESTORE_PROJECT_ID}/{self.FIRESTORE_DATABASE_ID}"
    
    def validate_configuration(self) -> bool:
        """Validate critical configuration settings."""
        critical_settings = []
        
        if self.is_production():
            if not self.JWT_SECRET or self.JWT_SECRET == "your-super-secret-jwt-key-here":
                critical_settings.append("JWT_SECRET must be set in production")
            
            if not self.GOOGLE_CLOUD_PROJECT:
                critical_settings.append("GOOGLE_CLOUD_PROJECT is required")
            
            if not self.GEMINI_API_KEY:
                critical_settings.append("GEMINI_API_KEY is required")
        
        if critical_settings:
            raise ValueError(f"Configuration validation failed: {', '.join(critical_settings)}")
        
        return True

@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings."""
    settings = Settings()
    
    # Validate configuration in production
    if settings.is_production():
        settings.validate_configuration()
    
    return settings

# Export settings instance
settings = get_settings()