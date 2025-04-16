export function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for');
  if (!ip) {
    return new Response('IP address not found', { status: 404 });
  }
  const ipAddress = ip.split(',')[0].trim();
  return new Response(JSON.stringify({ ip: ipAddress }))  
}

//44.192.81.201