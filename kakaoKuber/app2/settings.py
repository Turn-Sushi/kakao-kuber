from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  title: str ="FastAPI App2"
  root_path: str
  client_id: str
  client_secret: str
  redirect_uri: str
  dns: str
  secure: bool
  redis_host: str
  redis_port: int
  redis_access_db: int
  redis_refresh_db: int
  react_url: str

  model_config = SettingsConfigDict(
    env_file=".env",
    env_file_encoding="utf-8",
  )

settings = Settings()
