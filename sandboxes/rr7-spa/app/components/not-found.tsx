import { Card, CardContent } from "~/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound({
  title = "404 Page Not Found",
  description = "Did you forget to add the page to the router?",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="overflow-hidden flex items-center justify-center lg:bg-accent lg:py-24 backdrop-blur-sm mt-24 lg:mt-16 rounded-md">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
