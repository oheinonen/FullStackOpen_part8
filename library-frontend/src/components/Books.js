import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { useState } from "react";
const Books = (props) => {
  const { loading, error, data } = useQuery(ALL_BOOKS);
  const [selectedGenre, setSelectedGenre] = useState('all')

  if (!props.show) {
    return null
  }

  if (loading)  {
    return <div>loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const books = data.allBooks

  const uniqueGenres = [...new Set(books.flatMap(book => book.genres))];

  return (
    <div>
      <div>
        <h2>books</h2>
        <p>
          in genre <b>{selectedGenre}</b>
        </p>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books
              .filter((book) => book.genres.includes(selectedGenre) || selectedGenre === 'all')
              .map((a) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div>
        {uniqueGenres.map( (genre) => (
          <button onClick={() => setSelectedGenre(genre)}>{genre}</button>
        ))}
        <button onClick={() => setSelectedGenre('all')}>all</button>
      </div>
    </div>

  )
}

export default Books
