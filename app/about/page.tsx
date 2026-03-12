import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      <Header
        title="About"
        subtitle="Learn how this dashboard is designed and what powers it."
      />

      <Card>
        <CardHeader>
          <CardTitle>Full-Stack Architecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            DashStack is a production-ready starter that combines Next.js App Router,
            MongoDB, and a clean admin layout to accelerate internal tooling.
          </p>
          <p>
            The UI is built with Tailwind CSS and ShadCN-style components, complete
            with theme switching, responsive navigation, and reusable primitives.
          </p>
          <p>
            Server-side route handlers provide a secure API surface, while client
            hooks handle data loading, optimistic state updates, and toast feedback.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
