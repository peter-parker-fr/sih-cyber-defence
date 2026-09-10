import React from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function ExplainabilityPanel({ predictions, selectedIndex }) {
  const topFeatures = predictions.explainability.top_features[selectedIndex] || []
  const stage = predictions.predictions.mitre_stages[selectedIndex] || 'Unknown'
  const probability = predictions.predictions.lstm_probabilities[selectedIndex] || 0

  // Prepare data for chart
  const chartData = topFeatures.map(([feature, weight]) => ({
    name: formatFeatureName(feature),
    weight: weight,
    fullName: feature,
  }))

  const explanation = generateExplanation(topFeatures, stage, probability)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-lg border border-gray-700">
          <p className="text-sm">{payload[0].payload.fullName}</p>
          <p className="text-sm font-bold text-electric-blue">
            Weight: {(payload[0].value * 100).toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Risk Indicator */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm text-gray-400">Infiltration Probability</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-electric-blue to-alert-red"
                initial={{ width: 0 }}
                animate={{ width: `${probability * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <span className="font-bold text-lg">{(probability * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm text-gray-400">Predicted Stage</p>
          <p className="mt-2 text-lg font-bold text-electric-blue">{stage}</p>
        </div>

        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm text-gray-400">Risk Level</p>
          <p className="mt-2 text-lg font-bold">
            {getRiskLevel(probability)}
          </p>
        </div>
      </motion.div>

      {/* Top Contributing Features Chart */}
      <motion.div
        className="glass-card p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h4 className="text-lg font-bold mb-4 text-electric-blue">Top Contributing Features</h4>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="weight"
                fill="#00D4FF"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-8">No features available</p>
        )}
      </motion.div>

      {/* Natural Language Explanation */}
      <motion.div
        className="glass-card p-6 rounded-xl border-l-4 border-electric-blue"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="text-lg font-bold mb-4 text-electric-blue">Analysis Summary</h4>
        <p className="text-gray-300 leading-relaxed">
          {explanation}
        </p>
      </motion.div>

      {/* Feature Details Table */}
      <motion.div
        className="glass-card p-6 rounded-xl overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="text-lg font-bold mb-4 text-electric-blue">Detailed Feature Weights</h4>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Feature</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Importance Weight</th>
            </tr>
          </thead>
          <tbody>
            {topFeatures.map(([feature, weight], idx) => (
              <motion.tr
                key={idx}
                className="border-b border-gray-800 hover:bg-electric-blue hover:bg-opacity-5 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <td className="py-3 px-4 text-sm text-gray-300">{formatFeatureName(feature)}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-electric-blue"
                        style={{ width: `${weight * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold text-electric-blue text-sm w-12 text-right">
                      {(weight * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}

function formatFeatureName(feature) {
  return feature
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getRiskLevel(probability) {
  if (probability < 0.2) return '🟢 Low'
  if (probability < 0.4) return '🟡 Medium'
  if (probability < 0.6) return '🟠 High'
  if (probability < 0.8) return '🔴 Critical'
  return '⚫ Severe'
}

function generateExplanation(features, stage, probability) {
  if (features.length === 0) {
    return 'No significant features detected. Activity appears to be within normal parameters.'
  }

  const topFeature = features[0][0]
  const riskLevel = getRiskLevel(probability).replace(/[🟢🟡🟠🔴⚫]/g, '').trim()

  const stageTexts = {
    'Reconnaissance': 'suggests early-stage reconnaissance activity where the attacker is scanning and probing the network',
    'Initial Access': 'indicates potential exploitation attempts to gain initial access to the network',
    'Lateral Movement': 'suggests the attacker is moving sideways within the network to reach additional systems',
    'Command & Control': 'indicates the presence of command and control communications typical of compromised systems',
    'Exfiltration': 'suggests data exfiltration activity with large outbound transfers to external destinations',
  }

  const explanation = `The model predicts a ${riskLevel} threat level (${(probability * 100).toFixed(1)}%) with classification as ${stage}. This ${stageTexts[stage]}. The primary indicator is elevated ${formatFeatureName(topFeature)} activity, which is abnormal compared to baseline traffic patterns. Immediate investigation is recommended.`

  return explanation
}

export default ExplainabilityPanel
