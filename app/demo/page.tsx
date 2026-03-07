import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function DemoPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center p-4 md:p-8">
      <div className="w-full">
        <Link href="/">
          <p className="mb-4 text-sm">{"<"}- Back to Landing</p>
        </Link>
        <Card className="w-full">
          <div className="space-y-1.5 p-5">
            <h2 className="h2">Demo</h2>
          </div>

          <div className="space-y-3 px-5 pb-5"></div>
        </Card>
      </div>
    </main>
  );
}
