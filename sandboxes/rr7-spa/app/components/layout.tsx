import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Navigation from "./navigation";
import { Toaster } from "./ui/toaster";
import ConnectionStatus from "./connection-status";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      <ConnectionStatus />
      <Toaster />
    </motion.div>
  );
}
