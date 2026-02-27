from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  title: str ="FastAPI MSA Gateway"
  app1_path: str
  # app2_path: str
  app1_url: str
  # app2_url: str
  react_url: str

  model_config = SettingsConfigDict(
    env_file=".env",
    env_file_encoding="utf-8",
  )

settings = Settings()
