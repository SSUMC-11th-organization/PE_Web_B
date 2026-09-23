import { Route, Routes } from "react-router-dom";
import Header from "./components/header";
import MovieListPage from "./pages/movie-list-page";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MovieListPage />} />
      </Routes>
    </>
  );
}

export default App;
