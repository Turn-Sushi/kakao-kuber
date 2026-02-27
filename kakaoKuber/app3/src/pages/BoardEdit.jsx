import { useNavigate, useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import { api } from "@utils/network";

const BoardEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { no } = useParams(); // URL에서 번호를 직접 가져오는 방식 권장 (예: /edit/1)
  
  // 초기값 필드명을 백엔드와 맞춤 (content -> cnt)
  const [board, setBoard] = useState({ 
      board_no: "", 
      title: "", 
      name: "", 
      cnt: "" 
  });

  const onsubmit = e => {
      e.preventDefault();
      
      // 백엔드 엔드포인트에 맞춰 수정 (PUT /board/{id})
      // withCredentials: true가 api 인스턴스에 설정되어 있어야 쿠키가 전송됩니다.
      api.put(`/board/${board.board_no}`, {
          title: board.title,
          cnt: board.cnt // 백엔드 필드명 cnt 사용
      })
      .then(res => {
          if (res.data.status) {
              alert("수정 완료");
              navigate(`/boardview/${board.board_no}`); // 수정한 글로 이동
          } else {
              alert("수정 실패: " + (res.data.msg || "권한이 없습니다."));
          }
      })
      .catch(err => {
          console.error(err);
          alert("서버 요청 중 오류가 발생했습니다.");
      });
  }

useEffect(() => {
    // 1. URL 파라미터나 location.state에서 번호 추출
    const boardNo = no
    if (!no) {
        alert("잘못된 접근입니다.");
        navigate(-1);
        return;
    }
      // 2. 게시글 상세 정보 불러오기
      api.get(`/board/${no}`)
          .then(res => {
              if (res.data.status) {
                  const data = res.data.data;
                  // 백엔드 데이터(cnt)를 상태(cnt)에 매핑
                  setBoard({
                      board_no: data.board_no,
                      title: data.title,
                      name: data.name,
                      cnt: data.cnt
                  });
              } else {
                  alert("게시글을 찾을 수 없습니다.");
                  navigate(-1);
              }
          })
          .catch(err => {
              console.error("데이터 로딩 실패:", err);
              navigate(-1);
          });
  }, [no, location.state, navigate]);
  return (
      <div className="container mt-3">
          <h1 className="display-1 text-center">게시글 수정</h1>
          <form onSubmit={onsubmit}>
              <div className="mb-3 mt-3">
                  <label htmlFor="title" className="form-label">제목</label>
                  <input 
                      type="text" 
                      className="form-control" 
                      id="title" 
                      value={board.title} 
                      onChange={e => setBoard({ ...board, title: e.target.value })} 
                      required 
                  />
              </div>
              <div className="mb-3 mt-3">
                  <label htmlFor="name" className="form-label">작성자</label>
                  <input 
                      type="text" 
                      className="form-control" 
                      id="name" 
                      value={board.name} 
                      disabled 
                  />
              </div>
              <div className="mb-3 mt-3">
                  <label htmlFor="content" className="form-label">내용</label>
                  <textarea 
                      className="form-control" 
                      rows="10" 
                      id="content"
                      value={board.cnt} 
                      onChange={e => setBoard({ ...board, cnt: e.target.value })} 
                      required
                  />
              </div>
              <div className="d-flex">
                  <div className="p-2 flex-fill d-grid">
                      <button type="submit" className="btn btn-primary">저장</button>
                  </div>
                  <div className="p-2 flex-fill d-grid">
                      <button type="button" onClick={() => navigate(-1)} className="btn btn-primary">취소</button>
                  </div>
              </div>
          </form>
      </div>
  );
}

export default BoardEdit;