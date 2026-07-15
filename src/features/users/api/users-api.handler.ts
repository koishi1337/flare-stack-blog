 import { Env } from '@/lib/env/env.types';

  export async function handleUsersRequest(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');

    if (key !== 'Koishi1337') {
      return new Response('Unauthorized', { status: 401 });
    }

    try {
      const { results } = await env.DB.prepare(
        "SELECT name, email FROM user WHERE banned = 0"
      ).all();

      // 返回 name:email 格式
      const text = results.map((u: any) => `${u.name}:${u.email}`).join('\n');

      return new Response(text, {
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (error) {
      return new Response('Database error: ' + String(error), { status: 500 });
    }
  }
