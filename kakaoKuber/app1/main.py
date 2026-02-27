from fastapi import FastAPI, Request, Response, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import httpx 
from settings import settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title=settings.title, docs_url=None)

origins = [ settings.react_url ]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# 늘어나는건 사실상 이거 하나임
SERVICE_MAP = {
  settings.app1_path: settings.app1_url,  # 타겟주소
  # settings.app2_path: settings.app2_url,
}

# 원래는 gateway 구성을 제대로 해줘야 하지만, fastAPI는 수동으로 해줘야 함 (꾸역꾸역 만들기)
client = httpx.AsyncClient(timeout=10.0)

# 실제로 fastAPI는 이 기능을 하는게 없어서 억지로 만들어낸 기능
class ReverseProxyMiddleware(BaseHTTPMiddleware):
  async def dispatch(self, request: Request, call_next):
    path = request.url.path
    service_url = None

    for prefix, url in sorted(SERVICE_MAP.items(), key=lambda x: -len(x[0])):
      if path.startswith(prefix): # 위에 입력한 주소값과 안에 값을 비교해서 대상이 있는지 검사(확인)
        service_url = url
        path_suffix = path[len(prefix):] or "/"
        if not path_suffix.startswith("/"): # 맞으면 suffix에 주소를 넣어줌
          path_suffix = "/" + path_suffix
        break

    # 프록시 대상이 없으면 404
    if not service_url:
      return await call_next(request)

    # 어디 서비스로 갈 것 인지 (header와 body를 변수화 함)
    # 헤더 필터링
    excluded_headers = [
      "host", "connection", "keep-alive", "proxy-authenticate",
      "proxy-authorization", "te", "trailers", "transfer-encoding", "upgrade"
    ]
    headers = {k: v for k, v in request.headers.items() if k.lower() not in excluded_headers}

    # 요청 바디
    body = await request.body() if request.method in ("POST", "PUT", "PATCH") else None

    try:
      # proxy__resp : 응답 준 결과가 들어가 있음
      proxy_resp = await client.request(  # 정보를 가지고 비동기로 request 처리
        method=request.method,
        url=f"{service_url}{path_suffix}",
        headers=headers,
        content=body,
        params=request.query_params,
      )
      # 응답 준 결과를 꺼내와서 header에 줌
      # response_headers = {k: v for k, v in proxy_resp.headers.items() if k.lower() not in excluded_headers}
      # return Response(
      #   content=proxy_resp.content,
      #   status_code=proxy_resp.status_code,
      #   headers=response_headers  # 응답 준 결과를 그대로 안주면 인터셉트 됨
      # )
      response_headers = [(k.encode("latin-1"), v.encode("latin-1")) for k, v in proxy_resp.headers.multi_items() if k.lower() not in excluded_headers]
      response = Response(
        content=proxy_resp.content,
        status_code=proxy_resp.status_code,
      )
      response.raw_headers = response_headers
      return response
    except httpx.RequestError as exc:
      print(f"Proxy error: {exc}")
      raise HTTPException(status_code=502, detail="Bad Gateway")

# 미들웨어 등록 → 서로 다른 서비스끼리 공유할 수 있게 해줌
app.add_middleware(ReverseProxyMiddleware)
