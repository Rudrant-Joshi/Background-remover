import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

const isPlaceholder = 
  supabaseUrl.includes('placeholder-project') || 
  supabaseUrl.includes('your-project') ||
  supabaseAnonKey.includes('your-supabase-anon-key') ||
  supabaseAnonKey.includes('placeholder-anon-key')

if (isPlaceholder) {
  console.warn('SnapCut AI running in Sandbox Mock Mode. Configure real Supabase keys in .env to connect live database.')
}

// ----------------------------------------------------
// Mock Supabase Auth & DB implementation for Sandbox
// ----------------------------------------------------
const mockAuth = {
  session: null,
  listeners: [],
  
  onAuthStateChange(callback) {
    this.listeners.push(callback)
    // Send initial event
    setTimeout(() => {
      const storedUser = localStorage.getItem('snapcut_mock_user')
      if (storedUser) {
        const userObj = JSON.parse(storedUser)
        this.session = { user: userObj, access_token: 'mock-jwt-token' }
        callback('SIGNED_IN', this.session)
      } else {
        callback('SIGNED_OUT', null)
      }
    }, 100)
    
    return {
      data: {
        subscription: {
          unsubscribe() {
            mockAuth.listeners = mockAuth.listeners.filter(c => c !== callback)
          }
        }
      }
    }
  },

  async getSession() {
    const storedUser = localStorage.getItem('snapcut_mock_user')
    if (storedUser) {
      const userObj = JSON.parse(storedUser)
      this.session = { user: userObj, access_token: 'mock-jwt-token' }
      return { data: { session: this.session }, error: null }
    }
    return { data: { session: null }, error: null }
  },

  async signInWithPassword({ email, password }) {
    if (!email || !password) {
      return { data: null, error: new Error('Email and password required') }
    }
    
    const users = JSON.parse(localStorage.getItem('snapcut_mock_users') || '[]')
    const match = users.find(u => u.email === email)
    
    if (!match) {
      return { data: null, error: new Error('Authentication failed: user does not exist. Please register first!') }
    }

    if (match.password !== password) {
      return { data: null, error: new Error('Authentication failed: incorrect password.') }
    }

    localStorage.setItem('snapcut_mock_user', JSON.stringify(match))
    this.session = { user: match, access_token: 'mock-jwt-token' }
    this.notifyListeners('SIGNED_IN', this.session)
    return { data: { user: match, session: this.session }, error: null }
  },

  async signUp({ email, password, options }) {
    if (!email || !password) {
      return { data: null, error: new Error('Email and password required') }
    }
    const users = JSON.parse(localStorage.getItem('snapcut_mock_users') || '[]')
    if (users.some(u => u.email === email)) {
      return { data: null, error: new Error('User already exists') }
    }

    const newUser = { 
      id: 'mock-uuid-' + Math.random().toString(36).substring(2, 11), 
      email, 
      password, // Save password for validation
      raw_user_meta_data: options?.data || {} 
    }
    users.push(newUser)
    localStorage.setItem('snapcut_mock_users', JSON.stringify(users))

    // Automatically sign in the user for mock mode sandbox to make testing easier
    localStorage.setItem('snapcut_mock_user', JSON.stringify(newUser))
    this.session = { user: newUser, access_token: 'mock-jwt-token' }
    setTimeout(() => {
      this.notifyListeners('SIGNED_IN', this.session)
    }, 50)

    return { data: { user: newUser, session: this.session }, error: null }
  },

  async signOut() {
    localStorage.removeItem('snapcut_mock_user')
    this.session = null
    this.notifyListeners('SIGNED_OUT', null)
    return { error: null }
  },

  async resetPasswordForEmail(email) {
    if (!email) {
      return { data: null, error: new Error('Email is required') }
    }
    const users = JSON.parse(localStorage.getItem('snapcut_mock_users') || '[]')
    const match = users.find(u => u.email === email)
    if (!match) {
      return { data: null, error: new Error('Authentication failed: user does not exist with this email.') }
    }
    sessionStorage.setItem('snapcut_mock_reset_email', email)
    alert(`[Sandbox Mode Reset Link]\nWe've simulated sending a recovery email to ${email}.\n\nClick OK to be redirected to the Reset Password page.`)
    window.location.href = '/reset-password'
    return { data: {}, error: null }
  },

  async updateUser({ password }) {
    if (!password) {
      return { data: null, error: new Error('Password is required') }
    }
    
    // Find who is updating the password
    let email = null
    const storedUser = localStorage.getItem('snapcut_mock_user')
    if (storedUser) {
      email = JSON.parse(storedUser).email
    } else {
      email = sessionStorage.getItem('snapcut_mock_reset_email')
    }

    if (!email) {
      return { data: null, error: new Error('No user session or reset request found to update password.') }
    }

    const users = JSON.parse(localStorage.getItem('snapcut_mock_users') || '[]')
    const userIndex = users.findIndex(u => u.email === email)
    if (userIndex === -1) {
      return { data: null, error: new Error('User not found.') }
    }

    // Update password
    users[userIndex].password = password
    localStorage.setItem('snapcut_mock_users', JSON.stringify(users))

    // If logged in, update the session user
    if (storedUser) {
      localStorage.setItem('snapcut_mock_user', JSON.stringify(users[userIndex]))
      this.session = { user: users[userIndex], access_token: 'mock-jwt-token' }
    } else {
      sessionStorage.removeItem('snapcut_mock_reset_email')
    }

    return { data: { user: users[userIndex] }, error: null }
  },

  async signInWithOAuth({ provider, options }) {
    if (provider !== 'google') {
      return { data: null, error: new Error('Unsupported OAuth provider') }
    }
    const email = prompt('Enter your Google email ID to continue with Google:')
    if (email === null) {
      return { data: null, error: new Error('Google sign-in cancelled') }
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      return { data: null, error: new Error('Invalid email ID format') }
    }

    const users = JSON.parse(localStorage.getItem('snapcut_mock_users') || '[]')
    let match = users.find(u => u.email === email)
    if (!match) {
      match = { 
        id: 'mock-google-' + Math.random().toString(36).substring(2, 11), 
        email, 
        raw_user_meta_data: { full_name: email.split('@')[0] } 
      }
      users.push(match)
      localStorage.setItem('snapcut_mock_users', JSON.stringify(users))
    }

    localStorage.setItem('snapcut_mock_user', JSON.stringify(match))
    this.session = { user: match, access_token: 'mock-jwt-token' }
    this.notifyListeners('SIGNED_IN', this.session)
    window.location.href = '/dashboard'
    return { data: { user: match, session: this.session }, error: null }
  },

  notifyListeners(event, session) {
    this.listeners.forEach(callback => callback(event, session))
  }
}

const mockDb = {
  from(table) {
    return {
      _table: table,
      _action: 'select',
      _payload: null,
      _column: null,
      _value: null,
      
      select(columns, options) {
        if (this._action !== 'insert' && this._action !== 'update') {
          this._action = 'select'
        }
        return this
      },
      insert(payload) {
        this._action = 'insert'
        this._payload = payload
        return this
      },
      update(payload) {
        this._action = 'update'
        this._payload = payload
        return this
      },
      eq(column, value) {
        this._column = column
        this._value = value
        return this
      },
      gte(column, value) {
        return this
      },
      order(column, options) {
        return this
      },
      limit(number) {
        return this
      },
      range(from, to) {
        return this
      },
      async single() {
        const result = await this.execute()
        return { data: Array.isArray(result) ? result[0] : result, error: null }
      },
      async execute() {
        let user = null
        try {
          const userStr = localStorage.getItem('snapcut_mock_user')
          if (userStr) {
            user = JSON.parse(userStr)
          } else {
            const authStr = localStorage.getItem('snapcut-auth')
            if (authStr) {
              const parsed = JSON.parse(authStr)
              if (parsed?.state?.user) {
                user = parsed.state.user
              }
            }
          }
        } catch (e) {
          console.error('Error parsing mock user:', e)
        }
        if (!user) {
          user = { id: 'mock-uuid-default' }
        }
        
        if (this._table === 'profiles') {
          const creditsKey = `snapcut_mock_credits_${user.id}`
          const creditsStr = localStorage.getItem(creditsKey)
          const creditsObj = creditsStr ? JSON.parse(creditsStr) : {
            user_id: user.id,
            plan: 'free',
            total_credits: 5,
            used_credits: 0,
            reset_date: new Date().toISOString().split('T')[0]
          }
          const profile = { 
            id: user.id, 
            email: user.email, 
            full_name: user.full_name || 'Sandbox Developer', 
            role: 'admin', 
            created_at: new Date().toISOString(),
            credits: [creditsObj]
          }
          return this._action === 'select' ? [profile] : profile
        }
        if (this._table === 'credits') {
          const creditsKey = `snapcut_mock_credits_${user.id}`
          let credits = localStorage.getItem(creditsKey)
          if (!credits) {
            credits = JSON.stringify({
              user_id: user.id,
              plan: 'free',
              total_credits: 5,
              used_credits: 0,
              reset_date: new Date().toISOString().split('T')[0]
            })
            localStorage.setItem(creditsKey, credits)
          }
          let creditsObj = JSON.parse(credits)
          if (this._action === 'update' && this._payload) {
            creditsObj = { ...creditsObj, ...this._payload }
            localStorage.setItem(creditsKey, JSON.stringify(creditsObj))
          }
          return creditsObj
        }
        if (this._table === 'subscriptions') {
          return { user_id: user.id, plan: 'free', status: 'active' }
        }
        if (this._table === 'uploads') {
          const uploadsKey = `snapcut_mock_uploads_${user.id}`
          let uploads = JSON.parse(localStorage.getItem(uploadsKey) || '[]')

          if (this._action === 'insert' && this._payload) {
            const payloads = Array.isArray(this._payload) ? this._payload : [this._payload]
            const newRecords = payloads.map(item => ({
              id: item.id || 'mock-upload-' + Math.random().toString(36).substring(2, 11),
              user_id: user.id,
              original_url: item.original_url || '',
              result_url: item.result_url || '',
              original_filename: item.original_filename || '',
              file_size: item.file_size || 0,
              status: item.status || 'pending',
              created_at: item.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
              cloudinary_original_id: item.cloudinary_original_id || '',
              cloudinary_result_id: item.cloudinary_result_id || ''
            }))
            uploads = [...newRecords, ...uploads]
            localStorage.setItem(uploadsKey, JSON.stringify(uploads))
            return Array.isArray(this._payload) ? newRecords : newRecords[0]
          }

          if (this._action === 'update' && this._payload) {
            uploads = uploads.map(item => {
              if (this._column && item[this._column] === this._value) {
                return {
                  ...item,
                  ...this._payload,
                  updated_at: new Date().toISOString()
                }
              }
              return item
            })
            localStorage.setItem(uploadsKey, JSON.stringify(uploads))
            const updated = uploads.filter(item => this._column && item[this._column] === this._value)
            return Array.isArray(this._payload) ? updated : updated[0]
          }

          // select/read
          let filtered = uploads
          if (this._column && this._value) {
            filtered = filtered.filter(item => item[this._column] === this._value)
          }
          return filtered
        }
        if (this._table === 'api_keys') {
          return [
            { id: '1', name: 'Production App API Key', key_prefix: 'sk_live_abc123', total_requests: 480, is_active: true }
          ]
        }
        if (this._table === 'transactions') {
          return [
            { id: 'tx_1', amount: 19900, status: 'completed', plan: '100 Credits Pack', created_at: new Date().toISOString() }
          ]
        }
        if (this._table === 'admin_stats') {
          return { total_users: 1420, uploads_today: 450, total_completed: 18240, total_revenue: 12500000, pro_subscribers: 240 }
        }
        return []
      },
      then(onfulfilled) {
        return this.execute().then(data => onfulfilled({ data, error: null }))
      }
    }
  }
}

// Export either real client or local mock client depending on placeholders
export const supabase = isPlaceholder ? {
  auth: mockAuth,
  from: mockDb.from.bind(mockDb),
} : createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export default supabase
