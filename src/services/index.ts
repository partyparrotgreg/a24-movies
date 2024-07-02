import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export const fetchMovieData = async (title: string) => {
  const response = await axios.get(
    `https://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`
  );
  return response.data;
};
