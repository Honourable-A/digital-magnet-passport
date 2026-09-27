import { createClient, type User } from "npm:@supabase/supabase-js@2";

export interface CallerUser {
  supabaseUid: string;
  email: string;
  role: string; // uppercased, e.g. "MANUFACTURER"
}

function toCallerUser(user: User): CallerUser {
  const rawRole = (user.user_metadata?.role as string | undefined) ?? "";
  return {
    supabaseUid: user.id,
    email: user.email ?? "",
    role: rawRole.toUpperCase(),
  };
}

// Verifies the request's bearer token against Supabase Auth and returns the caller.
// Throws a Response-shaped error the caller can return directly on failure.
export async function requireUser(req: Request): Promise<CallerUser> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    throw new AuthError("Missing Authorization header", 401);
  }

  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    throw new AuthError("Invalid or expired token", 401);
  }

  return toCallerUser(data.user);
}

export function requireRole(user: CallerUser, roles: string[]) {
  if (!roles.includes(user.role)) {
    throw new AuthError("Access denied", 403);
  }
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}
