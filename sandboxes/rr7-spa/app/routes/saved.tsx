import { useQuery } from "@tanstack/react-query";
import { RecipeCard } from "~/components/recipe-card";
import { type Recipe } from "~/lib/schema";
import { BookmarkX } from "lucide-react";
import { SERVER_URL } from "~/lib/query-client";

export default function Saved() {
  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: [`${SERVER_URL}/api/recipes`]
  });

  const savedRecipes = recipes?.filter(recipe => recipe.isSaved);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!savedRecipes?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookmarkX className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No saved recipes</h2>
        <p className="text-muted-foreground">
          Save your favorite recipes to access them offline
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Saved Recipes</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {savedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
