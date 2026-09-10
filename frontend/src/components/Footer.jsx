import React from 'react'
import { Heart } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-light border-t border-gray-700 mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-electric-blue font-bold mb-4">CyberDefence World Model</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              LSTM-based predictive cyber defence system for early threat detection and MITRE ATT&CK stage mapping.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-electric-blue font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-electric-blue transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-electric-blue transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-electric-blue transition-colors">GitHub</a></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-electric-blue font-bold mb-4">Technology</h3>
            <p className="text-gray-400 text-sm">
              <span className="block">Frontend: React + TailwindCSS</span>
              <span className="block">Backend: FastAPI + PyTorch</span>
              <span className="block">ML: LSTM + Scikit-Learn</span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Built with <Heart className="w-4 h-4 text-red-500" /> for Smart India Hackathon
            </p>
            <p className="text-gray-500 text-xs">
              © {currentYear} CyberDefence World Model. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
