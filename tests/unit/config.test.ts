describe('next.config', () => {
  it('allows avatars.githubusercontent.com as an image domain', async () => {
    const { default: config } = await import('@/next.config')
    expect(config.images?.domains).toContain('avatars.githubusercontent.com')
  })
})
