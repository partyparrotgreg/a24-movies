"use client";

import { movies as defaultMovies } from "@/data/movies";
import { cn } from "@/lib/utils";
import { fetchMovieData } from "@/services";
import { CheckCircle, SearchIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

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


export const MovieTable = () => {
  const [movieList, setMovieList] = useState<Movies>([]);

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

  return (
    <div className="flex flex-col gap-6">
      {/* <div className="flex flex-row gap-4 justify-between items-center">
        <Input
          placeholder="Search"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const search = event.target.value;
            setSearch(search);
          }}
        />

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
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-6  gap-6 2xl:gap-12">
        {movieList.map((movie, index) => (
          <div
            key={index}
            onClick={() => handleCheckboxChange(index)}
            className={cn(
              movie.seen ? "bg-green-500 text-background " : "bg-card",
              "flex items-start  rounded-2xl flex-row relative overflow-hidden cursor-pointer"
            )}
          >
            <div className="rounded-2xl aspect-[10/15] relative h-full w-1/2 relative">
              <div className="text-md font-semibold py-2 px-3 bg-yellow-400 absolute left-3 top-0 rounded-b-2xl text-black">
                {movie.rating}
              </div>
              <Image
                src={movie.poster}
                alt={movie.title}
                width={400}
                height={600}
                className="object-cover w-auto h-full"
              />
            </div>
            <div className="p-4 flex flex-col gap-2 justify-between w-1/2 h-full">
              <Badge
                className="absolute right-2 top-2"
                variant={movie.seen ? "success" : "secondary"}
              >
                {movie.seen ? "Seen" : "Unseen"}
                {movie.seen && <CheckCircle size={16} className="ml-2" />}
              </Badge>
              <div className="grow flex flex-col gap-2">
                <h3
                  className="text-lg font-bold mt-8 leading-5"
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
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  console.log("Searching for " + movie.title);
                  const encodeTitle = encodeURIComponent(movie.title);
                  const googleSearchUrl = `https://www.google.com/search?q=${encodeTitle}`;
                  window.open(googleSearchUrl, "_blank");
                }}
              >
                <SearchIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
