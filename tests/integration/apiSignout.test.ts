/**
 * @jest-environment node
 */

/**
 * Integration tests for POST /api/signout.
 *
 * Drives the route handler directly — no HTTP server is started. The session
 * module is mocked at the module boundary so the real iron-session/next/headers
 * dependencies are never invoked. NEXT_PUBLIC_APP_URL is set in beforeEach and
 * cleaned up in afterEach to keep tests hermetic.
 */

jest.mock('@/lib/session', () => ({ getSession: jest.fn() }))

import { POST } from '@/app/api/signout/route'
import { getSession } from '@/lib/session'

const mockGetSession = getSession as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
})

afterEach(() => {
  delete process.env.NEXT_PUBLIC_APP_URL
})

describe('POST /api/signout', () => {
  it('calls session.destroy()', async () => {
    const mockDestroy = jest.fn()
    mockGetSession.mockResolvedValue({ destroy: mockDestroy })
    await POST()
    expect(mockDestroy).toHaveBeenCalledTimes(1)
  })

  it('redirects to /', async () => {
    mockGetSession.mockResolvedValue({ destroy: jest.fn() })
    const res = await POST()
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/')
  })

  it('works even when session is already empty (no-op destroy)', async () => {
    mockGetSession.mockResolvedValue({ destroy: jest.fn() })
    const res = await POST()
    expect(res.status).toBe(307)
  })
})
