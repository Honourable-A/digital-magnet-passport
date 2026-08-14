from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Digital Magnet Passport"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    # -- supabase (new) --
    database_url: str = "postgresql://postgres:password@localhost:5432/postgres"
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_jwks_url: str = ""

    # -- local jwt fallback (used when supabase_jwks_url is empty) --
    jwt_secret: str = "changeme"
    jwt_algorithm: str = "HS256"

    # -- mysql / local jwt (kept, not deleted) --
    # database_url: str = "mysql+pymysql://user:password@localhost:3306/digital_magnet"
    # jwt_secret: str = "mxhyzkjmpqsimxzzbfeumrhksqsctxgh"
    # jwt_algorithm: str = "HS256"
    # jwt_expiry_minutes: int = 60

    # -- neo4j (kept, deferred) --
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "password"

    class Config:
        env_file = ".env"

settings = Settings()
