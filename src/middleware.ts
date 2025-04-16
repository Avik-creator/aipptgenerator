import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
 // Clone the request headers so that we don't modify the original headers object
  const requestHeaders = new Headers(request.headers);

  // Check if the hosting platform provides the client's IP address and store it in a variable
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
  const userAgent = request.headers.get("user-agent") || "";

  // Set the IP and user agent headers into request to be used in the action
  requestHeaders.set("x-forwarded-for", ip);
  requestHeaders.set("user-agent", userAgent);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}