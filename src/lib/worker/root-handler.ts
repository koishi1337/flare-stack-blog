import { OAuthProvider } from "@cloudflare/workers-oauth-provider";
import { McpApiHandler } from "@/features/mcp/api/mcp-api-handler";
import { createWorkersOAuthProviderOptions } from "@/features/oauth-provider/oauth-provider.config";
import { appWorkerHandler } from "./app-handler";
 import { handleUsersRequest } from '@/features/users/api/users-api.handler';

let oauthProvider: OAuthProvider<Env> | null = null;

function getOAuthProvider() {
  if (oauthProvider) {
    return oauthProvider;
  }

  oauthProvider = new OAuthProvider(
    createWorkersOAuthProviderOptions({
      apiHandlers: {
        "/mcp": McpApiHandler,
      },
      defaultHandler: appWorkerHandler,
    }),
  );

  return oauthProvider;
}

export function handleRootRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
) {
 if (url.pathname === '/api/users') {
    return handleUsersRequest(request, env);
  }
  return getOAuthProvider().fetch(request, env, ctx);
}
