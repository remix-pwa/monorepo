import type { Route } from "./+types/home";
import { useQuery } from "@tanstack/react-query";
import { RecipeCard } from "~/components/recipe-card";
import { type Recipe } from "~/lib/schema";
import { Skeleton } from "~/components/ui/skeleton";
import { SERVER_URL } from "~/lib/query-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}



export default function Home() {
  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: [`${SERVER_URL}/api/recipes`]
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Discover Recipes</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
