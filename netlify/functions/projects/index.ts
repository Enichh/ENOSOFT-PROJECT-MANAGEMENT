import { Handler } from '@netlify/functions';
import { dataStore } from '../lib/dataStore';
import { withCors, withSecurity } from '../lib/cors';
import { formatError, formatSuccess, ForbiddenError, ValidationError, UnauthorizedError } from '../lib/errors';
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
      if (user.role === 'admin') {
        const projects = await dataStore.getAll('projects');
        return { ...formatSuccess(projects), headers };
      }

      if (user.role === 'employee' && user.employeeId) {
        const projects = await dataStore.getAll('projects');
        const filtered = projects.filter((p: any) => 
          p.assignedEmployeeIds.includes(user.employeeId)
        );
        return { ...formatSuccess(filtered), headers };
      }

      throw new ForbiddenError('Invalid user role');
    }

    if (event.httpMethod === 'POST') {
      if (user.role !== 'admin') {
        throw new ForbiddenError('Admin access required');
      }

      const body = JSON.parse(event.body || '{}');
      const { name, description, startDate, deadline, assignedEmployeeIds } = body;

      if (!name || !description || !startDate || !deadline) {
        throw new ValidationError('Missing required fields');
      }

      const project = await dataStore.create('projects', {
        name,
        description,
        status: 'planning',
        priority: 'medium',
        startDate,
        deadline,
        assignedEmployeeIds: assignedEmployeeIds || [],
        createdBy: user.userId,
      });

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
