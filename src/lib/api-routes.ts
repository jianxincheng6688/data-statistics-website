import { NextRequest, NextResponse } from 'next/server';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Route {
  path: string;
  method: HttpMethod;
  handler: (request: NextRequest, params: Record<string, string>) => Promise<NextResponse>;
}

const routes: Route[] = [];

export function registerRoute(route: Route) {
  routes.push(route);
}

export function getRouteHandler(path: string, method: HttpMethod): Route['handler'] | null {
  const route = routes.find(r => r.path === path && r.method === method);
  return route ? route.handler : null;
}

export function matchRoute(path: string, method: HttpMethod): { handler: Route['handler'], params: Record<string, string> } | null {
  for (const route of routes) {
    if (route.method !== method) continue;

    const pathParts = path.split('/');
    const routeParts = route.path.split('/');

    if (pathParts.length !== routeParts.length) continue;

    const params: Record<string, string> = {};
    let match = true;

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }

    if (match) {
      return { handler: route.handler, params };
    }
  }

  return null;
}

