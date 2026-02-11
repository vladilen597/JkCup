import { BrowserRouter, Route, Routes } from "react-router";
import Header from "./Shared/Header/Header";
import Tournaments from "./Tournaments/Tournaments";
import TournamentPage from "./TournamentPage/TournamentPage";

function App() {
  return (
    <BrowserRouter>
      <div className="font-inter!">
        <Header />
        <Routes>
          <Route path="tournaments" element={<Tournaments />} />
          <Route path="tournaments/:id" element={<TournamentPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
