import { Hono } from 'hono'
import { storage } from "./storage";
import { insertRecipeSchema } from './schema';

export const api = new Hono()

api.get('/recipes', async (c) => {
  const recipes = await storage.getAllRecipes();
  return c.json(recipes);
})

api.get('/recipes/:id', async (c) => {
  const recipe = await storage.getRecipe(Number(c.req.param('id')));
  return c.json(recipe);
})

api.post('/recipes', async (c) => {
  const body = await c.req.json();
  const parseResult = insertRecipeSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json({ error: parseResult.error.message }, 400);
  }

  const recipe = await storage.createRecipe(parseResult.data);
  return c.json(recipe);
})

api.patch('/recipes/:id/toggle-saved', async (c) => {
  const recipe = await storage.toggleSaved(Number(c.req.param('id')));
  return c.json(recipe);
})

api.post('/push/subscribe', (c) => c.json({ success: true }))
