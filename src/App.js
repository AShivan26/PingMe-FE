import './App.css';
import LoginForm from "./components/LoginForm";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterForm from "./components/RegisterForm";
import { UserProvider } from './components/UserContext';
import ChatPage from "./components/ChatPage";

function App() {
      return (
          <UserProvider>
              <Router>
                  <Routes>
                      <Route path="/login" element={<LoginForm />}  />
                      <Route path="/register" element={<RegisterForm />} />
                      <Route path="/chat" element={<ChatPage/>} />
                      <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
              </Router>
          </UserProvider>
      );
}

export default App;
