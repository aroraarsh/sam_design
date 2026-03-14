import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BadgePage from './components/BadgePage'
import WorkPage from './components/WorkPage'
import SocialMediaPage from './components/SocialMediaPage'
import BookOfTypoPage from './components/BookOfTypoPage'
import ResumePage from './components/ResumePage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BadgePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/social-media" element={<SocialMediaPage />} />
        <Route path="/book-of-typo" element={<BookOfTypoPage />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
