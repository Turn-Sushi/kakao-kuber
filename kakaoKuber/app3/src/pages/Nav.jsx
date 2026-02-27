import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@hooks/AuthProvider.jsx'
import { api } from "@utils/network"
import axios from 'axios'
axios.defaults.withCredentials = true

const Nav = () => {
  const navigate = useNavigate();
  
  // AuthProvider의 value={{ isLogin, login, logout }} 와 이름을 맞춰야 함!
  const { isLogin, clearAuth, proImage, setIsLogin, setProImage } = useAuth();

  const handleLogin = () => {
    const API_URL = import.meta.env.VITE_APP_FASTAPI_URL;
    window.location.href = `${API_URL}/app1/login/kakao`;
    //  api.get("/app1/login/kakao")
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(err => {
    //     console.error(err)
    //     alert("!!!!!!!!!!실패염!!!!!!!!!!!")
    //   })
  }

  const handleLogout = () => {
    // axios.post("/")
    alert('로그아웃 되었습니다.');
    clearAuth();
    navigate('/');
  };

  const API_URL = import.meta.env.VITE_APP_FASTAPI_URL 
  // 프로필 이미지 경로 설정
  const imageSrc = proImage 
    ? `${API_URL}/uploads/${proImage}` 
    : "/images/img01.jpg" 

  useEffect(() => {
    if (!isLogin) {
      api.get("/app1/me") // 백엔드의 /me API 호출
        .then(res => {
          console.log(res.data.state)
          if (res.data.status) {
            console.error(res.data.userInfo)
            // 로그인 상태로 변경 및 프로필 이미지 설정
            setIsLogin(true);
            setProImage(res.data.userInfo.profile_image);
            // console.log(res.data.userInfo.id)
            // console.log(res.data.userInfo.nickname)
          }
        })
        .catch(err => {
          console.error("사용자 정보 가져오기 실패", err);
        });
    }
  }, [isLogin]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid position-relative">

        <a className="navbar-brand" href="/">TEAM3</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse mt-3 mt-lg-0" id="navbarNav">
          <div className="nav_box">
            <ul className="navbar-nav align-items-center gap-3 ms-auto" >
              {!isLogin ? (
                <>
                  <li className="nav-item"><button className="nav-a btn btn-a" onClick={handleLogin}>로그인</button></li>
                  <li className="nav-item"><a className="nav-a" href="/signup">회원가입</a></li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button className="nav-a btn btn-a" onClick={handleLogout}>로그아웃</button>
                  </li>
                  <li className="nav-item"><a className="nav-a" href="/userview">회원정보</a></li>
                  <li className="nav-item">
                    {/* 여기에 fileName을 불러와야함.... 현재 주석처리해둠 */}
                    {/* <img
                      src={
                        fileName
                        ? `${API_URL}/uploads/${fileName}`
                        : "/images/img01.jpg"
                      }
                      alt={comment.origin || "default"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/img01.jpg";
                      }}
                      className="border user_pt_nav mt-0 object-fit-cover rounded-circle"
                      style={{ width: '40px', height: '40px' }}
                      /> */}
                    <img
                      src={imageSrc}
                      className="border user_pt_nav mt-0 object-fit-cover rounded-circle"
                      style={{ width: '40px', height: '40px' }}
                    />
                  </li>
                </>
              )}
              {/* <li className="nav-item">
                  <img 
                    src="/images/img01.jpg"
                    className="border user_pt_nav mt-0 object-fit-cover rounded-circle" 
                    style={{ width: '40px', height: '40px' }}
                  />
                </li> */}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
