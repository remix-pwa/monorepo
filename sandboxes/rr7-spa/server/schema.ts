import { z } from "zod";

export const recipes = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  imageUrl: z.string(),
  cookingTime: z.number(),
  servings: z.number(),
  isSaved: z.boolean(),
  lastSynced: z.date()
});


export const insertRecipeSchema = recipes.omit({
  id: true,
  lastSynced: true
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = z.infer<typeof recipes>;
