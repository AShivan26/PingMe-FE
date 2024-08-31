import logo from './logo.svg';
import './App.css';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function App() {
  return (
    <div className="App">
      <header className="Ping-Me-Chat">
        <RegisterForm />
      </header>
    </div>
  );
}

export default App;
