import { useCallback, useEffect, useState } from "react";
import Page from "@/components/Page";
import { Button } from "@/components/ui/button";
import { fetchMyTable, type MyTableResult } from "@/lib/http/user";
import { BetweenVerticalEnd, Info, MapPin, RefreshCw, Users } from "lucide-react";

function MyTable() {
  const [result, setResult] = useState<MyTableResult | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTable = useCallback(async () => {
    setLoading(true);
    const data = await fetchMyTable();
    setResult(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTable();
  }, [loadTable]);

  return (
    <Page title="Find My Table" description="Find where your team is seated.">
      <div className="mx-auto max-w-3xl flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-pretty">
          <h2 className="font-bold text-2xl lg:text-3xl">Find My Table</h2>
          <p className="text-muted">Find where your team is seated at the venue. You may reach out to a committee if your team composition changed after Speed Dating session.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
          </div>
        ) : (
          <TableState result={result} onRetry={loadTable} />
        )}
      </div>
    </Page>
  );
}

function TableState({
  result,
  onRetry,
}: {
  result: MyTableResult | null;
  onRetry: () => void;
}) {
  if (!result || result.status === "error") {
    return (
      <InfoCard
        icon={<Info className="text-destructive" />}
        title="Couldn't load your table"
        description={
          result?.message ?? "Something went wrong. Please try again later."
        }
        tone="destructive"
        onRetry={onRetry}
      />
    );
  }

  if (result.status === "no-formation") {
    return (
      <InfoCard
        icon={<Users className="text-tertiary" />}
        title="No team found"
        description="You're not part of any team yet, so there's no table to show. If you think this is a mistake, please reach out to the committees."
        onRetry={onRetry}
      />
    );
  }

  if (result.status === "unassigned") {
    return (
      <InfoCard
        icon={<Info className="text-tertiary" />}
        title="No table assigned yet"
        description={
          result.message ??
          "Your team hasn't been placed at a table yet. Please reach out to the committees."
        }
        onRetry={onRetry}
      />
    );
  }

  return <TableNumberCard result={result} onRetry={onRetry} />;
}

function TableNumberCard({
  result,
  onRetry,
}: {
  result: MyTableResult;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-2xl border border-tertiary bg-gradient-to-br from-primary to-tertiary text-white shadow-sm">
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <div className="flex items-center gap-2 text-white/80 uppercase tracking-widest text-xs font-medium">
            <BetweenVerticalEnd size={16} />
            Your Table
          </div>
          <div className="text-8xl lg:text-9xl font-extrabold leading-none tabular-nums">
            {result.tableNumber}
          </div>
          {result.location ? (
            <div className="flex items-center gap-1.5 text-white/90">
              <MapPin size={18} />
              <span className="text-lg font-medium">{result.location}</span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          Head to this table for your hacking spot.
        </p>
        <Button variant="ghost" size="sm" onClick={onRetry}>
          <RefreshCw className="size-4" /> Refresh
        </Button>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
  tone = "default",
  onRetry,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone?: "default" | "destructive";
  onRetry: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-xl p-6 flex flex-col gap-4 border ${
        tone === "destructive" ? "border-destructive" : "border-tertiary"
      }`}
    >
      <div className="flex flex-row items-start gap-3">
        <div
          className={`p-2.5 rounded-xl w-fit aspect-square ${
            tone === "destructive"
              ? "bg-destructive/10"
              : "bg-tertiary/10"
          }`}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>
      <div>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="size-4" /> Try again
        </Button>
      </div>
    </div>
  );
}

export default MyTable;
