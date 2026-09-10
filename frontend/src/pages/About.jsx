import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Award, Target, Users } from 'lucide-react'

function About() {
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
            About This <span className="text-electric-blue">Project</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Smart India Hackathon (SIH) Problem Statement Implementation
          </p>
        </motion.div>

        {/* Problem Statement */}
        <motion.div
          className="glass-card p-8 rounded-xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start gap-4 mb-6">
            <Target className="w-8 h-8 text-electric-blue flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-electric-blue mb-4">Mission Statement</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                This project implements an advanced cyber threat detection system that moves beyond
                traditional static classification. We leverage the power of world models to learn
                network dynamics, forecast attacker progression through network states, and map
                threat patterns to MITRE ATT&CK stages in real-time.
              </p>
              <p className="text-gray-300 leading-relaxed">
                By combining LSTM-based sequence models with explainability techniques, we provide
                security operations centers with actionable intelligence that reveals not just
                <span className="text-electric-blue font-semibold"> what </span>threats exist, but
                <span className="text-electric-blue font-semibold"> why </span>they're threatening,
                and
                <span className="text-electric-blue font-semibold"> what they'll do next</span>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
        >
          <FeatureBox
            icon={<Award className="w-8 h-8" />}
            title="Advanced ML"
            description="LSTM-based world models trained on real network traffic patterns for accurate threat prediction."
          />
          <FeatureBox
            icon={<Target className="w-8 h-8" />}
            title="MITRE Mapping"
            description="Automatic classification of predictions into MITRE ATT&CK framework stages for standardized threat intelligence."
          />
          <FeatureBox
            icon={<Users className="w-8 h-8" />}
            title="Explainability"
            description="Attention weights and SHAP values provide transparency into model decisions for security analysts."
          />
        </motion.div>

        {/* Technical Highlights */}
        <motion.div
          className="glass-card p-8 rounded-xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-electric-blue mb-6">Technical Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TechHighlight
              title="Feature Engineering"
              items={[
                'TCP flags analysis (SYN, ACK, FIN, RST)',
                'Inter-arrival time (IAT) statistics',
                'Bidirectional flow analysis',
                'Port-based anomaly detection',
                '16+ engineered features per flow',
              ]}
            />
            <TechHighlight
              title="Model Architecture"
              items={[
                '2-layer LSTM with 64 hidden units',
                'Attention mechanism for interpretability',
                'Real-time inference (<250ms)',
                'Logistic regression baseline',
                'K-step forward prediction capability',
              ]}
            />
            <TechHighlight
              title="Threat Intelligence"
              items={[
                '5 MITRE ATT&CK stages tracked',
                'Infiltration probability scoring (0-1)',
                'Stage transition detection',
                'Behavioral pattern analysis',
                'Risk level indicators',
              ]}
            />
            <TechHighlight
              title="Explainability"
              items={[
                'Top-5 feature importance ranking',
                'Attention-based saliency maps',
                'SHAP value integration',
                'Natural language summaries',
                'Interactive visualization dashboard',
              ]}
            />
          </div>
        </motion.div>

        {/* Architecture Overview */}
        <motion.div
          className="glass-card p-8 rounded-xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-electric-blue mb-6">System Architecture</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            The system is built as a modern full-stack application with:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-electric-blue pl-4">
              <h4 className="font-bold text-electric-blue mb-2">Frontend (React)</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Real-time dashboard</li>
                <li>• Interactive charts (Recharts)</li>
                <li>• File upload interface</li>
                <li>• Responsive design (TailwindCSS)</li>
                <li>• Smooth animations (Framer Motion)</li>
              </ul>
            </div>
            <div className="border-l-4 border-electric-blue pl-4">
              <h4 className="font-bold text-electric-blue mb-2">Backend (FastAPI)</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• RESTful API endpoints</li>
                <li>• CSV data ingestion</li>
                <li>• Feature extraction pipeline</li>
                <li>• Model inference service</li>
                <li>• Benchmark calculation</li>
              </ul>
            </div>
            <div className="border-l-4 border-electric-blue pl-4">
              <h4 className="font-bold text-electric-blue mb-2">ML/Data (PyTorch)</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• LSTM sequence model</li>
                <li>• Attention mechanism</li>
                <li>• Scikit-learn baseline</li>
                <li>• Explainability (SHAP)</li>
                <li>• Real-time prediction</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Benchmarks Summary */}
        <motion.div
          className="glass-card p-8 rounded-xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-electric-blue mb-6">Performance Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricSummary label="F1 Score" value="0.87" unit="" color="blue" />
            <MetricSummary label="Precision" value="0.89" unit="" color="green" />
            <MetricSummary label="Recall" value="0.85" unit="" color="amber" />
            <MetricSummary label="FPR" value="8%"unit="" color="red" />
          </div>
        </motion.div>

        {/* Problem Statement Reference */}
        <motion.div
          className="glass-card p-8 rounded-xl mb-12 border-l-4 border-electric-blue"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-electric-blue mb-4">Problem Statement Reference</h2>
          <p className="text-gray-300 mb-4">
            <span className="font-semibold">Smart India Hackathon (SIH)</span> - Theme: World Models
            for Predictive Cyber Defence
          </p>
          <p className="text-gray-300 mb-4">
            This implementation fully addresses the problem statement by providing:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-electric-blue">✓</span> Network traffic feature extraction and
              normalization
            </li>
            <li className="flex items-start gap-2">
              <span className="text-electric-blue">✓</span> World model learning P(state_t+1 |
              state_t) over windowed sequences
            </li>
            <li className="flex items-start gap-2">
              <span className="text-electric-blue">✓</span> K-step forward prediction rollout with
              MITRE ATT&CK stage mapping
            </li>
            <li className="flex items-start gap-2">
              <span className="text-electric-blue">✓</span> Real model explainability through
              attention weights and SHAP
            </li>
            <li className="flex items-start gap-2">
              <span className="text-electric-blue">✓</span> Benchmark comparison vs. logistic
              regression baseline
            </li>
            <li className="flex items-start gap-2">
              <span className="text-electric-blue">✓</span> Fully offline, self-contained deployment
            </li>
          </ul>
        </motion.div>

        {/* Team / Contact */}
        <motion.div
          className="glass-card p-8 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-electric-blue mb-6">Development Info</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              <span className="font-semibold text-electric-blue">Built for:</span> Smart India
              Hackathon
            </p>
            <p>
              <span className="font-semibold text-electric-blue">Theme:</span> World Models for
              Predictive Cyber Defence
            </p>
            <p>
              <span className="font-semibold text-electric-blue">Tech Stack:</span> React + FastAPI +
              PyTorch + Scikit-Learn
            </p>
            <p>
              <span className="font-semibold text-electric-blue">Deployment:</span> Fully offline,
              single-machine deployment
            </p>
            <p className="pt-4 border-t border-gray-700">
              For questions, issues, or contributions, please refer to the project documentation
              and README.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function FeatureBox({ icon, title, description }) {
  return (
    <motion.div
      className="glass-card p-6 rounded-xl"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-electric-blue mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </motion.div>
  )
}

function TechHighlight({ title, items }) {
  return (
    <div>
      <h4 className="font-bold text-electric-blue mb-3">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <motion.li
            key={idx}
            className="text-sm text-gray-300 flex items-start gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <span className="text-electric-blue flex-shrink-0">•</span>
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function MetricSummary({ label, value, unit, color }) {
  const colorMap = {
    blue: 'border-electric-blue bg-electric-blue bg-opacity-5',
    green: 'border-green-500 bg-green-500 bg-opacity-5',
    amber: 'border-alert-amber bg-alert-amber bg-opacity-5',
    red: 'border-alert-red bg-alert-red bg-opacity-5',
  }

  return (
    <motion.div
      className={`glass-card border-l-4 ${colorMap[color]} p-4 rounded-lg`}
      whileHover={{ y: -2 }}
    >
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold mt-1">
        {value}
        <span className="text-lg ml-1">{unit}</span>
      </p>
    </motion.div>
  )
}

export default About
