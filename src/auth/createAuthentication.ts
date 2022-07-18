import { sign } from 'jsonwebtoken'


export async function createAuthentication (
  data: number
): Promise<string> {

  const SECRET = process.env.SECRET || 'quitelongkeysecret'
  const encoded = sign({data}, SECRET)

  return encoded
}
