import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS , ADD_BIRTHYEAR} from '../queries'
import Select from 'react-select';

const Authors = (props) => {
  const [born, setBorn] = useState('')
  const [ addBirthyear ] = useMutation(ADD_BIRTHYEAR)
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const { loading, error, data } = useQuery(ALL_AUTHORS);

  if (!props.show) {
    return null
  }

  if (loading)  {
    return <div>loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const submit = async (event) => {
    event.preventDefault()
    addBirthyear({ variables: { name: selectedAuthor.value, born : Number(born) } })
    setSelectedAuthor(null)
    setBorn('')
  }

  const authors = data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
          <div>
            <Select
              defaultValue={selectedAuthor}
              onChange={setSelectedAuthor}
              options={ authors.map((a) =>  ( { value:a.name, label: a.name })) }
            />
          </div>
          <div>
            born
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button type="submit">update author</button>
        </form>
      </div>

    </div>
  )
}

export default Authors
