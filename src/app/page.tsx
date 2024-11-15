import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className="text-4xl font-bold">Welcome to DocuTrack</h1>
      <div className="flex gap-4">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </div>
  );
}
