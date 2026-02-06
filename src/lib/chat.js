// OpenClaw Chat Service
import { config } from './config'

class ChatService {
  constructor() {
    this.ws = null
    this.listeners = new Set()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    this.sessionKey = 'agent:main:googlechat:dm:eli-dashboard'
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      try {
        // Connect to OpenClaw gateway WebSocket
        const wsUrl = new URL(config.openclaw.wsUrl)
        if (config.openclaw.token) {
          wsUrl.searchParams.set('token', config.openclaw.token)
        }
        
        this.ws = new WebSocket(wsUrl.toString())

        this.ws.onopen = () => {
          console.log('Connected to OpenClaw')
          this.reconnectAttempts = 0
          this.notify({ type: 'connected' })
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.notify({ type: 'message', data })
          } catch (e) {
            console.error('Failed to parse message:', e)
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.notify({ type: 'error', error })
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('Disconnected from OpenClaw')
          this.notify({ type: 'disconnected' })
          this.attemptReconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)
    setTimeout(() => this.connect(), delay)
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(message) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to OpenClaw')
    }

    const payload = {
      type: 'message',
      sessionKey: this.sessionKey,
      content: message,
    }

    this.ws.send(JSON.stringify(payload))
  }

  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notify(event) {
    this.listeners.forEach(callback => callback(event))
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const chatService = new ChatService()

// React hook for chat
export function useChat() {
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = chatService.subscribe((event) => {
      switch (event.type) {
        case 'connected':
          setIsConnected(true)
          break
        case 'disconnected':
          setIsConnected(false)
          break
        case 'message':
          if (event.data.role === 'assistant') {
            setMessages(prev => [...prev, {
              id: Date.now(),
              role: 'assistant',
              content: event.data.content,
              timestamp: new Date()
            }])
            setIsLoading(false)
          }
          break
      }
    })

    chatService.connect().catch(console.error)

    return () => {
      unsubscribe()
    }
  }, [])

  const sendMessage = async (content) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      chatService.send(content)
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsLoading(false)
    }
  }

  return {
    messages,
    isConnected,
    isLoading,
    sendMessage,
  }
}

// Need to import useState and useEffect for the hook
import { useState, useEffect } from 'react'
