import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react'

function Landing({ onNavigate }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy-light to-navy">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 container mx-auto px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants}>
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              From Static to{' '}
              <span className="text-electric-blue">Predictive</span> Defence
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Advanced LSTM-based world models that learn network dynamics, forecast attacker progression, and map threats to MITRE ATT&CK stages in real-time.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex gap-4 flex-col sm:flex-row"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center justify-center gap-2 bg-electric-blue hover:bg-electric-blue-dark text-navy font-bold px-8 py-4 rounded-lg transition-all transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Live Demo <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => onNavigate('architecture')}
                className="flex items-center justify-center gap-2 border-2 border-electric-blue hover:border-electric-blue-dark text-electric-blue hover:text-electric-blue-dark font-bold px-8 py-4 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right - Animated Diagram */}
          <motion.div
            className="hidden md:block"
            variants={itemVariants}
          >
            <WorldModelDiagram />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-6">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Key Features
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} variants={itemVariants} />
          ))}
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 container mx-auto px-6">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <motion.div
          className="max-w-4xl mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, idx) => (
            <StepCard key={idx} step={step} idx={idx} variants={itemVariants} />
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-6">
        <motion.div
          className="glass-card p-12 rounded-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-6">Ready to See It In Action?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Upload your network traffic data and get real-time threat predictions with full explainability.
          </p>
          <motion.button
            onClick={() => onNavigate('dashboard')}
            className="bg-electric-blue hover:bg-electric-blue-dark text-navy font-bold px-8 py-4 rounded-lg inline-flex items-center gap-2 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}

function WorldModelDiagram() {
  return (
    <motion.div className="relative h-96">
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Nodes */}
        <motion.circle
          cx="60" cy="150"
          r="35"
          fill="url(#grad1)"
          stroke="#00D4FF"
          strokeWidth="2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
          cx="200" cy="150"
          r="35"
          fill="url(#grad1)"
          stroke="#3B82F6"
          strokeWidth="2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle
          cx="340" cy="150"
          r="35"
          fill="url(#grad1)"
          stroke="#00D4FF"
          strokeWidth="2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        />

        {/* Arrows */}
        <motion.path
          d="M 95 150 L 165 150"
          stroke="#00D4FF"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          animate={{ strokeDashoffset: [0, 10] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          markerEnd="url(#arrowhead)"
        />
        <motion.path
          d="M 235 150 L 305 150"
          stroke="#3B82F6"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          animate={{ strokeDashoffset: [0, 10] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          markerEnd="url(#arrowhead2)"
        />

        {/* Labels */}
        <text x="60" y="200" textAnchor="middle" className="fill-gray-300 text-sm">
          Network
        </text>
        <text x="200" y="200" textAnchor="middle" className="fill-gray-300 text-sm">
          World Model
        </text>
        <text x="340" y="200" textAnchor="middle" className="fill-gray-300 text-sm">
          Prediction
        </text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#00D4FF" />
          </marker>
          <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#3B82F6" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  )
}

function FeatureCard({ feature, variants }) {
  return (
    <motion.div
      className="glass-card p-8 rounded-xl hover:glow-blue-strong transition-all"
      variants={variants}
      whileHover={{ y: -5 }}
    >
      <div className="mb-4">{feature.icon}</div>
      <h3 className="text-xl font-bold mb-4 text-electric-blue">{feature.title}</h3>
      <p className="text-gray-300">{feature.description}</p>
    </motion.div>
  )
}

function StepCard({ step, idx, variants }) {
  return (
    <motion.div
      className="glass-card p-6 rounded-xl flex gap-6"
      variants={variants}
      whileHover={{ x: 5 }}
    >
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-electric-blue bg-opacity-10 border border-electric-blue">
          <span className="text-electric-blue font-bold">{idx + 1}</span>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-bold mb-2">{step.title}</h4>
        <p className="text-gray-300">{step.description}</p>
      </div>
    </motion.div>
  )
}

const features = [
  {
    title: 'LSTM World Model',
    description: 'Advanced neural network learns network state transitions and forecasts future traffic patterns.',
    icon: <Zap className="w-8 h-8 text-electric-blue" />,
  },
  {
    title: 'Real-time Predictions',
    description: 'Detect threats early with continuous infiltration probability scoring and stage prediction.',
    icon: <TrendingUp className="w-8 h-8 text-electric-blue" />,
  },
  {
    title: 'MITRE ATT&CK Mapping',
    description: 'Automatically map predictions to attack stages: Recon → Initial Access → Lateral Movement → C2 → Exfiltration.',
    icon: <Shield className="w-8 h-8 text-electric-blue" />,
  },
]

const steps = [
  {
    title: '1. Feature Extraction',
    description: 'Upload network flow data (CSV). System extracts TCP flags, port patterns, traffic statistics, and IAT metrics.',
  },
  {
    title: '2. World Model Training',
    description: 'LSTM learns P(state_t+1 | state_t) patterns. Logistic regression provides baseline comparison.',
  },
  {
    title: '3. Threat Prediction',
    description: 'Model generates k-step forward rollout with infiltration probability and MITRE stage mapping.',
  },
  {
    title: '4. Explainability',
    description: 'Attention weights highlight top contributing features. View real-time dashboard with full transparency.',
  },
]

export default Landing
