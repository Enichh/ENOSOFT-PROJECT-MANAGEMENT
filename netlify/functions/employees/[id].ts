import { Handler } from '@netlify/functions';
import { dataStore } from '../lib/dataStore';
import { withCors, withSecurity } from '../lib/cors';
import { formatError, formatSuccess, NotFoundError, ValidationError } from '../lib/errors';
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
    await authenticateUser(event.headers.authorization);

    const id = event.pathParameters?.id;
    if (!id) {
      throw new ValidationError('Employee ID is required');
    }

    if (event.httpMethod === 'GET') {
      const employee = await dataStore.getById('employees', id);
      if (!employee) {
        throw new NotFoundError('Employee not found');
      }
      return { ...formatSuccess(employee), headers };
    }

    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const employee = await dataStore.update('employees', id, body);
      return { ...formatSuccess(employee), headers };
    }

    if (event.httpMethod === 'DELETE') {
      await dataStore.delete('employees', id);
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
