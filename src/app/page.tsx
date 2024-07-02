import { MovieTable } from "@/components/movie-table";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Abril_Fatface } from "next/font/google";

const abril = Abril_Fatface({ subsets: ["latin"], weight: "400" });

export default function Home() {
  return (
    <main className="p-8 flex flex-col gap-6">
      <div className="flex flex-row gap-4 justify-between items-center">
        <h1 className={cn("text-3xl font-bold", abril.className)}>
          A24 Movie List
        </h1>
        <div className="flex flex-row gap-4 items-center">
          <Button>Clear DB</Button>
          <ThemeToggle />
        </div>
      </div>
      <MovieTable />
    </main>
  );
}
