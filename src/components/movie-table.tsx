"use client";

import { movies as defaultMovies } from "@/data/movies";
import { cn } from "@/lib/utils";
import { fetchMovieData } from "@/services";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

type Movie = {
  title: string;
  year: string;
  rating: string;
  genre: string;
  poster: string;
  seen: boolean;
};
type Movies = Movie[];
type Filter = "seen" | "unseen" | "all";
type Sort = "newest" | "oldest" | "rating" | "year";

const sortings = ["newest", "oldest", "rating", "year"];
const filters = ["seen", "unseen"];

export const MovieTable = () => {
  const [movieList, setMovieList] = useState<Movies>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("rating");

  useEffect(() => {
    const fetchMovies = async () => {
      const storedMoviesStr = localStorage.getItem("movieList");
      const storedMovies = storedMoviesStr ? JSON.parse(storedMoviesStr) : [];
      if (storedMovies.length) {
        setMovieList(storedMovies);
      } else {
        const moviePromises = defaultMovies.map(async (title) => {
          const data = await fetchMovieData(title);
          return {
            title: data.Title,
            year: data.Year,
            rating: data.imdbRating,
            genre: data.Genre,
            poster: data.Poster,
            seen: false,
          };
        });
        const movieData: Movies = await Promise.all(moviePromises);
        setMovieList(movieData);
        localStorage.setItem("movieList", JSON.stringify(movieData));
      }
    };

    fetchMovies();
  }, []);

  const handleCheckboxChange = (index: number) => {
    const newMovieList = [...movieList];
    newMovieList[index].seen = !newMovieList[index].seen;
    setMovieList(newMovieList);
    localStorage.setItem("movieList", JSON.stringify(newMovieList));
  };

  console.log({ movieList });

  const sortByRating = (a: Movie, b: Movie) => {
    if (a.rating < b.rating) {
      return 1;
    }
    if (a.rating > b.rating) {
      return -1;
    }
    return 0;
  };

  const sortByYear = (a: Movie, b: Movie) => {
    if (a.year < b.year) {
      return 1;
    }
    if (a.year > b.year) {
      return -1;
    }
    return 0;
  };

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  const handleSortChange = (newSort: Sort) => {
    setSort(newSort); // Update the state with the new sort value
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row gap-4 justify-between items-center">
        <Input placeholder="Search" />
        <Tabs defaultValue={filter}>
          <TabsList>
            {filters.map((filter, index) => (
              <TabsTrigger
                value={filter}
                key={filter}
                onChange={() => handleFilterChange(filter as Filter)}
              >
                {filter.toLocaleUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Tabs defaultValue={sort}>
          <TabsList>
            {sortings.map((sort, index) => (
              <TabsTrigger
                value={sort}
                key={sort}
                onChange={() => handleSortChange(sort as Sort)}
              >
                {sort.toLocaleUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-7  gap-6 2xl:gap-12">
        {movieList.map((movie, index) => (
          <div
            key={index}
            onClick={() => handleCheckboxChange(index)}
            className={cn(
              movie.seen
                ? "bg-green-500 text-background border-4 border-green-500"
                : "bg-card",
              "flex items-start  rounded-2xl flex-col relative overflow-hidden cursor-pointer"
            )}
          >
            <div className="text-md font-semibold py-2 px-3 bg-yellow-400 absolute left-3 top-0 rounded-b-2xl text-black">
              {movie.rating}
            </div>

            <Image
              src={movie.poster}
              alt={movie.title}
              width={400}
              height={600}
              className="rounded-2xl aspect-[10/15] object-cover"
            />
            <div className="p-4">
              <h3
                className="text-lg font-bold"
                onClick={async (e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  try {
                    await navigator.clipboard.writeText(movie.title);
                  } catch (error) {
                    console.error("Failed to copy text to clipboard:", error);
                  } finally {
                    toast.success(`"${movie.title}" copied to clipboard`);
                  }
                }}
              >
                {movie.title}
              </h3>
              <p className="text-sm">{movie.year}</p>
              <p className="text-sm opacity-50">{movie.genre}</p>
            </div>
            <div className="p-2 rounded-lg absolute right-0 top-0">
              {/* Badge with seen/unseen */}
              <div className="flex items-center gap-2 p-2 rounded-lg absolute right-0 top-0">
                <Badge variant={movie.seen ? "success" : "secondary"}>
                  {movie.seen ? "Seen" : "Unseen"}
                  {movie.seen && <CheckCircle size={16} className="ml-2" />}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
