import { Routes, Route, NavLink } from 'react-router-dom'
import Calculator from './pages/Calculator'
import Addition from './pages/Addition'
import Bills from './pages/Bills'
import Settings from './pages/Settings'
import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="nav-bar">
        <NavLink to="/" end>Calculator</NavLink>
        <NavLink to="/addition">Addition</NavLink>
        <NavLink to="/bills">Bills</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/addition" element={<Addition />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
