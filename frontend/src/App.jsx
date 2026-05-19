import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import Dashboard from "./pages/Dashboard";
import Flashcards from "./pages/Flashcards";
import History from "./pages/History";
import Home from "./pages/Home";
import Listening from "./pages/Listening";
import Login from "./pages/Login";
import Models from "./pages/Models";
import Notes from "./pages/Notes";
import Reading from "./pages/Reading";
import Schedule from "./pages/Schedule";
import Simulado from "./pages/Simulado";
import Speaking from "./pages/Speaking";
import Writing from "./pages/Writing";
import News from "./pages/News";
import YouTubeStudy from "./pages/YouTubeStudy";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/simulado" element={<Simulado />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/speaking" element={<Speaking />} />
          <Route path="/listening" element={<Listening />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/news" element={<News />} />
          <Route path="/models" element={<Models />} />
          <Route path="/youtube" element={<YouTubeStudy />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flashcards"
            element={
              <ProtectedRoute>
                <Flashcards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
