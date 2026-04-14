import { Handler } from '@netlify/functions';
import { dataStore } from '../lib/dataStore';
import { withCors, withSecurity } from '../lib/cors';
import { formatError, formatSuccess, NotFoundError, ValidationError, UnauthorizedError, ForbiddenError } from '../lib/errors';
import { verifyToken, extractTokenFromHeader } from '../lib/jwt';

async function authenticateUser(authHeader: string | null) {
  const token = extractTokenFromHeader(authHeader);
  if (!token) {
    throw new UnauthorizedError('No token provided');
  }
  return verifyToken(token);
}

export const handler: Handler = async (event: any) => {
  const headers = withSecurity(withCors({}));

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    const authHeader = event.headers.authorization || null;
    const user = await authenticateUser(authHeader);

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
      if (user.role !== 'admin') {
        throw new ForbiddenError('Admin access required');
      }

      const body = JSON.parse(event.body || '{}');
      const { name, email, department, jobType, category, skills } = body;

      if (!name || !email || !department || !jobType || !category) {
        throw new ValidationError('Missing required fields');
      }

      const existing = await dataStore.getById('employees', id);
      if (!existing) {
        throw new NotFoundError('Employee not found');
      }

      if (email !== (existing as any).email) {
        const emailCheck = await dataStore.query('employees', { email });
        if (emailCheck.length > 0) {
          throw new ValidationError('Employee with this email already exists');
        }
      }

      const employee = await dataStore.update('employees', id, {
        name,
        email,
        department,
        jobType,
        category,
        skills: skills || [],
      });
      return { ...formatSuccess(employee), headers };
    }

    if (event.httpMethod === 'DELETE') {
      if (user.role !== 'admin') {
        throw new ForbiddenError('Admin access required');
      }

      const existing = await dataStore.getById('employees', id);
      if (!existing) {
        throw new NotFoundError('Employee not found');
      }

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
