import { Handler } from '@netlify/functions';
import { dataStore } from '../lib/dataStore';
import { withCors, withSecurity } from '../lib/cors';
import { formatError, formatSuccess, UnauthorizedError, ValidationError, NotFoundError } from '../lib/errors';
import { generateToken, verifyToken, extractTokenFromHeader, JwtPayload } from '../lib/jwt';

export const handler: Handler = async (event) => {
  const headers = withSecurity(withCors({}));

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { email, password } = body;

      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      const user = await dataStore.getById<any>('users', email);
      
      if (!user || user.passwordHash !== password) {
        throw new UnauthorizedError('Invalid credentials');
      }

      if (!user.isActive) {
        throw new UnauthorizedError('Account is inactive');
      }

      const tokenPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId || undefined,
      };

      const token = generateToken(tokenPayload);

      await dataStore.update('users', user.id, {
        lastLoginAt: new Date().toISOString(),
      });

      return {
        ...formatSuccess({ user, token }),
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
