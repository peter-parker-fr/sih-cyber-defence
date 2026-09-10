import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, AlertCircle, CheckCircle2, Loader } from 'lucide-react'
import FileUpload from '../components/FileUpload'
import ProbabilityTimeline from '../components/charts/ProbabilityTimeline'
import MitreStageTimeline from '../components/charts/MitreStageTimeline'
import FlaggedFlowsTable from '../components/tables/FlaggedFlowsTable'
import ExplainabilityPanel from '../components/ExplainabilityPanel'

function Dashboard({ modelReady }) {
  const [predictions, setPredictions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const fileInputRef = useRef(null)

  const handleFileUpload = async (file) => {
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setPredictions(data)
      setLoading(false)
    } catch (err) {
      console.error('Prediction error:', err)
      setError(err.message || 'Failed to process predictions')
      setLoading(false)
    }
  }

  const loadSampleData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/sample-analysis')
      if (!response.ok) throw new Error('Failed to load sample data')
      
      const data = await response.json()
      
      // Mock predictions structure for demo
      setPredictions({
        status: 'success',
        predictions: data.predictions,
        explainability: {
          top_features: data.predictions.top_features,
          feature_names: data.predictions.feature_names
        },
        inference_time_ms: 234.5,
        flows_analyzed: 85
      })
      setLoading(false)
    } catch (err) {
      console.error('Sample load error:', err)
      setError(err.message || 'Failed to load sample data')
      setLoading(false)
    }
  }

  const downloadSampleCSV = async () => {
    try {
      const response = await fetch('http://localhost:8000/sample-data')
      const data = await response.json()
      
      // Create blob and download
      const csv = data.data || 'sample,data'
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'sample_network_traffic.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
      setError('Failed to download sample data')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy-light to-navy py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            Threat Prediction <span className="text-electric-blue">Dashboard</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Upload network traffic data and get real-time infiltration predictions with MITRE ATT&CK stage mapping.
          </p>
        </motion.div>

        {/* Status */}
        {!modelReady && (
          <motion.div
            className="mb-8 glass-card p-4 border-l-4 border-alert-amber rounded-lg flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-alert-amber flex-shrink-0" />
            <div>
              <p className="font-semibold text-alert-amber">Model Loading</p>
              <p className="text-sm text-gray-300">Backend is initializing. This may take a moment on first run.</p>
            </div>
          </motion.div>
        )}

        {/* Upload Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* File Upload */}
          <div className="lg:col-span-2">
            <FileUpload
              onFileSelect={handleFileUpload}
              loading={loading}
              disabled={!modelReady}
            />
          </div>

          {/* Quick Actions */}
          <motion.div
            className="glass-card p-6 rounded-xl space-y-4"
            whileHover={{ y: -2 }}
          >
            <h3 className="text-lg font-bold text-electric-blue mb-4">Quick Actions</h3>
            
            <motion.button
              onClick={loadSampleData}
              disabled={!modelReady || loading}
              className="w-full py-3 px-4 rounded-lg bg-electric-blue-dark hover:bg-electric-blue text-white font-semibold transition-all disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <Loader className="w-4 h-4 inline animate-spin mr-2" />
              ) : (
                <>📊 Load Sample Data</>
              )}
            </motion.button>

            <motion.button
              onClick={downloadSampleCSV}
              className="w-full py-3 px-4 rounded-lg border-2 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-navy font-semibold transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Download Template
            </motion.button>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                <span className="block font-semibold mb-2">Expected Format:</span>
                CSV with columns: src_ip, dst_ip, src_port, dst_port, protocol, bytes, packets, duration, tcp_flags, iat_mean, iat_var, iat_max
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            className="mb-8 glass-card p-4 border-l-4 border-alert-red rounded-lg flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-alert-red flex-shrink-0" />
            <div>
              <p className="font-semibold text-alert-red">Error</p>
              <p className="text-sm text-gray-300">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {predictions && (
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {/* Metrics Summary */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <MetricCard
                title="Avg. Infiltration"
                value={`${(predictions.predictions.average_infiltration_probability * 100).toFixed(1)}%`}
                icon={<CheckCircle2 className="w-5 h-5" />}
                color="blue"
              />
              <MetricCard
                title="Max Probability"
                value={`${(predictions.predictions.max_infiltration_probability * 100).toFixed(1)}%`}
                icon={<AlertCircle className="w-5 h-5" />}
                color="amber"
              />
              <MetricCard
                title="Flows Analyzed"
                value={predictions.flows_analyzed}
                icon={<Upload className="w-5 h-5" />}
                color="blue"
              />
              <MetricCard
                title="Inference Time"
                value={`${predictions.inference_time_ms}ms`}
                icon={<Loader className="w-5 h-5" />}
                color="green"
              />
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                className="glass-card p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-bold mb-6 text-electric-blue">Infiltration Probability Timeline</h3>
                <ProbabilityTimeline
                  data={predictions.predictions}
                  onPointSelect={setSelectedIndex}
                  selectedIndex={selectedIndex}
                />
              </motion.div>

              <motion.div
                className="glass-card p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold mb-6 text-electric-blue">MITRE ATT&CK Stage Timeline</h3>
                <MitreStageTimeline
                  stages={predictions.predictions.mitre_stages}
                />
              </motion.div>
            </div>

            {/* Explainability */}
            <motion.div
              className="glass-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-6 text-electric-blue">Explainability Panel</h3>
              <ExplainabilityPanel
                predictions={predictions}
                selectedIndex={selectedIndex}
              />
            </motion.div>

            {/* Flagged Flows Table */}
            <motion.div
              className="glass-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-6 text-electric-blue">Suspicious Flows</h3>
              <FlaggedFlowsTable
                predictions={predictions.predictions}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="loader mb-4"></div>
            <p className="text-gray-300 text-lg">Processing predictions...</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, color }) {
  const colorMap = {
    blue: 'border-electric-blue',
    amber: 'border-alert-amber',
    green: 'border-green-500',
    red: 'border-alert-red'
  }

  return (
    <motion.div
      className={`glass-card p-4 rounded-lg border-l-4 ${colorMap[color]}`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-electric-blue opacity-30">{icon}</div>
      </div>
    </motion.div>
  )
}

export default Dashboard
