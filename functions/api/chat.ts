import { generateText } from 'ai';
import { createWorkersAI } from 'workers-ai-provider';

interface Env {
  AI: Ai;
  NODE_ENV: 'development' | 'preview' | 'production';
}

const PROMPT = {
  role: 'system',
  content:
    "You are a superhero and the player can ask up to 5 questions to guess your secret identity. You can offer clues as long as you don't reveal who you are. If the player guesses your secret identity, then the player wins. If the player does not guess your secret identity, then the player loses. At the end of the game, you reveal who are you are.",
} as const;

const MAX_TOKENS = 100;

/**
 * POST /api/chat
 *
 * @param context - Event context.
 * @returns - Response.
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { messages } = await context.request.json<{
    messages: RoleScopedChatInput[];
  }>();

  messages.unshift(PROMPT);

  const workersai = createWorkersAI({ binding: context.env.AI });

  // https://sdk.vercel.ai/providers/community-providers/cloudflare-workers-ai#generatetext
  const result = await generateText({
    model: workersai('@cf/meta/llama-3.1-8b-instruct'),
    maxTokens: MAX_TOKENS,
    messages,
  });

  return new Response(result.text, getResponseInit(context));
};

/**
 * OPTIONS /api/chat
 *
 * @param context - Event context.
 * @returns - Response.
 */
export const onRequestOptions: PagesFunction<Env> = async (context) => {
  return new Response(null, { ...getResponseInit(context), status: 204 });
};

/**
 * Get response init.
 *
 * @param context - Event context.
 * @returns - Response init.
 */
function getResponseInit(
  context: EventContext<Env, '', unknown>,
): ResponseInit {
  if (context.env.NODE_ENV === 'development') {
    return {
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
}
