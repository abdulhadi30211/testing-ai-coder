import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { ChatTool } from './pages/tools/ChatTool'
import { ImageTool } from './pages/tools/ImageTool'
import { VisionTool } from './pages/tools/VisionTool'
import { ObjectTool } from './pages/tools/ObjectTool'
import { HistoryPage } from './pages/HistoryPage'
import { Toaster } from 'sonner'

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tool/chat" element={<ChatTool />} />
            <Route path="/tool/image" element={<ImageTool />} />
            <Route path="/tool/vision" element={<VisionTool />} />
            <Route path="/tool/object" element={<ObjectTool />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster closeButton position="top-center" />
      </div>
    </Router>
  )
}

export default App
