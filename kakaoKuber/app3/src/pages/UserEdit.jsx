import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from "react-router"
import { useCookies } from "react-cookie"
import axios from "axios"

const UserEdit = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const close = () => navigate(-1)
  const [userNo, setUserNo] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [proNo, setProNo] = useState("")
  const [origin, setOrigin] = useState("")
  const [fileName, setFileName] = useState("")
  const [gender, setGender] = useState("")
  const [regDate, setRegDate] = useState("")
  const [modDate, setModDate] = useState("")
  const [cookies, setCookie, removeCookie] = useCookies(['userUp'])
  const [files, setFiles] = useState([])

  
  // URL을 변경하기 위한 선언 
  const API_URL = import.meta.env.VITE_APP_FASTAPI_URL
  
  // 이미지 불러올때 미리 선언 해줌
  // 1. 새로 선택한 이미지 (base64 미리보기)
  // 2. 서버에 저장된 이미지
  // 3. 기본 이미지
  const imageSrc = files.length > 0 ? fileName 
    : (fileName ? `${API_URL}/uploads/${fileName}` : "/images/img01.jpg")

  const config ={
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }

  // 등록할 프로필 선택 및 화면 출력
  const imgEvent = () => {
    const x = document.createElement("input")
    x.type = "file"
    x.accept = "image/*"

    x.addEventListener("change", function (event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = function (e) {
          // 미리보기용 base64 저장
          setFileName(e.target.result)
          // 원본 파일명 저장
          setOrigin(file.name)
          // 파일 저장
          setFiles(Array.from(event.target.files))
        }
        
        reader.readAsDataURL(file)
      }
    })

    x.click()
  }

  // 회원 정보 수정 전 파일 업로드
  const fileUpload = async e => {
    e.preventDefault()
    // console.log("프로필 등록 요청")
    if(files.length > 0) {
      const formData = new FormData();
      formData.append("userNo", userNo)
      files.forEach(file => formData.append("files", file))
      await axios.post(`${API_URL}/uploadFile`, formData, config)
      .then(res => {
        if(res.data.status) {
            // 회원정보 등록
            const newProNo = res.data.proNo
            setProNo(newProNo)
            // 회원정보 수정 시작
            submitE(newProNo)
          } else {
            alert(res.data.msg)
          }
      })
      .catch(err => console.error(err))
    } else {
      submitE(proNo)
    }
  }

  // 회원정보 수정
  const submitE = newProNo => {
    const params = { userNo, proNo: newProNo, name, email, gender, regDate, modDate }
    // console.log(params)

    const userUp = {
      userNo: userNo,
      proNo: newProNo,
      name: name,
      email: email,
      gender: gender,
      regDate: regDate
    }
    // 쿠키 저장
    setCookie("userUp", window.btoa(encodeURI(JSON.stringify(userUp))))
    // 서버에 저장 요청
    axios.post(`${API_URL}/userUpdate`,{}, { withCredentials: true } )
      .then(res => {
        alert(res.data.msg)
        if(res.data.status) navigate("/userview")
      })
      .catch(err => console.error(err));

  }

  useEffect(()=>{
    const data = location.state
    if (data === null) return close()
      setResult(data)
  }, [])

  const setResult = data => {
    setUserNo(data.userNo)
    setName(data.name)
    setEmail(data.email)
    setGender(data.gender)
    setProNo(data.proNo)
    setOrigin(data.origin)
    setFileName(data.fileName)
    setRegDate(data.regDate)
    setModDate(data.modDate)
  }

  return (
    <div className="container mt-3">
      <h1 className="display-1 text-center">회원정보 수정</h1>
      <div className="d-flex justify-content-center">
        <img
          className="d-block rounded-circle img-thumbnail mt-3 border user_pt"
          src={imageSrc}
          alt={origin || "default"}
          id="preview"
          onClick={imgEvent}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/img01.jpg";
          }}
        />
      </div>
      <form onSubmit={fileUpload}>
        <div className="mb-3 mt-3">
          <label htmlFor="name" className="form-label">이름</label>
          <input type="text" className="form-control" id="name" placeholder="이름을 입력하세요." name="name"
              value={name} onChange={e=>setName(e.target.value)}  autoComplete='off' required={true} />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">이메일</label>
          <input type="email" className="form-control" id="email" placeholder="이메일를 입력하세요." name="email"
              value={email} onChange={e=>setEmail(e.target.value)}  autoComplete='off' required={true} />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="regDate" className="form-label">가입일</label>
          <input type="text" className="form-control" id="regDate" placeholder="YYYY-MM-DD" name="regDate" 
              disabled readOnly="readonly" defaultValue={regDate}/>
        </div>
        <div className="d-flex">
          <div className="p-2 flex-fill">
            <div className="form-check">
              <input type="radio" className="form-check-input" id="radio1" name="gender" value="1" 
                  checked={gender} onChange={()=>setGender(1)} />남성
              <label className="form-check-label" htmlFor="radio1"></label>
            </div>
          </div>
          <div className="p-2 flex-fill">
            <div className="form-check">
              <input type="radio" className="form-check-input" id="radio2" name="gender" value="2" 
                  checked={!gender} onChange={()=>setGender(0)} />여성
              <label className="form-check-label" htmlFor="radio2"></label>
            </div>
          </div>
        </div>
        <div className="d-flex">
          <div className="p-2 flex-fill d-grid">
            <button type="submit" className="btn btn-primary">저장</button>
          </div>
          <div className="p-2 flex-fill d-grid">
            <button type="button" className="btn btn-primary" onClick={close}>취소</button>
          </div>
        </div>
      </form>
    </div>
  )
}
export default UserEdit