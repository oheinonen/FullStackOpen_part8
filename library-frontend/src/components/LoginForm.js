import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setToken, setError, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      const errors = error.graphQLErrors[0].extensions.error.errors
      const messages = Object.values(errors).map(e => e.message).join('\n')
      setError(messages)
    }  })

  useEffect(() => {
    if ( show && result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('books-user-token', token)
      setPage('authors')
    }
   },[result.data]) // eslint-disable-line
    
  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
