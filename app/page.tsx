import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Active Users", value: "1,284", change: "+8.4%" },
  { label: "New Signups", value: "312", change: "+2.1%" },
  { label: "API Requests", value: "42.9k", change: "+12.6%" },
  { label: "Avg. Response", value: "240ms", change: "-4.2%" }
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Dashboard Overview"
        subtitle="Monitor your user base and operational health in real time."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-2xl font-semibold">{stat.value}</div>
              <Badge variant={stat.change.startsWith("-") ? "warning" : "success"}>
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Your API uptime has been stable for the last 30 days. Keep an eye on
              peak traffic between 6pm and 9pm UTC to maintain response targets.
            </p>
            <p>
              The newest feature rollout reached 68% adoption. Send a follow-up
              campaign to the remaining cohort to lift activation.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Release Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Database backups</span>
              <Badge variant="success">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Latency budget</span>
              <Badge variant="success">On Track</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Security review</span>
              <Badge variant="warning">Pending</Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
