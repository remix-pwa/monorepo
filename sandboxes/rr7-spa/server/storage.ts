import type { Recipe, InsertRecipe } from "./schema";

export interface IStorage {
  getAllRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined>;
  toggleSaved(id: number): Promise<Recipe | undefined>;
}

const DB_URL = "http://localhost:3021";

export class DatabaseStorage implements IStorage {
  async getAllRecipes(): Promise<Recipe[]> {
    const recipes = await fetch(`${DB_URL}/recipes`).then((res) => res.json());
    return recipes;
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    const recipe = await fetch(`${DB_URL}/recipes/${id}`).then((res) => res.json());
    return recipe || undefined;
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const newRecipe = await fetch(`${DB_URL}/recipes`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipe),
    }).then((res) => res.json());
    return newRecipe;
  }

  async updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const updatedRecipe = await fetch(`${DB_URL}/recipes/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...recipe, lastSynced: new Date() }),
    }).then((res) => res.json());
    return updatedRecipe || undefined;
  }

  async toggleSaved(id: number): Promise<Recipe | undefined> {
    const recipe = await this.getRecipe(id);
    if (!recipe) return undefined;

    const updatedRecipe = await fetch(`${DB_URL}/recipes/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isSaved: !recipe.isSaved, lastSynced: new Date() }),
    }).then((res) => res.json());
    return updatedRecipe || undefined;
  }
}

async function seedData() {
  const count = await fetch(`${DB_URL}/recipes`).then((res) => res.json());
  if (count.length > 0) return;

  const sampleRecipes: InsertRecipe[] = [
    {
      title: "Classic Pancakes",
      description: "Fluffy and delicious breakfast pancakes",
      ingredients: ["2 cups flour", "2 eggs", "1 cup milk", "1 tbsp butter"],
      instructions: ["Mix dry ingredients", "Add wet ingredients", "Cook on griddle"],
      imageUrl: "https://images.unsplash.com/photo-1556909211-36987daf7b4d",
      cookingTime: 20,
      servings: 4,
      isSaved: false
    },
    {
      title: "Garden Salad",
      description: "Fresh and healthy garden salad",
      ingredients: ["Lettuce", "Tomatoes", "Cucumber", "Olive oil"],
      instructions: ["Wash vegetables", "Chop ingredients", "Mix and serve"],
      imageUrl: "https://images.unsplash.com/photo-1512058454905-6b841e7ad132",
      cookingTime: 10,
      servings: 2,
      isSaved: false
    }
  ];

  for (const recipe of sampleRecipes) {
    await fetch(`${DB_URL}/recipes`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipe),
    });
  }
}

export const storage = new DatabaseStorage();
seedData().catch(console.error);
