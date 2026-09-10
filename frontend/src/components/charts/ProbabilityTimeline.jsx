import React from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from 'recharts'

function ProbabilityTimeline({ data, onPointSelect, selectedIndex }) {
  // Prepare chart data
  const chartData = data.lstm_probabilities.map((prob, idx) => ({
    index: idx,
    lstm: prob,
    baseline: data.baseline_probabilities[idx],
    timestamp: new Date(data.timestamps[idx]).toLocaleTimeString(),
  }))

  const handleClick = (data) => {
    onPointSelect(data.index)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-lg border border-gray-700">
          <p className="text-sm text-electric-blue">{payload[0].payload.timestamp}</p>
          <p className="text-sm">
            <span className="text-electric-blue">LSTM:</span>{' '}
            <span className="font-bold">{(payload[0].value * 100).toFixed(1)}%</span>
          </p>
          {payload[1] && (
            <p className="text-sm">
              <span className="text-gray-300">Baseline:</span>{' '}
              <span className="font-bold">{(payload[1].value * 100).toFixed(1)}%</span>
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <defs>
          <linearGradient id="colorLstm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="index"
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          domain={[0, 1]}
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <ReferenceLine
          y={0.5}
          stroke="#FFA500"
          strokeDasharray="5 5"
          label={{ value: 'Threshold', fill: '#FFA500', fontSize: 12 }}
        />
        <Area
          type="monotone"
          dataKey="lstm"
          stroke="#00D4FF"
          fill="url(#colorLstm)"
          name="LSTM Model"
          onClick={handleClick}
        />
        <Line
          type="monotone"
          dataKey="baseline"
          stroke="#3B82F6"
          name="Baseline (LogReg)"
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default ProbabilityTimeline
