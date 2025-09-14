// Vercel Serverless Function for Health Check
export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: 'SportsPickMind API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0'
  });
}
