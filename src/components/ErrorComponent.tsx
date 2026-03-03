import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";

export default function ErrorComponent({ message }: { message: string }) {
  return (
    <Card className="border-destructive bg-destructive/10 w-full max-w-xs p-4">
      <CardHeader>
        <CardTitle className="text-destructive font-bold whitespace-nowrap">
          Něco se pokazilo
        </CardTitle>
        <CardDescription>Chyba: {message}</CardDescription>
      </CardHeader>
    </Card>
  );
}
