import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route } from "react-router";
import { useAuth } from '@/hooks/AuthProvider.jsx'
import Nav from '@pages/Nav.jsx'

const App = () => {
  const { paths, isLogin, isPending } = useAuth()
  return (
    <>
      <Nav />
      <div className="container mt-3">
        {isPending && (
          <Routes>
            {paths?.map((v, i) => (
              <Route key={i} path={v.path} element={v.element} />
            ))}
          </Routes>
        )}
      </div>
    </>
  )
}

export default App