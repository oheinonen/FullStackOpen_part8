import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { useState, useEffect } from "react";
const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [uniqueGenres, setUniqueGenres] = useState([])

  // Used to get all available genres
  const { data: allData } = useQuery(ALL_BOOKS);
  useEffect(() => {
    if (allData) {
      setUniqueGenres([...new Set(allData.allBooks.flatMap(book => book.genres))]);
    }
  }, [allData]); // eslint-disable-line react-hooks/exhaustive-deps

  let queryOptions = {};
  if (selectedGenre !== 'all') {
    queryOptions = {
      variables: { genre: selectedGenre },
    };
  }
  const { loading, error, data } = useQuery(ALL_BOOKS, queryOptions);

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
