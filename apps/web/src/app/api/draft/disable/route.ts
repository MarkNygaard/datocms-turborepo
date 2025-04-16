import type { NextRequest } from "next/server";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const token =
    request.headers.get("x-preview-token") ?? searchParams.get("token");
  const url = searchParams.get("url");

  if (token !== process.env.DRAFT_SECRET_TOKEN) {
    return new Response("Invalid token", { status: 401 });
  }

  (await draftMode()).enable();

  if (!url) return new Response("Draft mode is enabled");

  // Retain draftMode cookie in iframe context
  const cookieStore = await cookies();
  const cookie = cookieStore.get("__prerender_bypass");

  if (cookie) {
    cookieStore.set({
      name: "__prerender_bypass",
      value: cookie.value,
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "none",
      partitioned: true,
    });
  }

  redirect(url);
}
