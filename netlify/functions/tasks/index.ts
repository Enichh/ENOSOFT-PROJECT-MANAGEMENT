import { Handler } from '@netlify/functions';
import { dataStore } from '../lib/dataStore';
import { withCors, withSecurity } from '../lib/cors';
import { formatError, formatSuccess, ValidationError, UnauthorizedError } from '../lib/errors';
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
    const user = await authenticateUser(event.headers.authorization || null);

    if (event.httpMethod === 'GET') {
      const { employeeId, projectId } = event.queryStringParameters || {};

      if (employeeId) {
        const tasks = await dataStore.query('tasks', { employeeId });
        return { ...formatSuccess(tasks), headers };
      }

      if (projectId) {
        const tasks = await dataStore.query('tasks', { projectId });
        return { ...formatSuccess(tasks), headers };
      }

      if (user.role === 'admin') {
        const tasks = await dataStore.getAll('tasks');
        return { ...formatSuccess(tasks), headers };
      }

      if (user.role === 'employee' && user.employeeId) {
        const tasks = await dataStore.query('tasks', { employeeId: user.employeeId });
        return { ...formatSuccess(tasks), headers };
      }

      return { ...formatSuccess([]), headers };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { projectId, employeeId, title, description, dueDate, priority } = body;

      if (!projectId || !employeeId || !title || !dueDate) {
        throw new ValidationError('Missing required fields');
      }

      const task = await dataStore.create('tasks', {
        projectId,
        employeeId,
        title,
        description: description || '',
        status: 'todo',
        priority: priority || 'medium',
        dueDate,
        completedAt: null,
      });

      return { ...formatSuccess(task), headers };
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
