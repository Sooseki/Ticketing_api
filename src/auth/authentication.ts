import { Request } from 'express';
import { ApiError } from '../classes/Errors/ApiError';
import { ErrorCode } from '../classes/Errors/ErrorCode';
import { verify } from 'jsonwebtoken';

export async function authentication (
  request: Request<{}, any, any, any>
): Promise<boolean> {

  if (!request.headers.authorization) {
    throw new ApiError(ErrorCode.Unauthorized, 'auth/missing-header', 'Missing authorization header');
  }  

  const SECRET = process.env.SECRET || 'quitelongkeysecret'

  try {
    verify(request.headers.authorization, SECRET)
    return true
  } catch (err) {
    throw err
  }
}
