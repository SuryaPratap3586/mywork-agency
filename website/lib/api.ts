import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "./errors";

export function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function errorResponse(e: unknown) {
  if (e instanceof HttpError) return json({ error: e.message }, e.status);
  if (e instanceof ZodError) {
    return json(
      { error: "Please check the form", details: e.issues.map((i) => `${i.path.join(".")}: ${i.message}`) },
      400,
    );
  }
  console.error(e);
  return json({ error: "Something went wrong" }, 500);
}
