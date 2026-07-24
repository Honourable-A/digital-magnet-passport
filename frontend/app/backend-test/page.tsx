import { apiFetch } from "@/lib/api/client";

type HealthResponse = {
  status?: string;
};

export default async function BackendTestPage() {
  let result: HealthResponse | null = null;
  let error: string | null = null;

  try {
    result = await apiFetch<HealthResponse>("/api/v1/health");
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown API error";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Backend Connection Test
        </h1>

        <p className="mt-1 text-muted-foreground">
          Testing the frontend connection to the backend health endpoint.
        </p>
      </div>

      <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm">
        {error ? error : JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}