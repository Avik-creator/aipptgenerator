import {ipAddress} from "@vercel/functions"
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest){
    const ip = ipAddress(request);
    if (!ip) {
        return new Response('IP address not found', { status: 404 });
    }

    request.headers.set('x-forwarded-for', ip);

    return request;
}

export const config = {
    matcher: ["/api/ip"],

}