import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Authentication(props) {
  const { handleCloseModal } = props
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAutenticating, setIsAuthenticating] = useState(false)
  const [isRegistration, setIsRegistration] = useState(false)
  const [error, setError] = useState(null)

  const { signup, login } = useAuth()

  async function handleAuthentication() {
    // edge case
    if (
      !email ||
      !email.includes('@') ||
      !password ||
      password.length < 6 ||
      isAutenticating
    )
      return
    // get the user on board
    try {
      setIsAuthenticating(true)
      setError(null)
      if (isRegistration) {
        // sign-up
        await signup(email, password)
      } else {
        // sign-in
        await login(email, password)
      }
      handleCloseModal()
    } catch (err) {
      console.log(err.message)
      setError(err.message)
    } finally {
      setIsAuthenticating(false)
    }
  }

  return (
    <>
      <h2 className="sign-up-text">{isRegistration ? 'Sign Up' : 'Login'}</h2>
      <p>
        {isRegistration
          ? 'Enter your details to make a new account!'
          : 'Sign into your account!'}
      </p>
      {error && (
        <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
          ❌ {error}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuthentication}>
        <p>{isAutenticating ? 'Authenticating...' : 'Submit'}</p>
      </button>
      <hr />
      <div className="register-content">
        <p>
          {isRegistration
            ? 'Already Have an account?'
            : "Don't have an account?"}
        </p>
        <button onClick={() => setIsRegistration((prev) => !prev)}>
          <p>{isRegistration ? 'Login' : 'Sign Up'}</p>
        </button>
      </div>
    </>
  )
}
