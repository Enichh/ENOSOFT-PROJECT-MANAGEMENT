import { Handler } from '@netlify/functions';
import { dataStore } from '../lib/dataStore';
import { withCors, withSecurity } from '../lib/cors';
import { formatError, formatSuccess, UnauthorizedError, ForbiddenError, ValidationError } from '../lib/errors';
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
    const user = await authenticateUser(event.headers.authorization);

    if (event.httpMethod === 'GET') {
      if (user.role !== 'admin') {
        throw new ForbiddenError('Admin access required');
      }

      const { department, jobType, category } = event.queryStringParameters || {};

      if (department || jobType || category) {
        const filters: any = {};
        if (department) filters.department = department;
        if (jobType) filters.jobType = jobType;
        if (category) filters.category = category;
        const employees = await dataStore.query('employees', filters);
        return { ...formatSuccess(employees), headers };
      }

      const employees = await dataStore.getAll('employees');
      return { ...formatSuccess(employees), headers };
    }

    if (event.httpMethod === 'POST') {
      if (user.role !== 'admin') {
        throw new ForbiddenError('Admin access required');
      }

      const body = JSON.parse(event.body || '{}');
      const { name, email, department, jobType, category, skills, joinDate } = body;

      if (!name || !email || !department || !jobType || !category || !joinDate) {
        throw new ValidationError('Missing required fields');
      }

      const existing = await dataStore.query('employees', { email });
      if (existing.length > 0) {
        throw new ValidationError('Employee with this email already exists');
      }

      const employee = await dataStore.create('employees', {
        name,
        email,
        department,
        jobType,
        category,
        skills: skills || [],
        joinDate,
        isActive: true,
      });

      return { ...formatSuccess(employee), headers };
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
