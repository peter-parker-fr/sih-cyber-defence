import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

function FlaggedFlowsTable({ predictions }) {
  const [sortBy, setSortBy] = useState('probability')
  const [expandedRow, setExpandedRow] = useState(null)

  // Generate sample flows based on predictions
  const flows = generateSampleFlows(predictions, sortBy)

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
              <button
                onClick={() => setSortBy('stage')}
                className={`hover:text-electric-blue transition-colors ${
                  sortBy === 'stage' ? 'text-electric-blue' : ''
                }`}
              >
                Stage
              </button>
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
              <button
                onClick={() => setSortBy('probability')}
                className={`hover:text-electric-blue transition-colors ${
                  sortBy === 'probability' ? 'text-electric-blue' : ''
                }`}
              >
                Risk Score
              </button>
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Source</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Destination</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Port</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Protocol</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400"></th>
          </tr>
        </thead>
        <tbody>
          {flows.map((flow, idx) => (
            <motion.tr
              key={idx}
              className="border-b border-gray-800 hover:bg-electric-blue hover:bg-opacity-5 transition-colors cursor-pointer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() =>
                setExpandedRow(expandedRow === idx ? null : idx)
              }
            >
              <td className="py-4 px-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStageColor(flow.stage)}`}>
                  {flow.stage}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getRiskBarColor(flow.riskScore)}`}
                      style={{ width: `${flow.riskScore * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-sm">
                    {(flow.riskScore * 100).toFixed(0)}%
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 text-sm text-gray-300 font-mono">
                {flow.src_ip}
              </td>
              <td className="py-4 px-4 text-sm text-gray-300 font-mono">
                {flow.dst_ip}
              </td>
              <td className="py-4 px-4 text-sm text-gray-300 font-mono">
                {flow.dst_port}
              </td>
              <td className="py-4 px-4 text-sm text-gray-300">
                {flow.protocol}
              </td>
              <td className="py-4 px-4 text-right">
                <motion.div
                  animate={{ rotate: expandedRow === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Expanded Row Details */}
      {expandedRow !== null && (
        <motion.div
          className="bg-electric-blue bg-opacity-5 border border-electric-blue border-opacity-20 p-6 rounded-lg mt-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-electric-blue mb-4">Flow Details</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div>
                  <span className="text-gray-400">Source IP:</span>{' '}
                  <span className="font-mono">{flows[expandedRow].src_ip}:{flows[expandedRow].src_port}</span>
                </div>
                <div>
                  <span className="text-gray-400">Destination IP:</span>{' '}
                  <span className="font-mono">{flows[expandedRow].dst_ip}:{flows[expandedRow].dst_port}</span>
                </div>
                <div>
                  <span className="text-gray-400">Protocol:</span> {flows[expandedRow].protocol}
                </div>
                <div>
                  <span className="text-gray-400">Bytes Transferred:</span> {flows[expandedRow].bytes}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-electric-blue mb-4">Risk Analysis</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div>
                  <span className="text-gray-400">Risk Score:</span>{' '}
                  <span className="font-bold">{(flows[expandedRow].riskScore * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Predicted Stage:</span>{' '}
                  <span className="font-bold text-electric-blue">{flows[expandedRow].stage}</span>
                </div>
                <div>
                  <span className="text-gray-400">Anomaly Indicators:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  {flows[expandedRow].indicators.map((indicator, idx) => (
                    <li key={idx}>{indicator}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function getStageColor(stage) {
  const colors = {
    'Reconnaissance': 'bg-blue-900 bg-opacity-30 text-blue-400 border border-blue-500 border-opacity-30',
    'Initial Access':
      'bg-cyan-900 bg-opacity-30 text-cyan-400 border border-cyan-500 border-opacity-30',
    'Lateral Movement':
      'bg-amber-900 bg-opacity-30 text-amber-400 border border-amber-500 border-opacity-30',
    'Command & Control':
      'bg-red-900 bg-opacity-30 text-red-400 border border-red-500 border-opacity-30',
    'Exfiltration':
      'bg-red-950 bg-opacity-40 text-red-300 border border-red-500 border-opacity-30',
  }
  return colors[stage] || colors['Reconnaissance']
}

function getRiskBarColor(score) {
  if (score < 0.2) return 'bg-green-500'
  if (score < 0.4) return 'bg-yellow-500'
  if (score < 0.6) return 'bg-orange-500'
  if (score < 0.8) return 'bg-red-500'
  return 'bg-red-700'
}

function generateSampleFlows(predictions, sortBy) {
  const stages = predictions.mitre_stages
  const probabilities = predictions.lstm_probabilities

  // Create sample flows from predictions
  const flows = []

  for (let i = Math.max(0, stages.length - 10); i < stages.length; i++) {
    flows.push({
      src_ip: generateIP(),
      dst_ip: generateIP(),
      src_port: Math.floor(Math.random() * 65535),
      dst_port: [22, 445, 135, 139, 3389, 5985, 5986, 80, 443][
        Math.floor(Math.random() * 9)
      ],
      protocol: Math.random() > 0.7 ? 'UDP' : 'TCP',
      bytes: Math.floor(Math.random() * 1000000),
      riskScore: probabilities[i],
      stage: stages[i],
      indicators: generateIndicators(stages[i]),
    })
  }

  // Sort
  if (sortBy === 'probability') {
    flows.sort((a, b) => b.riskScore - a.riskScore)
  } else if (sortBy === 'stage') {
    flows.sort((a, b) => a.stage.localeCompare(b.stage))
  }

  return flows
}

function generateIP() {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
}

function generateIndicators(stage) {
  const indicatorMap = {
    'Reconnaissance': [
      'Port scanning detected',
      'Unusual number of connection attempts',
      'Service version probing',
    ],
    'Initial Access': [
      'Potential exploit attempt',
      'Suspicious payload detected',
      'Failed login attempts spike',
    ],
    'Lateral Movement': [
      'SMB traffic detected',
      'RDP connection to internal IP',
      'Suspicious DNS queries',
    ],
    'Command & Control': [
      'Beaconing pattern detected',
      'DNS tunneling signature',
      'Unusual outbound connections',
    ],
    'Exfiltration': [
      'Large data transfer initiated',
      'Compression/encryption activity',
      'Outbound to suspicious domain',
    ],
  }
  return indicatorMap[stage] || ['Unknown activity']
}

export default FlaggedFlowsTable
