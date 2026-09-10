import React from 'react'
import { motion } from 'framer-motion'

const MITRE_STAGES = [
  'Reconnaissance',
  'Initial Access',
  'Lateral Movement',
  'Command & Control',
  'Exfiltration',
]

const STAGE_COLORS = {
  'Reconnaissance': 'from-blue-600 to-blue-400',
  'Initial Access': 'from-cyan-600 to-cyan-400',
  'Lateral Movement': 'from-amber-600 to-amber-400',
  'Command & Control': 'from-red-600 to-red-400',
  'Exfiltration': 'from-red-700 to-red-500',
}

const STAGE_BG_COLORS = {
  'Reconnaissance': 'bg-blue-900 bg-opacity-20',
  'Initial Access': 'bg-cyan-900 bg-opacity-20',
  'Lateral Movement': 'bg-amber-900 bg-opacity-20',
  'Command & Control': 'bg-red-900 bg-opacity-20',
  'Exfiltration': 'bg-red-950 bg-opacity-40',
}

function MitreStageTimeline({ stages }) {
  // Count occurrences of each stage
  const stageCounts = {}
  stages.forEach(stage => {
    stageCounts[stage] = (stageCounts[stage] || 0) + 1
  })

  // Get stage distribution as percentages
  const stageDistribution = {}
  MITRE_STAGES.forEach(stage => {
    stageDistribution[stage] = ((stageCounts[stage] || 0) / stages.length) * 100
  })

  // Get the most recent stage
  const latestStage = stages[stages.length - 1] || 'Reconnaissance'

  return (
    <div className="space-y-6">
      {/* Timeline visualization */}
      <div className="space-y-2">
        {MITRE_STAGES.map((stage, idx) => {
          const percentage = stageDistribution[stage]
          const isActive = latestStage === stage

          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-300 truncate">
                  {stage}
                </div>
                <div className="flex-1">
                  <div className={`h-8 rounded-lg ${STAGE_BG_COLORS[stage]} border border-opacity-30 border-gray-600 overflow-hidden`}>
                    <motion.div
                      className={`h-full bg-gradient-to-r ${STAGE_COLORS[stage]} rounded-lg flex items-center justify-center text-sm font-bold text-white`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                      {percentage > 5 && `${percentage.toFixed(0)}%`}
                    </motion.div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-semibold text-gray-300">
                  {stageCounts[stage] || 0}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Current stage indicator */}
      <motion.div
        className="mt-8 pt-6 border-t border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Current Threat Stage:</span>
          <motion.div
            className={`px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r ${STAGE_COLORS[latestStage]}`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {latestStage}
          </motion.div>
        </div>
      </motion.div>

      {/* Stage description */}
      <motion.div
        className="p-4 glass-card rounded-lg border-l-4 border-electric-blue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-electric-blue">Stage Insight:</span> {getStageDescription(latestStage)}
        </p>
      </motion.div>
    </div>
  )
}

function getStageDescription(stage) {
  const descriptions = {
    'Reconnaissance': 'Attacker is gathering information about the target. High port scan activity and unusual connection patterns.',
    'Initial Access': 'Attacker is attempting to gain initial foothold. Watch for exploitation attempts on vulnerable services.',
    'Lateral Movement': 'Attacker is moving within the network. Elevated internal traffic and SMB/RDP activity detected.',
    'Command & Control': 'Attacker is establishing command channels. Beaconing patterns and suspicious outbound connections observed.',
    'Exfiltration': 'Attacker is stealing data. Large outbound data transfers to external destinations detected.',
  }
  return descriptions[stage] || 'Unknown stage'
}

export default MitreStageTimeline
