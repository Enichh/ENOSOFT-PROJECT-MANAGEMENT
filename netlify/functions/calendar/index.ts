import { Handler } from '@netlify/functions';
import { dataStore } from '../lib/dataStore';
import { withCors, withSecurity } from '../lib/cors';
import { formatError, formatSuccess, ValidationError } from '../lib/errors';
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

    if (event.httpMethod === 'GET') {
      const { start, end } = event.queryStringParameters || {};

      if (!start || !end) {
        throw new ValidationError('Start and end dates are required');
      }

      const allEvents = await dataStore.getAll('calendar_events');
      const filteredEvents = allEvents.filter((event: any) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        const queryStart = new Date(start);
        const queryEnd = new Date(end);
        return eventStart >= queryStart && eventEnd <= queryEnd;
      });

      return { ...formatSuccess(filteredEvents), headers };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { projectId, employeeIds, title, startDate, endDate, type, description } = body;

      if (!projectId || !title || !startDate || !endDate || !type) {
        throw new ValidationError('Missing required fields');
      }

      const calendarEvent = await dataStore.create('calendar_events', {
        projectId,
        employeeIds: employeeIds || [],
        title,
        startDate,
        endDate,
        type,
        description: description || '',
      });

      return { ...formatSuccess(calendarEvent), headers };
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
