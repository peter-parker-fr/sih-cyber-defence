import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Architecture from './pages/Architecture'
import Benchmarks from './pages/Benchmarks'
import About from './pages/About'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [modelReady, setModelReady] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check model health
    fetch('http://localhost:8000/health')
      .then(res => res.json())
      .then(data => {
        setModelReady(data.model_ready)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to connect to backend:', err)
        setLoading(false)
      })
  }, [])

  const renderPage = () => {
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    }

    switch(currentPage) {
      case 'landing':
        return <Landing key="landing" {...pageVariants} onNavigate={setCurrentPage} />
      case 'dashboard':
        return <Dashboard key="dashboard" {...pageVariants} modelReady={modelReady} />
      case 'architecture':
        return <Architecture key="architecture" {...pageVariants} />
      case 'benchmarks':
        return <Benchmarks key="benchmarks" {...pageVariants} />
      case 'about':
        return <About key="about" {...pageVariants} />
      default:
        return <Landing key="landing" {...pageVariants} onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Header 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        modelReady={modelReady}
      />
      
      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {!loading && renderPage()}
          {loading && (
            <div className="flex items-center justify-center h-screen">
              <div className="loader"></div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

export default App
