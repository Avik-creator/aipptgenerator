export function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for");
  console.log("Client IP Address:", ip);
  return new Response(JSON.stringify({ ip }))
}