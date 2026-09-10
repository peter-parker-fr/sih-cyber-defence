import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Database, Brain, BarChart3, Eye } from 'lucide-react'

function Architecture() {
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
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy-light to-navy py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            System <span className="text-electric-blue">Architecture</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            End-to-end pipeline for predictive cyber threat detection using advanced ML techniques.
          </p>
        </motion.div>

        {/* Architecture Diagram Section */}
        <motion.div
          className="glass-card p-8 rounded-xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-8 text-electric-blue">Data Pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineStages.map((stage, idx) => (
              <PipelineStage
                key={idx}
                stage={stage}
                idx={idx}
                variants={itemVariants}
              />
            ))}
          </div>
        </motion.div>

        {/* Component Details */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {components.map((component, idx) => (
            <ComponentCard
              key={idx}
              component={component}
              variants={itemVariants}
            />
          ))}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          className="glass-card p-8 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-8 text-electric-blue">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <TechStackCard
              title="Frontend"
              techs={['React 18', 'Vite', 'TailwindCSS', 'Framer Motion', 'Recharts']}
            />
            <TechStackCard
              title="Backend"
              techs={['FastAPI', 'Python 3.10+', 'Uvicorn', 'Pydantic']}
            />
            <TechStackCard
              title="ML/AI"
              techs={['PyTorch', 'LSTM', 'Scikit-Learn', 'SHAP']}
            />
            <TechStackCard
              title="Data"
              techs={['Pandas', 'NumPy', 'CSV', 'Network Flows']}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function PipelineStage({ stage, idx, variants }) {
  return (
    <motion.div
      className="glass-card p-4 rounded-lg text-center relative group"
      variants={variants}
      whileHover={{ y: -5 }}
    >
      <div className="mb-4 flex justify-center">
        {stage.icon}
      </div>
      <h4 className="font-bold mb-2">{stage.title}</h4>
      <p className="text-sm text-gray-400">{stage.description}</p>

      {idx < 4 && (
        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-electric-blue opacity-50">
          →
        </div>
      )}
    </motion.div>
  )
}

function ComponentCard({ component, variants }) {
  return (
    <motion.div
      className="glass-card p-8 rounded-xl"
      variants={variants}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start gap-4 mb-4">
        {component.icon}
        <h3 className="text-xl font-bold text-electric-blue">{component.title}</h3>
      </div>
      <p className="text-gray-300 mb-4">{component.description}</p>
      <div>
        <p className="text-sm text-gray-400 font-semibold mb-2">Key Features:</p>
        <ul className="space-y-1">
          {component.features.map((feature, idx) => (
            <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
              <span className="text-electric-blue">•</span> {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function TechStackCard({ title, techs }) {
  return (
    <motion.div
      className="glass-card p-6 rounded-xl"
      whileHover={{ y: -3 }}
    >
      <h4 className="font-bold text-electric-blue mb-4">{title}</h4>
      <div className="space-y-2">
        {techs.map((tech, idx) => (
          <motion.div
            key={idx}
            className="text-sm text-gray-300 bg-electric-blue bg-opacity-10 px-3 py-2 rounded-lg border border-electric-blue border-opacity-20"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {tech}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const pipelineStages = [
  {
    title: 'Input',
    description: 'Network flows (CSV)',
    icon: <Database className="w-8 h-8 text-electric-blue" />,
  },
  {
    title: 'Feature Extraction',
    description: 'TCP flags, ports, stats',
    icon: <Zap className="w-8 h-8 text-electric-blue" />,
  },
  {
    title: 'LSTM Model',
    description: 'State prediction',
    icon: <Brain className="w-8 h-8 text-electric-blue" />,
  },
  {
    title: 'Stage Mapping',
    description: 'MITRE ATT&CK mapping',
    icon: <BarChart3 className="w-8 h-8 text-electric-blue" />,
  },
  {
    title: 'Explainability',
    description: 'Feature importance',
    icon: <Eye className="w-8 h-8 text-electric-blue" />,
  },
]

const components = [
  {
    title: 'Feature Extraction Pipeline',
    description:
      'Ingests raw network flow data and extracts meaningful features for ML processing.',
    icon: <Database className="w-8 h-8 text-electric-blue flex-shrink-0 mt-1" />,
    features: [
      'TCP/UDP protocol detection',
      'TCP flags analysis (SYN, ACK, FIN, RST)',
      'Inter-arrival time (IAT) statistics',
      'Bidirectional traffic analysis',
      'Suspicious port identification',
    ],
  },
  {
    title: 'World Model (LSTM)',
    description:
      'Deep learning model trained on network state sequences to predict future traffic patterns and infiltration probability.',
    icon: <Brain className="w-8 h-8 text-electric-blue flex-shrink-0 mt-1" />,
    features: [
      '2-layer LSTM with 64 hidden units',
      'Attention mechanism for feature importance',
      'Trained on 500+ flow sequences',
      'Real-time inference capability',
      'Attention weights for explainability',
    ],
  },
  {
    title: 'Threat Classification',
    description:
      'Maps infiltration probability to MITRE ATT&CK framework stages for actionable threat intelligence.',
    icon: <BarChart3 className="w-8 h-8 text-electric-blue flex-shrink-0 mt-1" />,
    features: [
      'Reconnaissance stage detection',
      'Initial Access identification',
      'Lateral Movement tracking',
      'Command & Control identification',
      'Exfiltration detection',
    ],
  },
  {
    title: 'Explainability Engine',
    description:
      'Provides interpretable predictions with attention weights and natural language explanations.',
    icon: <Eye className="w-8 h-8 text-electric-blue flex-shrink-0 mt-1" />,
    features: [
      'Top-5 feature importance ranking',
      'Attention-based saliency maps',
      'SHAP values for baseline comparison',
      'Natural language summaries',
      'Risk level indicators',
    ],
  },
]

export default Architecture
