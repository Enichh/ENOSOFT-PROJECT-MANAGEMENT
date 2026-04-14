export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

export function withCors(headers: Record<string, string>): Record<string, string> {
  return {
    ...corsHeaders,
    ...headers,
  };
}

export function withSecurity(headers: Record<string, string>): Record<string, string> {
  return {
    ...securityHeaders,
    ...headers,
  };
}
