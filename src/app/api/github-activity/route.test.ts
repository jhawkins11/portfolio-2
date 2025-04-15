import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET } from './route'

describe('/api/github-activity Route', () => {
  const mockFetch = vi.fn()
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return formatted activity on successful fetch', async () => {
    const mockApiData = [
      {
        id: '123',
        type: 'PushEvent',
        repo: { name: 'owner/repo1' },
        created_at: '2024-01-01T10:00:00Z',
        payload: { size: 1 },
      },
      {
        id: '456',
        type: 'WatchEvent',
        repo: { name: 'owner/repo2' },
        created_at: '2024-01-01T11:00:00Z',
        payload: {},
      },
    ]
    const expectedData = [
      {
        id: '123',
        type: 'PushEvent',
        repo: 'owner/repo1',
        createdAt: '2024-01-01T10:00:00Z',
        payload: { size: 1 },
      },
      {
        id: '456',
        type: 'WatchEvent',
        repo: 'owner/repo2',
        createdAt: '2024-01-01T11:00:00Z',
        payload: {},
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiData,
    })

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual(expectedData)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('api.github.com/users/jhawkins11/events/public'),
      expect.any(Object)
    )
  })

  it('should return 500 on GitHub API error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      json: async () => ({ message: 'GitHub API down' }),
    })

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toContain('GitHub API Error: 503 Service Unavailable')
  })

  it('should return 500 on network error during fetch', async () => {
    const errorMsg = 'Network failed'
    mockFetch.mockRejectedValueOnce(new Error(errorMsg))

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe(errorMsg)
  })
})
