import { sessionOptions } from '@/lib/sessionOptions'

describe('sessionOptions', () => {
  it('uses depo_session as cookie name', () => {
    expect(sessionOptions.cookieName).toBe('depo_session')
  })

  it('sets httpOnly to true', () => {
    expect(sessionOptions.cookieOptions?.httpOnly).toBe(true)
  })

  it('sets sameSite to lax', () => {
    expect(sessionOptions.cookieOptions?.sameSite).toBe('lax')
  })

  it('sets maxAge to 8 hours in seconds', () => {
    expect(sessionOptions.cookieOptions?.maxAge).toBe(60 * 60 * 8)
  })

  it('sets secure based on NODE_ENV', () => {
    // In test env (not production), secure should be false
    expect(sessionOptions.cookieOptions?.secure).toBe(false)
  })
})
