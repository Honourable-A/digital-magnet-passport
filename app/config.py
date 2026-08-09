from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Digital Magnet Passport"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    database_url: str = "postgresql://postgres:password@localhost:5432/postgres"
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_jwks_url: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
