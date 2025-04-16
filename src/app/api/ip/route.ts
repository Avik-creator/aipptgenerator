export function GET(request: Request) {
  const ip = request.headers.get("x-client-ip") || request.headers.get("x-forwarded-for") || request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || request.headers.get("x-cluster-client-ip") || request.headers.get("x-client-ip") || request.headers.get("x-client-ip");
  console.log("Client IP Address:", ip);
  return new Response(JSON.stringify({ ip }))
}