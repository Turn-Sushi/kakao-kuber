import { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

const SignUp = () => {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("1")
  const [isEmailChecked, setIsEmailChecked] = useState(false)


  // URL을 변경하기 위한 선언 
  const API_URL = import.meta.env.VITE_APP_FASTAPI_URL
  
  const emailCheckBtn = e => {
    e.preventDefault()
    axios.post(`${API_URL}/emailCheck`, {"email":email})
    .then(res=>{ 
      alert(res.data.msg)
      if (res.data.status) {
        setIsEmailChecked(true)
      } else {
        setIsEmailChecked(false)
      }
    })
    .catch(err=>console.error(err))
  }

  const submitBtn = async (e) => {
    e.preventDefault()
    if (!isEmailChecked) {
      alert("이메일 중복확인을 먼저 진행해주세요.")
      return
    }
    const params = {
      name: name, 
      email: email, 
      gender: gender
    }
    // console.log(params)

    axios.post(`${API_URL}/signup`, params)
    .then(res=>{
      alert(res.data.msg)
      if (res.data.status == true) navigate("/login")
    })
    .catch(err=>console.error(err))
  };

  return (
    <div className="container mt-3 box_size" >
		<h1 className="display-1 text-center">회원가입</h1>
		<form onSubmit={submitBtn}>
			<div className="mb-3 mt-3">
				<label htmlFor="name" className="form-label">이름:</label>
				<input 
          type="text" 
          className="form-control" 
          id="name" 
          placeholder="이름을 입력하세요." 
          name="name" 
          value={name}
          onChange={e=>setName(e.target.value)}
          />
			</div>
			<div className="mb-3 mt-3">
				<label htmlFor="email" className="form-label">이메일:</label>
				<div className="d-flex">
				<input 
          type="email" 
          className="form-control" 
          id="email" 
          placeholder="이메일를 입력하세요." 
          name="email"
          value={email}
          onChange={e=>{
            setEmail(e.target.value)
            setIsEmailChecked(false)
          }}
          />
				<button 
          type="button" 
          className="btn btn-primary email_btn"
          onClick={emailCheckBtn}
          >중복 확인</button>
				</div>
			</div>
			<div className="d-flex">
				<div className="p-2 flex-fill">
					<div className="form-check">
						<input 
              type="radio" 
              className="form-check-input" 
              id="radio1" 
              name="gender" 
              value="1" 
              checked={gender === "1"}
              onChange={e=>setGender(e.target.value)}/>남성
						<label className="form-check-label" htmlFor="radio1"></label>
					</div>
				</div>
				<div className="p-2 flex-fill">
					<div className="form-check">
						<input 
                type="radio" 
                className="form-check-input" 
                id="radio2" 
                name="gender" 
                value="0" 
                checked={gender === "0"}
                onChange={e=>setGender(e.target.value)}/>여성
						<label className="form-check-label" htmlFor="radio2"></label>
					</div>
				</div>
			</div>
      <div className="d-flex">
        <div className="p-2 flex-fill d-grid">
          <button type="submit" className="btn btn-primary" disabled={!isEmailChecked}>가입</button>
        </div>
        <div className="p-2 flex-fill d-grid">
          <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>취소</button>
        </div>
      </div>
		</form>
	</div>
  )
}

export default SignUp