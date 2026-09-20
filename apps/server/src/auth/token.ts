import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
}

export interface TokenPayload {
    sub: string
}

export function signToken(userId: string) {
    return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
}
