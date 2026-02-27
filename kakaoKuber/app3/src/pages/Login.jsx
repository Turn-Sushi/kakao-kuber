import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/AuthProvider.jsx'
import { useNavigate } from 'react-router'

axios.defaults.withCredentials = true

const Login = () => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loginId, setLoginId] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  
  // URL을 변경하기 위한 선언 
  const API_URL = import.meta.env.VITE_APP_FASTAPI_URL

  const { setAuth, setProImage } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLogin) {
      const loginMe = async () => {
        try {
          const res = await axios.post(
            `${API_URL}/me`, 
            {}, 
            { withCredentials: true }
          )

          if (res.data.status) {
            // console.log("DB 기록 완료:", res.data.user)
            setAuth(true)
            setProImage(res.data.fileName)
            navigate("/")
          }
        } catch (err) {
          console.error("인증 정보 조회 실패", err)
        }
      }
      loginMe()
    }
  }, [isLogin, setAuth, navigate])


  const event1 = async e => {
    e.preventDefault()
    // console.log("코드 발급", e.target.email.value)
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { email },
        { withCredentials: true }
      )

      if (res.data.status) {
        setLoginId(res.data.loginId)
        alert("인증번호 발송 완료")
      } else {
        alert("입력하신 Email은 존재하지 않습니다.")
      }
    } catch (err) {
      console.error(err)
      alert("서버 오류")
    }
  }

  const event2 = async e => {
    e.preventDefault()
    // console.log("토큰 발급")
    try {
    const res = await axios.post(
      `${API_URL}/code`,
      { loginId: loginId, id: code },
      { withCredentials: true }
    )
    // console.log(loginId, code)

    if (res.data.status) {
      alert("인증되었습니다.")
      setIsLogin(true)
      setCode("")
    } else {
      alert("!!!!!!!!!!!!!!!!!!!!!!인증 실패!!!!!!!!!!!!!!!!!!!!!!")
    }
    } catch (err) {
      console.error(err)
    } 
  };



  return (
    <div className="container mt-3 box_size">
		<h1 className="display-1 text-center">로그인</h1>
		<form onSubmit={event1}>
			<div className="mb-3 mt-3">
				<label htmlFor="email" className="form-label">이메일</label>
				<input type="email" 
        className="form-control" 
        id="email" 
        placeholder="이메일를 입력하세요." 
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        />
			</div>
			<div className="d-flex mb-4">
				<div className="p-2 flex-fill d-grid">
					<button type="submit" className="btn btn-primary">메일 발송</button>
				</div>
				<div className="p-2 flex-fill d-grid ">
					<button type="button" className="btn btn-primary" onClick={()=>navigate("/")}>취소</button>
				</div>
			</div>
		</form>
    {loginId && (
      <form onSubmit={event2}>
        <div className="mb-3 d-flex">
          <input 
            type="password" 
            className="form-control" 
            id="pwd" placeholder="인증번호를 입력하세요" 
            name="pwd" 
            value={code}
            onChange={e=>setCode(e.target.value)}
            required
            />
          <button type="submit" className="w-25 btn btn-primary">인증</button>
        </div>
      </form>
    )}
	</div>
  )
}

export default Login