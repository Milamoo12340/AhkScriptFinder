// server/openaiClient.ts
import OpenAI from "openai";
import { config } from "./config";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let sdkClient: OpenAI | null = null;
if (config.openai.apiKey) {
  sdkClient = new OpenAI({ apiKey: config.openai.apiKey, baseURL: config.openai.baseURL });
}

/**
 * Send request to OpenAI-compatible endpoint.
 * - If OPENAI_API_KEY exists, use the SDK.
 * - Else if VERCEL_OIDC_TOKEN exists, call the REST endpoint with that token.
 * - Else if AI_GATEWAY_API_KEY exists, use that as fallback.
 */
export async function sendOpenAIRequest(path: string, body: any) {
  // Use SDK when available (simpler)
  if (sdkClient) {
    // Example for chat completions using SDK
    return await sdkClient.chat.completions.create(body);
  }

  // Determine token to use for Authorization
  const token =
    config.openai.gatewayApiKey ||
    config.openai.vercelOidcToken;

  if (!token) {
    throw new Error("No OpenAI API key, gateway key, or Vercel OIDC token available.");
  }

  const url = `${config.openai.baseURL.replace(/\/$/, "")}${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI request failed: ${res.status} ${text}`);
  }

  return await res.json();
}


