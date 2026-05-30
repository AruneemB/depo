import { render, screen } from '@testing-library/react'

jest.mock('@/lib/session', () => ({
  getSession: jest.fn().mockResolvedValue({ accessToken: undefined }),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({ set: jest.fn() }),
}))

jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({ toString: () => 'deadbeef00112233' }),
}))

beforeAll(() => {
  process.env.GITHUB_CLIENT_ID = 'test-client-id'
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
})

import Home from '@/app/page'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

const mockRedirect = redirect as jest.Mock
const mockGetSession = getSession as jest.Mock

describe('Landing Page — authenticated redirect', () => {
  it('redirects authenticated users to /repos without rendering the page', async () => {
    mockGetSession.mockResolvedValueOnce({ accessToken: 'gho_tok' })
    await Home({ searchParams: {} })
    expect(mockRedirect).toHaveBeenCalledWith('/repos')
  })
})

describe('Landing Page', () => {
  it('renders the headline', async () => {
    const jsx = await Home({ searchParams: {} })
    render(jsx as React.ReactElement)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Delete repos in bulk. Finally.'
    )
  })

  it('renders the Sign in with GitHub link', async () => {
    const jsx = await Home({ searchParams: {} })
    render(jsx as React.ReactElement)
    const link = screen.getByRole('link', { name: /sign in with github/i })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toContain('github.com/login/oauth/authorize')
  })

  it('includes public_repo and delete_repo in the OAuth URL', async () => {
    const jsx = await Home({ searchParams: {} })
    render(jsx as React.ReactElement)
    const link = screen.getByRole('link', { name: /sign in with github/i })
    const href = link.getAttribute('href') ?? ''
    expect(href).toContain('scope=public_repo')
    expect(href).toContain('delete_repo')
  })

  it('embeds the CSRF state nonce in the OAuth URL', async () => {
    const jsx = await Home({ searchParams: {} })
    render(jsx as React.ReactElement)
    const link = screen.getByRole('link', { name: /sign in with github/i })
    const href = link.getAttribute('href') ?? ''
    expect(href).toContain('state=deadbeef00112233')
  })

  it('sets the depo_oauth_state cookie before rendering', async () => {
    const { cookies } = await import('next/headers')
    const mockSet = jest.fn()
    ;(cookies as jest.Mock).mockReturnValue({ set: mockSet })

    await Home({ searchParams: {} })

    expect(mockSet).toHaveBeenCalledWith(
      'depo_oauth_state',
      expect.any(String),
      expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
    )
  })

  it('mentions delete_repo scope in the privacy note', async () => {
    const jsx = await Home({ searchParams: {} })
    render(jsx as React.ReactElement)
    expect(screen.getByText(/delete_repo/)).toBeInTheDocument()
  })

  it('shows auth_failed error when ?error=auth_failed', async () => {
    const jsx = await Home({ searchParams: { error: 'auth_failed' } })
    render(jsx as React.ReactElement)
    expect(screen.getByRole('alert')).toHaveTextContent(/sign-in failed/i)
  })

  it('shows session_expired error when ?error=session_expired', async () => {
    const jsx = await Home({ searchParams: { error: 'session_expired' } })
    render(jsx as React.ReactElement)
    expect(screen.getByRole('alert')).toHaveTextContent(/session expired/i)
  })

  it('shows no error alert when no error param', async () => {
    const jsx = await Home({ searchParams: {} })
    render(jsx as React.ReactElement)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows no error alert for unknown error values', async () => {
    const jsx = await Home({ searchParams: { error: 'unknown_error' } })
    render(jsx as React.ReactElement)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
