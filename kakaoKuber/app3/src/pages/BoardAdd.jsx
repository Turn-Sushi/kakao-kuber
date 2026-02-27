import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { api } from "@utils/network"

const BoardAdd = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

// useEffect(() => {
//   api.post("/me")
//     .then(res => {
//       if (!res.data.status)
        // {
        // const userData = localStorage.getItem("user");
        // try {
        //   const parsed = JSON.parse(userData);
        //   // 데이터가 객체이고 email이 있을 때만 저장
        //   if (parsed && typeof parsed === 'object' && parsed.email) {
        //     setUserEmail(parsed.email);
        //   } else {
        //     // 콘솔에 true가 찍혔다면 이리로 들어옵니다.
        //     console.error("이메일 정보가 없습니다. 현재 값:", parsed);
        //     // 테스트용: 강제로 이메일을 세팅해보거나 다시 로그인을 시킵니다.
        //   }
        // } catch (e) {
        //   console.error("로컬스토리지 데이터 파싱 에러");
        // }
      // } else {
      //   navigate("/login");
      // }
//     });
// }, []);

  const submitBtn = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert("내용을 입력해주세요.");
    const params = { 
      title: title, 
      content: content 
    }; 
    
    try {
      const res = await api.post("/boardadd", params);
      if(res.data.status) {
        alert("게시글이 등록되었습니다.");
        navigate("/");
      }
    } catch (err) {
      alert("등록에 실패했습니다.");
    }
  };
  return (
    <div className="container mt-3">
      <h1 className="display-1 text-center">게시글 작성</h1>
      <form onSubmit={submitBtn}>
        <div className="mb-3 mt-3">
          <label htmlFor="title" className="form-label">제목</label>
          <input 
            type="text" 
            className="form-control" 
            id="title" 
            placeholder="제목을 입력하세요." 
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="content" className="form-label">내용</label>
          <textarea 
            className="form-control h-50" 
            rows="10" 
            placeholder="내용을 입력하세요."
            value={content}
            onChange={e => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="d-flex">
          <div className="p-2 flex-fill d-grid">
            <button type="submit" className="btn btn-primary">등록</button>
          </div>
          <div className="p-2 flex-fill d-grid">
            <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>취소</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default BoardAdd