import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const key = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_me')

const COOKIE = 'session'

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key)
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    })
    return payload
}

export async function createSession(userId: string) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    const session = await encrypt({ userId, expires })

    const cookieStore = await cookies()
    cookieStore.set(COOKIE, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires,
        sameSite: 'lax',
        path: '/',
    })
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE)
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get(COOKIE)?.value
    if (!session) return null
    try {
        return await decrypt(session)
    } catch (error) {
        return null
    }
}

export async function verifySession() {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(COOKIE)?.value
    const session = await decrypt(cookie || '').catch(() => null)

    if (!session?.userId) {
        return null
    }

    return { isAuth: true, userId: session.userId }
}
