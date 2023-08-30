import { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    console.log(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { token ? (
          <span>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </span>
          ): (
            <button onClick={() => setPage('login')}>login</button>
        )}

      </div>
        <Notify errorMessage={errorMessage} />

        <Authors show={page === 'authors'} setError={notify}/>

        <Books show={page === 'books'} setError={notify}/>

        <NewBook show={page === 'add'} setError={notify}/>

        <LoginForm
          show={page === 'login'}
          setToken={setToken}
          setError={notify}
          setPage={setPage}
        />
      </div>
  )
}

export default App
