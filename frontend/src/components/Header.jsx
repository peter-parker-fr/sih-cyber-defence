import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap } from 'lucide-react'

function Header({ currentPage, onNavigate, modelReady }) {
  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'benchmarks', label: 'Benchmarks' },
    { id: 'about', label: 'About' }
  ]

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-opacity-30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 font-bold text-xl hover:text-electric-blue transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-6 h-6 text-electric-blue" />
            <span>CyberDefence</span>
            <span className="text-electric-blue">WM</span>
          </motion.button>

          {/* Navigation */}
          <nav className="flex items-center gap-1 hidden md:flex">
            {navItems.map(item => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-electric-blue-dark text-white'
                    : 'text-gray-300 hover:text-electric-blue'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Status Badge */}
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className={`w-2 h-2 rounded-full ${modelReady ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-sm text-gray-300">
              {modelReady ? 'Model Ready' : 'Loading...'}
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  )
}

export default Header
