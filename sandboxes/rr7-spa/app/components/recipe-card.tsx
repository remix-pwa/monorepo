import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Clock, Users, Bookmark } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, SERVER_URL } from "~/lib/query-client";
import { Link } from "react-router";
import type { Recipe } from "~/lib/schema";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleSaved = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        "PATCH", 
        `${SERVER_URL}/api/recipes/${recipe.id}/toggle-saved`
      );
      return response.json();
    },
    onSuccess: (updatedRecipe) => {
      queryClient.invalidateQueries({ 
        queryKey: [`${SERVER_URL}/api/recipes`]
      });
      toast({
        title: updatedRecipe.isSaved ? "Recipe saved" : "Recipe removed from saved",
        duration: 2000
      });
    },
    onError: () => {
      toast({
        title: "Failed to update recipe",
        variant: "destructive",
        duration: 2000
      });
    }
  });

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={`/recipe/${recipe.id}`}>
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-48 w-full object-cover"
        />
      </Link>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
        <p className="text-muted-foreground">{recipe.description}</p>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{recipe.cookingTime} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="text-sm">{recipe.servings} servings</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => toggleSaved.mutate()}
          disabled={toggleSaved.isPending}
        >
          <Bookmark
            className={`h-4 w-4 ${recipe.isSaved ? "fill-current" : ""}`}
          />
          <span className="ml-2">{recipe.isSaved ? "Saved" : "Save"}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
