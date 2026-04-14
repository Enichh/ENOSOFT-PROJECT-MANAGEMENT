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

    if (event.httpMethod === 'POST') {
      if (user.role !== 'admin') {
        throw new ForbiddenError('Admin access required');
      }

      const body = JSON.parse(event.body || '{}');
      const { assignedEmployeeIds } = body;

      if (!assignedEmployeeIds || !Array.isArray(assignedEmployeeIds)) {
        throw new ValidationError('assignedEmployeeIds is required and must be an array');
      }

      const project = await dataStore.update('projects', id, { assignedEmployeeIds });
      return { ...formatSuccess(project), headers };
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
