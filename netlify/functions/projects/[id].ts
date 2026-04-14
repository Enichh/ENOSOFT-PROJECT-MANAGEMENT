import { Handler } from '@netlify/functions';
import { dataStore } from '../lib/dataStore';
import { withCors, withSecurity } from '../lib/cors';
import { formatError, formatSuccess, NotFoundError, ValidationError, ForbiddenError } from '../lib/errors';
import { verifyToken, extractTokenFromHeader } from '../lib/jwt';

async function authenticateUser(authHeader: string | null) {
  const token = extractTokenFromHeader(authHeader);
  if (!token) {
    throw new Error('No token provided');
  }
  return verifyToken(token);
}

export const handler: Handler = async (event) => {
  const headers = withSecurity(withCors({}));

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    const user = await authenticateUser(event.headers.authorization);

    const id = event.pathParameters?.id;
    if (!id) {
      throw new ValidationError('Project ID is required');
    }

    if (event.httpMethod === 'GET') {
      const project = await dataStore.getById('projects', id);
      if (!project) {
        throw new NotFoundError('Project not found');
      }
      return { ...formatSuccess(project), headers };
    }

    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const project = await dataStore.update('projects', id, body);
      return { ...formatSuccess(project), headers };
    }

    if (event.httpMethod === 'DELETE') {
      if (user.role !== 'admin') {
        throw new ForbiddenError('Admin access required');
      }
      await dataStore.delete('projects', id);
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
