import { useEffect, useState } from 'react'
import Search from './components/search'
import Spinner from './components/Spinner';
import MovieCard from './components/movieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers:{
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState("");
  const [searchTerm,setSearchTerm] = useState("");
  const [movieList, setmovieList] = useState([]);
  const [errorMessage,setErrorMessage] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [trendingMovies, settrendingMovies] = useState([])

  useDebounce(()=> setdebouncedSearchTerm(searchTerm),500,[searchTerm]);

  const loadTrendingMovies = async ()=>{
    try{
        const movies = await getTrendingMovies();
        settrendingMovies(movies);
    }catch(error){
      console.error(error);
      setErrorMessage("Error fetching Trending Movies, Please try again later.")
    }
  }

  const Fetch_Movies = async (query = '')=>{
    setisLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
      const response = await fetch(endpoint,API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch Movies");
      }
      const data = await response.json();
      if (data.response === false) {
        setErrorMessage(data.Error||"Failed to Fetch Movies")
        setmovieList([]);
        return;
      }

      setmovieList(data.results||[]);
      if(query && data.results.length > 0){
        updateSearchCount(query,data.results[0]);
      }
    } catch (error) {
      console.error(`${error}`)
      setErrorMessage("Error fetching Movies: Please Try Again Later...");
    }finally{
      setisLoading(false);
    }
  }
  useEffect(()=>{
    Fetch_Movies(debouncedSearchTerm);
  },[debouncedSearchTerm])
  useEffect(() => {
    loadTrendingMovies();
  }, [])
  
  return (
    <main>
        <div className="pattern">
          <div className="wrapper">
            <header>
                <img src="./hero-img.png" alt="banner"/>
                <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            </header>
            {trendingMovies.length > 0 && (
              <section className='trending'>
                <h2>Trending Movies</h2>
                <ul>
                  {trendingMovies.map((movie,index) =>(
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_URL} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <section className='all-movies'>
                <h2 className='mt-2'>All Movies</h2>
                {isLoading ? (<Spinner></Spinner>) : (errorMessage ? <p className='text-red-500'>{errorMessage}</p> : (<ul>{movieList.map(movie => (<MovieCard key={movie.id} movie={movie}></MovieCard>))}</ul>))}
            </section>
          </div>
        </div>
    </main>
  )
}

export default App