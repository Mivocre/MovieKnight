import { useEffect, useState } from 'react'
import MovieCard from './MovieCard'
import { useNavigate } from 'react-router-dom'

import '../vanilla/movie-list.css'
import '../vanilla/movie-card.css'

const API_HOST = import.meta.env.VITE_API_HOST
if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

function MovieSearch() {
    const [genres, setGenres] = useState([])
    const [query, setQuery] = useState([])
    const [movies, setMovies] = useState([])
    const navigate = useNavigate()
    const fetchData = async () => {
        const response = await fetch(`${API_HOST}/api/genres/`)
        if (response.ok) {
            const data = await response.json()
            setGenres(data)
        }
    }
    async function handleSubmit(e) {
        e.preventDefault()
        const results = await fetch(
            `${API_HOST}/api/movies/search?query=${query}`
        )
        if (results.ok) {
            const data = await results.json()
            for (let movie of data) {
                const localgenres = []
                for (let genre of movie.genres) {
                    for (let localgenre of genres) {
                        if (genre.id === localgenre.tmdb_id) {
                            localgenres.push(localgenre)
                        }
                    }
                }
                movie.genres = localgenres
            }
            setMovies(data)
        }
    }
    const handleAdd = async (id) => {
        const addURL = `${API_HOST}/api/movies/`
        let movieToAdd = ''
        for (let movie of movies) {
            if (movie.tmdb_id === id) {
                movieToAdd = JSON.stringify(movie)
            }
        }
        const postConfig = {
            method: 'post',
            body: movieToAdd,
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const addresult = await fetch(addURL, postConfig)
        if (addresult.ok) {
            console.log('Successful')
        } else {
            alert('Failed to add movie')
        }
        navigate('/movies')
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className="main-containers">
            <h1 className="mv-list-title">Add a Movie to our Database</h1>

            <div className="mv-list-searchbar-container">
                <form
                    onSubmit={handleSubmit}
                    className="mv-list-searchbar d-flex"
                >
                    <input
                        placeholder="Search for a Movie"
                        required
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        type="text"
                        name="title"
                        id="searchbar"
                        className="form-control search-term"
                    />
                    <button className="magnifying-glass-icon">
                        <i
                            className="fa-solid fa-magnifying-glass fa-lg mag-glass-hover"
                            style={{ color: '#c0c0c0' }}
                        ></i>
                    </button>
                </form>
            </div>

            {/* <div>
                <dialog className="block p-1 rounded shadow-lg bg-primary h-10">
                    <form
                        className="flex justify-center gap-3"
                        onSubmit={handleSubmit}
                    >
                        <input
                            className="p-1 pl-2 pr-2 text-black rounded"
                            type="text"
                            name="query"
                            id="query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for a Movie"
                        />
                        <button className="pl-2 pr-2 bg-orange-400 rounded">
                            Search
                        </button>
                    </form>
                </dialog>
            </div> */}
            <div>
                <div className="mt-28 grid grid-cols-1 gap-4 md:grid-cols-5">
                    {movies.map((movie) => {
                        return (
                            <MovieCard
                                key={movie.tmdb_id}
                                movie={movie}
                                buttonHandler={() => handleAdd(movie.tmdb_id)}
                                buttonName={movie.title}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default MovieSearch
