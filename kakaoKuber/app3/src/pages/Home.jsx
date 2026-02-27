import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { api } from "@utils/network"

const Home = () => {
  const navigate = useNavigate()

  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [size] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [keyword, setKeyword] = useState("")

  const fetchBoards = () => {
    setLoading(true)

    api.get("/home", {
      params: {
        page,
        size,
        keyword
      }
    })
      .then(res => {
        if (res.data.status) {
          setBoards(res.data.data)
          setTotalPages(res.data.totalPages)
        }
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBoards()
  }, [page])

  const handleSearch = e => {
    e.preventDefault()
    setPage(1)
    fetchBoards()
  }

  if (loading) return <div className="text-center mt-5">로딩 중...</div>

  return (
    <div className="container mt-4">
      <h1 className="display-5 text-center mb-4">게시판</h1>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button className="btn btn-primary"
          // onClick={() => navigate("/boardadd")}
          >
          게시글 작성
        </button>

        <form className="d-flex" 
        // onSubmit={handleSearch}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button className="btn btn-outline-dark" type="button">
            Search
          </button>
        </form>
      </div>

      <table className="table table-hover mt-3 text-center">
        <thead className="table-dark">
          <tr>
            <th>번호</th>
            <th>게시글</th>
            <th>작성일</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {boards.length === 0 && (
            <tr>
              <td colSpan="4">게시글이 없습니다</td>
            </tr>
          )}

          {boards
          .filter(board => board.delYn === 0)
          .map(board => (
            <tr key={board.board_no}
              style={{ cursor: "pointer" }}
              /*onClick={() => navigate(`/boardview/${board.board_no}`)}*/>
              <td>{board.board_no}</td>
              <td>{board.title}</td>
              <td>{board.regDate}</td>
              <td>{board.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 페이지네이션 */}
      <nav>
        <ul className="pagination justify-content-center mt-4">

          <li className={`page-item ${page === 1 && "disabled"}`}>
            <button className="page-link"
              // onClick={() => setPage(prev => prev - 1)}
              >
              «
            </button>
          </li>

          {[...Array(totalPages)].map((_, index) => (
            <li key={index}
              className={`page-item ${page === index + 1 && "active"}`}>
              <button
                className="page-link"
                // onClick={() => setPage(index + 1)}
                >
                {index + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${page === totalPages && "disabled"}`}>
            <button className="page-link"
              // onClick={() => setPage(prev => prev + 1)}
              >
              »
            </button>
          </li>

        </ul>
      </nav>

    </div>
  )
}

export default Home