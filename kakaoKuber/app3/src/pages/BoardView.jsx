import TextareaAutosize from 'react-textarea-autosize';
import { useParams, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { api } from "@utils/network"
const Board_view = () => {
  const navigate = useNavigate()
  const { no } = useParams()
  // const loginUser = JSON.parse(localStorage.getItem("user"))

  const [board, setBoard] = useState({
    title: "",
    name: "",
    cnt: "",
    regDate: "",
    board_no: null,
    user_no: null
  })

  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const [userId, setUserId] = useState(null); // 추가: 내 유저 번호 저장용

  // URL을 변경하기 위한 선언  
  const API_URL = import.meta.env.VITE_APP_FASTAPI_URL

  const onsubmit = e => e.preventDefault()

  const loadBoard = () => {
    api.get(`/board/${no}`)
      .then(res => {
        if (res.data.status) setBoard(res.data.data)
      })
      .catch(err => {
        console.error(err)
        alert("게시글을 불러오는데 실패했습니다.")
      })
  }

  const loadComments = () => {
    api.get(`/comment?board_no=${no}`)
      .then(res => {
        if (res.data.status) {
          setComments(res.data.data)
          // console.log("댓글 목록 :", res.data.data);
        }
      })
      .catch(err => {
        console.error("댓글 로드 실패:", err)
      })
  }

  const UserClick = () => {
  // 1. 로그인 여부 확인
  if (!userId) {
    alert("로그인이 필요합니다.")
    return
  }
  // 2. 작성자 일치 여부 확인 (userId와 board.user_no 비교)
  if (String(userId) !== String(board.user_no)) {
    alert("본인이 작성한 글만 수정할 수 있습니다.")
    return
  }
  // 3. 일치하면 수정 페이지로 이동
  navigate(`/boardedit/${board.board_no}`)
}

useEffect(() => {
  if (!no) {
    alert("잘못된 접근입니다")
    navigate("/")
    return
  }
  
  // 내 정보부터 가져오기
    api.post("/me")
      .then(res => {
        if (res.data.status) {
          setUserId(res.data.user); // 여기서 내 번호(예: 2)가 저장됨
        }
      })
      .catch(err => console.error("로그인 정보 없음"))

  loadBoard();
  loadComments();
}, [no]);

  /* ---------------- 게시글 삭제 ---------------- */
  const delet = () => {
    if (!window.confirm("삭제하시겠습니까?")) return;

    api.delete(`/board/${board.board_no}`)
      .then(res => {
        if (res.data.status) {
          alert("삭제 완료")
          navigate("/")
        } else {
          alert("삭제 실패")
        }
      })
      .catch(err => {
        console.error(err)
        alert("삭제 중 오류가 발생했습니다.")
      })
  }

  /* ---------------- 댓글 작성 ---------------- */
  const submitComment = () => {
  if (!commentText.trim()) {
    alert("댓글을 입력하세요");
    return;
  }
  
  // headers 부분을 아예 지웁니다. 
  // network.js의 api 인스턴스에 withCredentials: true가 설정되어 있어야 합니다.
  api.post("/comment", {
    board_no: board.board_no,
    cnt: commentText
  }) 
  .then(res => {
    if (res.data.status) {
      setCommentText("");
      loadComments();
    } else {
      alert("댓글 작성 실패");
    }
  })
  .catch(err => {
    console.error(err);
    // 401 에러가 나면 세션이 만료된 것이니 로그인을 다시 유도해야 합니다.
    if (err.response?.status === 401) alert("로그인이 만료되었습니다.");
    else alert("댓글 작성 중 오류가 발생했습니다.");
  });
};

  /* ---------------- 댓글 삭제 ---------------- */
  const deleteComment = (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return

    api.delete(`/comment/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    })
      .then(res => {
        if (res.data.status) loadComments()
        else alert("댓글 삭제 실패")
      })
      .catch(err => {
        console.error(err)
        alert("댓글 삭제 중 오류가 발생했습니다.")
      })
  }

  /* ---------------- 댓글 수정 ---------------- */
  const startEdit = (comment) => {
    setEditingId(comment.cnt_no)
    setEditText(comment.cnt)
  }

  const submitEdit = (id) => {
    if (!editText.trim()) {
      alert("댓글 내용을 입력하세요")
      return
    }

    api.put(`/comment/${id}`, { cnt: editText }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    }).then(res => {
      if (res.data.status) {
        setEditingId(null)
        loadComments()
      } else {
        alert("댓글 수정 실패")
      }
    }).catch(err => {
      console.error(err)
      alert("댓글 수정 중 오류가 발생했습니다.")
    })
  }

  return (
    <div className="container mt-3">
      <h1 className="display-1 text-center">게시글 상세</h1>

      <form onSubmit={onsubmit}>
        <div className="mb-3 mt-3">
          <label className="form-label">제목</label>
          <input type="text" className="form-control" value={board.title} readOnly />
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">작성자</label>
          <input type="text" className="form-control" value={board.name} readOnly />
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">작성날짜</label>
          <input type="text" className="form-control" value={board.regDate} readOnly />
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">내용</label>
          <textarea className="form-control h-50" rows="10" value={board.cnt} readOnly />
        </div>
      </form>
      <div className="d-flex">
        { userId &&
          <>
            <div className="p-2 flex-fill d-grid">
              <button type="button" onClick={UserClick} className="btn btn-primary">수정</button>
            </div>
            <div className="p-2 flex-fill d-grid">
              <button onClick={delet} className="btn btn-primary">삭제</button>
            </div>
          </>
        }        
        <div className="p-2 flex-fill d-grid">
          <button onClick={() => navigate("/")} className="btn btn-primary">취소</button>
        </div>
      </div>

      {/* ================= 댓글 작성 ================= */}
      <div className="comment-box mb-4 mt-5">
        <div className="d-flex">
          <div className="flex-grow-1 mt-3 position-relative">
            <TextareaAutosize type="text" className="form-control auto-resize" style={{ resize: "none" }} 
              rows="1" id="comment_area" name="comment_area" placeholder="댓글을 입력하세요"
              value={commentText} onChange={(e) => setCommentText(e.target.value)} ></TextareaAutosize>
          </div>
          <button className="btn btn-success btn-sm mx-2 mt-3" onClick={submitComment}>등록</button>
        </div>
      </div>

      {/* ================= 댓글 목록 ================= */}
      <div>
        {comments.map(comment => (
          comment.delYn === 1 ? (
            <div key={comment.cnt_no} className="comments my-3 w-100 pb-2 text-muted">삭제된 댓글입니다.</div>
          ) : (
            <div key={comment.cnt_no} className="comments my-3 w-100 pb-2">
              <div className="d-flex align-items-start">
                <img
                  className="rounded-circle me-3"
                  width="50" height="50"
                  src={comment.fileName ? `${API_URL}/uploads/${comment.fileName}` : "/images/img01.jpg"}
                  alt={comment.origin || "default"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/img01.jpg";
                  }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="fw-bold">{comment.name}</div>
                    {userId && String(userId) === String(comment.user_no) && (
                      <div>
                        <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => startEdit(comment)}>수정</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteComment(comment.cnt_no)}>삭제</button>
                      </div>
                    )}
                     </div>
                  {editingId === comment.cnt_no ? (
                    <div className="mt-2 d-flex">
                      <TextareaAutosize type="text" className="form-control auto-resize" style={{ resize: "none" }} 
                        rows="1" id="comment_area" name="comment_area" placeholder="댓글을 입력하세요"
                        value={editText} onChange={(e) => setEditText(e.target.value)} ></TextareaAutosize>
                      <button className="btn btn-success btn-sm" onClick={() => submitEdit(comment.cnt_no)}>저장</button>
                      <button className="btn btn-light btn-sm ms-1" onClick={() => setEditingId(null)}>취소</button>
                    </div>
                  ) : (
                    <>
                      <div className="mt-1">{comment.cnt}</div>
                      <div className="text-muted small my-1">{comment.modDate}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

export default Board_view