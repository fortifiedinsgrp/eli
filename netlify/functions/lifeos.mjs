// Netlify Function to proxy LifeOS API calls with authentication
import { GoogleAuth } from 'google-auth-library'

const LIFEOS_BASE_URL = 'https://us-central1-captains-log-cd158.cloudfunctions.net'

export async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  }

  try {
    // Parse service account from environment
    const serviceAccount = JSON.parse(process.env.LIFEOS_SERVICE_ACCOUNT || '{}')
    
    if (!serviceAccount.private_key) {
      throw new Error('LIFEOS_SERVICE_ACCOUNT not configured')
    }

    // Get the endpoint from the path
    // Path will be like /.netlify/functions/lifeos/getCompanies
    const pathParts = event.path.split('/lifeos')
    const endpoint = pathParts[1] || ''
    const queryString = event.rawQuery ? `?${event.rawQuery}` : ''
    const targetUrl = `${LIFEOS_BASE_URL}${endpoint}${queryString}`
    
    // Create auth client and get ID token
    const auth = new GoogleAuth({
      credentials: serviceAccount,
    })
    
    const client = await auth.getIdTokenClient(targetUrl.split('?')[0])
    const idToken = await client.idTokenProvider.fetchIdToken(targetUrl.split('?')[0])
    
    // Proxy the request
    const fetchOptions = {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
    }
    
    if (event.body && event.httpMethod !== 'GET') {
      fetchOptions.body = event.body
    }
    
    const response = await fetch(targetUrl, fetchOptions)
    const data = await response.json()
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    }
  } catch (error) {
    console.error('LifeOS proxy error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    }
  }
}
