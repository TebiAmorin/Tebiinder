import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${origin}/auth/callback`,
      scopes: "identify",
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(`${origin}/?error=login`);
  }

  return NextResponse.redirect(data.url);
}
