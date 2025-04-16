import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const url = searchParams.get("url");

  (await draftMode()).disable();

  if (!url) return new Response("Draft mode is disabled");

  // Retain draftMode cookie in iframe context
  const cookieStore = await cookies();
  const cookie = cookieStore.get("__prerender_bypass")!;

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
