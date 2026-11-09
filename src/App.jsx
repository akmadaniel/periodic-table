import { useEffect, useState } from 'react'
import PeriodicScene from './PeriodicScene'
import { fetchPeople } from './sheet'

const KEY = 'gtoken'

export default function App() {
  const [people, setPeople] = useState(null)
  const [error, setError] = useState('')

  const load = (token) =>
    fetchPeople(token).then(setPeople).catch((e) => { sessionStorage.removeItem(KEY); setError(e.message) })

  // reuse the saved token after a refresh, until it expires
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null')
    if (saved && saved.exp > Date.now()) load(saved.token)
  }, [])

  const signIn = () => {
    google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      callback: (r) => {
        if (r.error) return setError(r.error)
        sessionStorage.setItem(KEY, JSON.stringify({ token: r.access_token, exp: Date.now() + (r.expires_in - 60) * 1000 }))
        load(r.access_token)
      },
    }).requestAccessToken()
  }

  if (people) return <PeriodicScene people={people} />
  return (
    <div className="login">
      <div>
        <h2>Welcome Back</h2>
        <p>Sign in with your Google account to view the data.</p>
        <button onClick={signIn}>Sign in with Google</button>
        {error && <p style={{ color: 'crimson', marginTop: 16 }}>{error}</p>}
      </div>
    </div>
  )
}
