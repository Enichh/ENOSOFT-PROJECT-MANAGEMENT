import { Handler } from '@netlify/functions';
import { withCors, withSecurity } from '../lib/cors';
import { formatError, formatSuccess, ValidationError, UnauthorizedError } from '../lib/errors';
import { verifyToken, extractTokenFromHeader } from '../lib/jwt';
import { CHAT_SYSTEM_PROMPT } from '../../../src/types/aiPrompts';
import OpenAI from 'openai';

async function authenticateUser(authHeader: string | null) {
  const token = extractTokenFromHeader(authHeader);
  if (!token) {
    throw new UnauthorizedError('No token provided');
  }
  return verifyToken(token);
}

export const handler: Handler = async (event) => {
  const headers = withSecurity(withCors({}));

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    await authenticateUser(event.headers.authorization || null);

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { message, conversationHistory, context } = body;

      if (!message) {
        throw new ValidationError('Message is required');
      }

      const openai = new OpenAI({ 
        apiKey: process.env.LONGCAT_API_KEY,
        baseURL: 'https://api.longcat.chat/openai'
      });

      const messages: any[] = [
        { role: 'system', content: CHAT_SYSTEM_PROMPT },
      ];

      if (conversationHistory && Array.isArray(conversationHistory)) {
        messages.push(...conversationHistory);
      }

      messages.push({ role: 'user', content: message });

      if (context) {
        messages.push({
          role: 'system',
          content: `Context: ${JSON.stringify(context)}`,
        });
      }

      const completion = await openai.chat.completions.create({
        model: 'LongCat-Flash-Chat',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content || 'No response generated';

      const updatedHistory = [
        ...(conversationHistory || []),
        { role: 'user', content: message },
        { role: 'assistant', content: response },
      ];

      return {
        ...formatSuccess({
          response,
          conversationHistory: updatedHistory,
        }),
        headers,
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('AI chat error:', error);
    return formatError(error as Error);
  }
};
