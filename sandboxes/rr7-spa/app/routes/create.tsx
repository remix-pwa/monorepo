import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRecipeSchema, type InsertRecipe } from "~/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Minus, ChefHat } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { apiRequest } from "~/lib/query-client";
import { useNavigate } from "react-router";
import { SERVER_URL } from "~/lib/query-client";

export default function CreateRecipe() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);

  const form = useForm<InsertRecipe>({
    resolver: zodResolver(insertRecipeSchema),
    defaultValues: {
      title: "",
      description: "",
      ingredients: [""],
      instructions: [""],
      imageUrl: "",
      cookingTime: 30,
      servings: 4,
      isSaved: false
    }
  });

  const createRecipe = useMutation({
    mutationFn: async (recipe: InsertRecipe) => {
      const res = await apiRequest("POST", `${SERVER_URL}/api/recipes`, recipe);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${SERVER_URL}/api/recipes`] });
      toast({
        title: "Recipe created successfully!",
        duration: 2000
      });
      navigate("/");
    },
    onError: () => {
      toast({
        title: "Failed to create recipe",
        description: "Please try again",
        variant: "destructive",
        duration: 3000
      });
    }
  });

  const handleAddField = (type: 'ingredient' | 'instruction') => {
    if (type === 'ingredient') {
      setIngredients([...ingredients, '']);
    } else {
      setInstructions([...instructions, '']);
    }
  };

  const handleRemoveField = (type: 'ingredient' | 'instruction', index: number) => {
    if (type === 'ingredient' && ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    } else if (type === 'instruction' && instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const onSubmit = (data: InsertRecipe) => {
    createRecipe.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-3">
        <ChefHat className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Create Recipe</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipe title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your recipe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FormLabel>Ingredients</FormLabel>
            {ingredients.map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex gap-2 mb-2"
              >
                <FormField
                  control={form.control}
                  name={`ingredients.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder={`Ingredient ${index + 1}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveField('ingredient', index)}
                  disabled={ingredients.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddField('ingredient')}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FormLabel>Instructions</FormLabel>
            {instructions.map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex gap-2 mb-2"
              >
                <FormField
                  control={form.control}
                  name={`instructions.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea
                          placeholder={`Step ${index + 1}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveField('instruction', index)}
                  disabled={instructions.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddField('instruction')}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="cookingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cooking Time (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="servings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servings</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-end gap-4"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createRecipe.isPending}
            >
              Create Recipe
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
