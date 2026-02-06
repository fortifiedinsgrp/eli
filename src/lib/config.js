// Configuration for API connections

export const config = {
  // OpenClaw Gateway
  openclaw: {
    // WebSocket URL - adjust based on deployment
    wsUrl: import.meta.env.VITE_OPENCLAW_WS_URL || 'wss://desktop-nh1opms-1.tail4cec8b.ts.net/ws',
    token: import.meta.env.VITE_OPENCLAW_TOKEN || '',
  },
  
  // LifeOS API
  lifeos: {
    baseUrl: import.meta.env.VITE_LIFEOS_URL || 'https://us-central1-captains-log-cd158.cloudfunctions.net',
  },
  
  // Firebase (for document storage)
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: 'captains-log-cd158.firebaseapp.com',
    projectId: 'captains-log-cd158',
    storageBucket: 'captains-log-cd158.appspot.com',
  }
}
