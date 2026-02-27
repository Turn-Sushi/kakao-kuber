import { useState, useEffect } from 'react' 
import { useNavigate } from "react-router" 
import { useCookies } from "react-cookie" 
import axios from "axios" 
import { useAuth } from '@hooks/AuthProvider.jsx'

const UserView = () => {
  const navigate = useNavigate() 
  const [cookies, , removeCookie] = useCookies(['access_token']) 
  const close = () => navigate("/")
  const { clearAuth, setProImage } = useAuth();
  const [isPending, setIsPending] = useState(false)

  // 회원 정보 상태 관리
  const [user, setUser] = useState({
    userNo: "",
    name: "",
    email: "",
    gender: "",
    proNo: "",
    origin: "",
    fileName: "",
    regDate: "",
    modDate: ""
  }) 

  const API_URL = import.meta.env.VITE_APP_FASTAPI_URL 

  // 프로필 이미지 경로 설정
  const imageSrc = user.fileName 
    ? `${API_URL}/uploads/${user.fileName}` 
    : "/images/img01.jpg" 

  // 1. 회원 정보 불러오기
  useEffect(() => {
    // 백엔드의 get_payload가 알아서 쿠키의 토큰을 읽어 처리함
    axios.post(`${API_URL}/selUser`)
      .then(res => {
        if (res.data.status) {
          const data = res.data.status 
          // console.log(data)
          setUser({
            userNo: data.userNo,
            name: data.name,
            email: data.email,
            gender: data.gender, // DB 데이터가 1(남) 또는 2(여)라고 가정
            proNo: data.proNo,
            origin: data.origin,
            fileName: data.fileName,
            regDate: data.regDate,
            modDate: data.modDate
          }) 
          setProImage(data.fileName)
          setIsPending(true)
        } else {
          alert("로그인 세션이 만료되었습니다.") 
          navigate("/login") 
        }
      })
      .catch(err => {
        console.error("데이터 로딩 실패:", err) 
        alert("회원 정보를 가져오는 중 오류가 발생했습니다.") 
      }) 
  }, []) 

  // 2. 회원 탈퇴 로직
  const resignation = () => {
    if (!window.confirm("정말로 탈퇴하시겠습니까? 탈퇴 후 데이터는 복구되지 않습니다.")) return 

    // 백엔드는 이미 토큰을 통해 user_no를 알고 있으므로 빈 객체만 보냄
    axios.post(`${API_URL}/userDelYn`)
      .then(res => {
        if (res.data.status) {
          alert(res.data.msg || "탈퇴 처리가 완료되었습니다.") 
          // removeCookie('access_token')  // 클라이언트 쿠키 삭제
          clearAuth("/")  // 홈으로 이동
        } else {
          alert(res.data.msg) 
        }
      })
      .catch(err => {
        console.error("탈퇴 요청 실패:", err) 
        alert("탈퇴 처리 중 오류가 발생했습니다.") 
      }) 
  } 

  // 3. 수정 화면으로 이동
  const goToEdit = (e) => {
    e.preventDefault() 
    // 현재 유저 정보를 state에 담아서 수정 페이지로 전달
    navigate("/userEdit", { state: user }) 
  } 

  return (
    <div className="container mt-3 position-relative">
      <h1 className="display-1 text-center">회원정보</h1>
      {isPending &&
      <>
        <div>
          {/* onError는 uploads에 관련 이미지가 없을경우 예외처리해주는 부분 */}
          {/* 예외처리는 기본 이미지 불러오기 */}
          <img
            className="border user_pt"
            src={imageSrc}
            alt={origin || "default"}
            id="preview"
            onError={(e) => {
              e.target.onerror = null 
              e.target.src = "/images/img01.jpg" 
            }}
          />
        </div>

        <form onSubmit={goToEdit}>
          <div>
            <div className="mb-3 mt-3">
              <label htmlFor="name" className="form-label">이름</label>
              <input type="text" className="form-control" id="name" name="name"
                readOnly="readonly" defaultValue={user.name} />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="email" className="form-label">이메일</label>
              <input type="email" className="form-control" id="email" name="email"
                readOnly="readonly" defaultValue={user.email} />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="regDate" className="form-label">가입일</label>
              <input type="text" className="form-control" id="regDate" name="regDate"
                readOnly="readonly" defaultValue={user.regDate} />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="modDate" className="form-label">회원정보 수정일</label>
              <input type="text" className="form-control" id="modDate" name="modDate"
                readOnly="readonly" defaultValue={user.modDate} />
            </div>

            <div className="d-flex">
              <div className="p-2 flex-fill">
                <div className="form-check">
                  <input type="radio" className="form-check-input" id="radio1" name="gender" value="1"
                    checked={user.gender} disabled readOnly="readonly" />남성
                  <label className="form-check-label" htmlFor="radio1"></label>
                </div>
              </div>
              <div className="p-2 flex-fill">
                <div className="form-check">
                  <input type="radio" className="form-check-input" id="radio2" name="gender" value="2"
                    checked={!user.gender} disabled readOnly="readonly" />여성
                  <label className="form-check-label" htmlFor="radio2"></label>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex">
            <div className="p-2 flex-fill d-grid">
              <button type="button" className="btn btn-primary" onClick={close}>취소</button>
            </div>
            <div className="p-2 flex-fill d-grid">
              <button type="submit" className="btn btn-primary">수정</button>
            </div>
            <div className="p-2 flex-fill d-grid">
              <button type="button" className="btn btn-primary" onClick={resignation}>탈퇴</button>
            </div>
          </div>
        </form>
      </>}
    </div>
  )
}

export default UserView