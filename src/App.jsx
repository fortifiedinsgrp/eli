import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Tasks from './pages/Tasks'
import History from './pages/History'
import Notes from './pages/Notes'
import NotePage from './pages/NotePage'
import Digests from './pages/Digests'
import DigestPage from './pages/DigestPage'
import Documents from './pages/Documents'
import Trading from './pages/Trading'
import News from './pages/News'
import NewsDigest from './pages/NewsDigest'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="chat" element={<Chat />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="history" element={<History />} />
            <Route path="notes" element={<Notes />} />
            <Route path="notes/:id" element={<NotePage />} />
            <Route path="digests" element={<Digests />} />
            <Route path="digests/:id" element={<DigestPage />} />
            <Route path="documents" element={<Documents />} />
            <Route path="trading" element={<Trading />} />
            <Route path="news" element={<News />} />
            <Route path="news/:date" element={<NewsDigest />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
