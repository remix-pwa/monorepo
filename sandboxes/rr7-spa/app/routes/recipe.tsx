import { useQuery } from "@tanstack/react-query";
import { type Recipe } from "~/lib/schema";
import { Clock, Users, Share2 } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { motion } from "framer-motion";
import { SERVER_URL } from "~/lib/query-client";
import type { Route } from "./+types/recipe";

export default function RecipePage({
  params,
}: Route.ComponentProps) {
  const recipeId = params?.id;
  const { toast } = useToast();

  const { data: recipe, isLoading } = useQuery<Recipe>({
    queryKey: [`${SERVER_URL}/api/recipes/${recipeId}`]
  });

  const handleShare = async () => {
    if (!recipe) return;

    const shareData = {
      title: recipe.title,
      text: recipe.description,
      url: window.location.href
    };

    try {
      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          duration: 2000
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard!",
          description: "You can now share it with others.",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Failed to share",
        description: "Please try again later.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="relative">
        <motion.img
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
        <Button
          onClick={handleShare}
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-6">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold"
        >
          {recipe.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-muted-foreground"
        >
          {recipe.description}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{recipe.cookingTime} mins</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>{recipe.servings} servings</span>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {ingredient}
                </motion.li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <span className="font-mono text-sm bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span>{instruction}</span>
                </motion.li>
              ))}
            </ol>
          </motion.section>
        </div>
      </div>
    </motion.article>
  );
}