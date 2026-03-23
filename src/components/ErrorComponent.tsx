import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";

export default function ErrorComponent({ message }: { message: string }) {
  return (
    <Card className="border-destructive bg-destructive/10 w-full max-w-xs">
      <CardHeader>
        <CardTitle className="text-destructive font-bold whitespace-nowrap">
          Něco se pokazilo
        </CardTitle>
        <CardDescription className="text-foreground">{message}</CardDescription>
        <CardFooter className="px-0 pt-4">
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft />
            Vrátit se
          </Button>
        </CardFooter>
      </CardHeader>
    </Card>
  );
}
