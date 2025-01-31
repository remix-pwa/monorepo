import { usePWAManager } from "@remix-pwa/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Route, Database, RotateCw, Wifi, LayoutDashboard, Smartphone, Download, Bell, Share2, Moon, Sun } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";

export const loader: LoaderFunction = () => {
  return json({ message: "Hello from the server!" });
}

export const meta = () => {
  return [
    { title: "📦 Remix PWA Sandbox" },
    { name: "description", content: "Progressive web apps proof of concept" },
  ];
};

const links = [
  {
    title: "Route Worker Modules",
    description: "Learn about service worker route modules",
    href: "/worker-modules",
    icon: Route,
    gradient: "from-pink-500 via-purple-500 to-pink-500",
    details: "Route Worker Modules allow you to handle specific routes in your service worker. Learn how to implement caching strategies, handle offline fallbacks, and manage network requests on a per-route basis."
  },
  {
    title: "Caching",
    description: "Implement strategic caching for your PWA",
    href: "/caching",
    icon: Database,
    gradient: "from-orange-400 via-pink-600 to-orange-400",
    details: "Explore different caching strategies like Cache-First, Network-First, and Stale-While-Revalidate. Learn how to cache assets, API responses, and dynamic content to improve performance and offline capabilities."
  },
  {
    title: "Background Sync",
    description: "Handle offline data synchronization",
    href: "/background-sync",
    icon: RotateCw,
    gradient: "from-green-400 via-cyan-500 to-green-400",
    details: "Implement background synchronization to handle offline form submissions, data updates, and API calls. Ensure your app maintains data consistency even when users go offline and reconnect."
  },
  {
    title: "Offline",
    description: "Build reliable offline experiences",
    href: "/offline",
    icon: Wifi,
    gradient: "from-blue-400 via-indigo-500 to-blue-400",
    details: "Create seamless offline experiences with custom offline pages, fallback content, and offline-first data strategies. Learn how to detect network status and adapt your app's behavior accordingly."
  },
  {
    title: "Layout Routes",
    description: "Structure your PWA with nested layouts",
    href: "/layouts",
    icon: LayoutDashboard,
    gradient: "from-purple-500 via-violet-600 to-indigo-500",
    details: "Understand how to use Remix's nested routing with PWA features. Learn to structure your app with shared layouts while maintaining optimal service worker caching and offline capabilities."
  },
  {
    title: "Device Features",
    description: "Access native device capabilities",
    href: "/device-features",
    icon: Smartphone,
    gradient: "from-lime-500 via-amber-500 to-lime-500",
    details: "Integrate native device features like camera, geolocation, and sensors into your PWA. Learn how to request permissions and provide fallbacks for unsupported features."
  },
  {
    title: "Installability",
    description: "Make your app installable",
    href: "/install",
    icon: Download,
    gradient: "from-sky-400 via-indigo-600 to-sky-400",
    details: "Configure your PWA for installation with proper manifests, icons, and installation prompts. Learn how to customize the installation experience and track installation metrics."
  },
  {
    title: "Push Notifications",
    description: "Implement push notifications",
    href: "/notifications",
    icon: Bell,
    gradient: "from-amber-400 via-orange-500 to-red-500",
    details: "Add push notifications to your PWA using the Push API and Notification API. Learn to handle notification permissions, send notifications, and respond to notification interactions."
  },
  {
    title: "Web Share",
    description: "Enable native sharing features",
    href: "/web-share",
    icon: Share2,
    gradient: "from-cyan-400 via-sky-500 to-blue-500",
    details: "Implement the Web Share API to allow users to share content using their device's native sharing capabilities. Learn how to share text, links, files, and handle sharing targets."
  },
]

export default function Index() {
  const { promptInstall } = usePWAManager();
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="max-w-7xl mx-auto w-full z-50 flex justify-between items-center shadow-foreground/10 text-foreground">
        <h2 className="text-2xl font-bold py-4">📦 Sandbox</h2>
        {/* Theme Toggle */}
        <div className="py-4 flex justify-end">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <main className="flex-1">
          <section className="py-20 lg:py-24 2xl:py-40 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 text-foreground">
              📦 Remix PWA Sandbox
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A free-for-all sandbox playground for testing out Remix PWA features in Remix SSR apps.
            </p>
          </section>

          <section className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {links.map((link, index) => (
                <HoverCard key={index} closeDelay={200}>
                  <HoverCardTrigger asChild>
                    <Link to={link.href} className="block group">
                      <Card className="transition-all duration-300 hover:shadow-lg relative overflow-hidden h-full">
                        <div className={`absolute inset-0 bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <div className="absolute inset-[3px] bg-card rounded-lg" />
                        <CardHeader className="p-6 relative">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full bg-gradient-to-br ${link.gradient} text-white relative`}>
                              <link.icon size={24} />
                            </div>
                            <div>
                              <CardTitle className="text-2xl mb-2">{link.title}</CardTitle>
                              <CardDescription className="text-base">{link.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-96 md:w-[350.4px] lg:w-[478.4px] xl:w-[393px] z-50" sideOffset={8}>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{link.title}</h4>
                      <p className="text-sm">{link.description}</p>
                      <p className="text-sm text-muted-foreground">{link.details}</p>
                      <div className="pt-2">
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </section>
        </main>
      </div>
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
        .group:hover .bg-gradient-to-r {
          animation: gradient-animation 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}
