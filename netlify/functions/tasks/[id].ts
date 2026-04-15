import { Handler } from '@netlify/functions';
import { dataStore } from '../lib/dataStore';
import { withCors, withSecurity } from '../lib/cors';
import { formatError, formatSuccess, NotFoundError, ValidationError, UnauthorizedError } from '../lib/errors';
import { verifyToken, extractTokenFromHeader } from '../lib/jwt';

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

    const id = (event as any).pathParameters?.id;
    if (!id) {
      throw new ValidationError('Task ID is required');
    }

    if (event.httpMethod === 'GET') {
      const task = await dataStore.getById('tasks', id);
      if (!task) {
        throw new NotFoundError('Task not found');
      }
      return { ...formatSuccess(task), headers };
    }

    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const task = await dataStore.update('tasks', id, body);
      return { ...formatSuccess(task), headers };
    }

    if (event.httpMethod === 'DELETE') {
      await dataStore.delete('tasks', id);
      return { ...formatSuccess({ id }), headers };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  } catch (error) {
    return formatError(error as Error);
  }
};
