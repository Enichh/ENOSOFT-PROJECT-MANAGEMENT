import { Handler } from '@netlify/functions';
import { withCors, withSecurity } from '../lib/cors';
import { formatError, formatSuccess, UnauthorizedError } from '../lib/errors';
import { verifyToken, extractTokenFromHeader } from '../lib/jwt';

export const handler: Handler = async (event) => {
  const headers = withSecurity(withCors({}));

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    if (event.httpMethod === 'GET') {
      const authHeader = event.headers.authorization;
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        throw new UnauthorizedError('No token provided');
      }

      const payload = verifyToken(token);

      return {
        ...formatSuccess({
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
          employeeId: payload.employeeId,
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
    return formatError(error as Error);
  }
};
