import { Moon } from "lucide-react";
import { Sun } from "lucide-react";
import { Link } from "@remix-run/react";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { useLocalStorage } from "usehooks-ts";

type PageProps = {
  children: ReactNode;
  gradient: string;
  icon: ReactNode
  title: string;
  description: string;
}

export default function Page({ children, gradient, icon, title, description }: PageProps) {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative">
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-10 dark:opacity-20', gradient)} />

      <div className="container mx-auto px-4 relative">
        {/* Theme Toggle and Back Button */}
        <div className="py-4 flex justify-between items-center">
          <Link to="/">
            <Button variant="outline" size="icon" className="relative">
              <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {true ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>

        <main className="flex-1">
          {/* Mini Hero Section */}
          <section className="py-12 text-center">
            <div className={`inline-block p-3 rounded-full bg-gradient-to-br ${gradient} text-white mb-4`}>
              {icon}
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">{title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{description}</p>
          </section>
          {children}
        </main>

        <style>{`
        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .bg-gradient-to-br {
          animation: gradient-animation 5s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
      </div>
    </div>
  )
}

type PageDetailsProps = {
  details: string;
  gradient: string;
  title: string;
}

export const PageDetails = ({ details, gradient, title }: PageDetailsProps) => {
  return (
    <section className="py-8">
      <Card className="w-full max-w-3xl mx-auto overflow-hidden">
        <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />
        <CardHeader>
          <CardTitle>Detailed Overview</CardTitle>
          <CardDescription>Everything you need to know about {title}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{details}</p>
        </CardContent>
      </Card>
    </section>
  )
}
