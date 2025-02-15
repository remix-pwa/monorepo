import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx",),
  route("/recipe/:id", "routes/recipe.tsx"),
  route("/create", "routes/create.tsx"),
  route("/saved", "routes/saved.tsx"),
] satisfies RouteConfig;
