import React, { Children, isValidElement, ReactElement, ReactNode } from "react";
import { Card, CardContent } from "./ui/card"
import { TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { Tabs } from "./ui/tabs";

type DemoProps = {
  children: ReactNode;
}

export const Demo = ({ children }: DemoProps) => {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-foreground">Interactive Demo</h2>
      <Card className="w-full max-w-3xl mx-auto overflow-hidden">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </section>
  );
}

export const DemoDescription = ({ children }: { children: ReactNode }) => {
  return <p className="text-muted-foreground mb-4">{children}</p>;
}

type DemoPlaygroundProps = {
  children: ReactNode;
}

type DemoPlaygroundChildren = {
  name: string;
}

export const DemoPlayground = ({ children }: DemoPlaygroundProps) => {
  const simpleSlugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    Children.count(children) > 1 ? (<Tabs
      defaultValue={
        simpleSlugify((Children.toArray(children)[0] as ReactElement)?.props.name) ?? 'code'
      }
      className="w-full"
    >
      <TabsList className={cn("grid w-full h-full grid-cols-1", Children.count(children) > 4 ? 'md:grid-cols-4' : `md:grid-cols-${Children.count(children)}`)}>
        {Children.map(children, (child) => (
          isValidElement(child) ? (
            <TabsTrigger value={simpleSlugify(child.props.name)}>{child.props.name}</TabsTrigger>
          ) : null
        ))}
      </TabsList>
      <TabsContent value="code">{children}</TabsContent>
      {Children.map(children, (child) => (
        isValidElement(child) ? (
          <TabsContent value={simpleSlugify(child.props.name)} className="pt-1">{child}</TabsContent>
        ) : null
        ))}
      </Tabs>
    ) : (
      <>{children}</>
    )
  );
}

type APIExplorerDemoProps = {
  invokeApi: () => void;
  isLoading?: boolean;
  btnText?: string;
  loadingText?: string;
  apiResponse: any;
  gradient?: string;
} & DemoPlaygroundChildren

export const APIExplorerDemo = ({
  invokeApi,
  apiResponse,
  isLoading = false,
  btnText = 'Invoke API',
  loadingText = 'Calling API...',
  gradient = 'from-pink-500 to-purple-500'
}: APIExplorerDemoProps) => {
  return (
    <div className="space-y-4">
      <Button onClick={invokeApi} disabled={isLoading}>
        {isLoading ? loadingText : btnText}
      </Button>
      <div className={cn("bg-gradient-to-r", gradient, "p-1 rounded-md")}>
        <div className="bg-background p-4 rounded-md">
          <pre className="text-sm whitespace-pre-wrap">
            {apiResponse ? JSON.stringify(apiResponse, null, 2) : 'API response will appear here.'}
          </pre>
        </div>
      </div>
    </div>
  );
}
