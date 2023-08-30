import { useState } from 'react'
import { useApolloClient, useSubscription} from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import Recommendations from './components/Recommendations'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

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

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      alert(`New book "${data.data.bookAdded.title}" added by ${data.data.bookAdded.author.name}`)
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(data.data.bookAdded),
        }
      })
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { token ? (
          <span>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')}>recommendations</button>
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

        <Recommendations show={page === 'recommendations'}/>

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
