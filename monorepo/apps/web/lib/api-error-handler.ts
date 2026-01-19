import { NextResponse } from "next/server";
import { DomainError } from "./errors";

export function toResponse(error: unknown): NextResponse {
  if (error instanceof DomainError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        ...(error.details ? { details: error.details } : {})
      },
      { status: error.status }
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON format" },
      { status: 400 }
    );
  }

  console.error("[SERVER_ERROR]:", error);
  return NextResponse.json(
    { success: false, error: "Internal Server Error" },
    { status: 500 }
  );
}