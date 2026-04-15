import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded;
  } catch (error) {
    return null;
  }
}
