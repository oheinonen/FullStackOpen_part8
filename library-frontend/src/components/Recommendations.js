import { useQuery } from "@apollo/client"
import { ALL_BOOKS, LOGGED_USER} from "../queries"

const Recommendations = (props) => {
  const { loading, error, data } = useQuery(LOGGED_USER);
  if (!props.show) {
    return null
  }
  if (loading)  {
    return <div>loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const favoriteGenre = data.me.favoriteGenre;


  return (
    <>
      {favoriteGenre && (
        <Books favoriteGenre={favoriteGenre} />
      )}
    </>
  )
}

const Books = ({ favoriteGenre }) => {
  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
  });


  if (loading)  {
    return <div>loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const books = data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
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
  )
}

export default Recommendations
