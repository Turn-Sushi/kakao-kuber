FROM uv:1

WORKDIR /workspace

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-dev

COPY main.py main.py
COPY settings.py settings.py
# COPY .env .env

CMD ["uv", "run", "fastapi", "run", "--host", "0.0.0.0", "--port", "8000"]