import { Handler } from '@netlify/functions';
import { dataStore } from '../lib/dataStore';
import { withCors, withSecurity } from '../lib/cors';
import { formatError, formatSuccess, ValidationError, NotFoundError, UnauthorizedError } from '../lib/errors';
import { verifyToken, extractTokenFromHeader } from '../lib/jwt';
import { EMPLOYEE_RECOMMENDATION_PROMPT } from '../../../src/types/aiPrompts';
import OpenAI from 'openai';

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
    await authenticateUser(event.headers.authorization || null);

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { projectId, requiredSkills, description, count = 5 } = body;

      if (!projectId) {
        throw new ValidationError('Project ID is required');
      }

      const project = await dataStore.getById('projects', projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      const allEmployees = await dataStore.getAll('employees');
      const activeEmployees = allEmployees.filter((e: any) => e.isActive);

      const openai = new OpenAI({ 
        apiKey: process.env.LONGCAT_API_KEY,
        baseURL: 'https://api.longcat.chat/openai'
      });

      const prompt = `${EMPLOYEE_RECOMMENDATION_PROMPT}

Project Details:
- Name: ${(project as any).name}
- Description: ${(project as any).description}
- Required Skills: ${requiredSkills ? requiredSkills.join(', ') : 'Not specified'}
- Additional Context: ${description || 'None'}

Available Employees:
${activeEmployees.map((e: any) => `
- ID: ${e.id}
- Name: ${e.name}
- Department: ${e.department}
- Job Type: ${e.jobType}
- Category: ${e.category}
- Skills: ${e.skills.join(', ')}
`).join('\n')}

Please recommend the top ${count} employees for this project. Return the response as a JSON array with the following structure:
[
  {
    "employeeId": "string",
    "employeeName": "string",
    "reasoning": "string",
    "confidence": "high" | "medium" | "low",
    "skillMatch": ["string"]
  }
]`;

      const completion = await openai.chat.completions.create({
        model: 'LongCat-Flash-Chat',
        messages: [
          { role: 'system', content: 'You are an expert HR assistant. Always respond with valid JSON arrays.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content || '[]';
      let recommendations: any[];

      try {
        const parsed = JSON.parse(responseContent);
        recommendations = Array.isArray(parsed) ? parsed : parsed.recommendations || [];
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        recommendations = [];
      }

      return {
        ...formatSuccess({ recommendations }),
        headers,
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('AI recommendation error:', error);
    return formatError(error as Error);
  }
};
