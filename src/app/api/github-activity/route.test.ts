import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET } from './route'

describe('/api/github-activity Route', () => {
  const mockFetch = vi.fn()
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    process.env = { ...originalEnv }
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

  it('should correctly transform all types of GitHub events', async () => {
    const mockApiData = [
      {
        id: '123',
        type: 'PushEvent',
        repo: { name: 'owner/repo1', id: 123456 },
        created_at: '2024-01-01T10:00:00Z',
        payload: {
          commits: [{ message: 'Fix bug', sha: 'abc123' }],
          ref: 'refs/heads/main',
          size: 1,
        },
        public: true,
        actor: { login: 'jhawkins11' },
      },
      {
        id: '456',
        type: 'CreateEvent',
        repo: { name: 'owner/repo2', id: 789012 },
        created_at: '2024-01-02T10:00:00Z',
        payload: {
          ref: 'feature-branch',
          ref_type: 'branch',
          master_branch: 'main',
        },
        public: true,
        actor: { login: 'jhawkins11' },
      },
      {
        id: '789',
        type: 'PullRequestEvent',
        repo: { name: 'owner/repo3', id: 345678 },
        created_at: '2024-01-03T10:00:00Z',
        payload: {
          action: 'opened',
          number: 123,
          pull_request: {
            title: 'New feature',
            html_url: 'https://github.com/owner/repo3/pull/123',
          },
        },
        public: true,
        actor: { login: 'jhawkins11' },
      },
      {
        id: '012',
        type: 'IssueCommentEvent',
        repo: { name: 'owner/repo4', id: 901234 },
        created_at: '2024-01-04T10:00:00Z',
        payload: {
          action: 'created',
          issue: {
            number: 456,
            title: 'Bug report',
          },
          comment: {
            body: 'This is fixed now',
          },
        },
        public: true,
        actor: { login: 'jhawkins11' },
      },
      {
        id: '345',
        type: 'WatchEvent',
        repo: { name: 'owner/repo5', id: 567890 },
        created_at: '2024-01-05T10:00:00Z',
        payload: { action: 'started' },
        public: true,
        actor: { login: 'jhawkins11' },
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiData,
    })

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toHaveLength(mockApiData.length)

    // Verify each event is correctly transformed
    mockApiData.forEach((mockEvent, index) => {
      const transformedEvent = body[index]

      // Check that all required fields are correctly mapped
      expect(transformedEvent.id).toBe(mockEvent.id)
      expect(transformedEvent.type).toBe(mockEvent.type)
      expect(transformedEvent.repo).toBe(mockEvent.repo.name)
      expect(transformedEvent.createdAt).toBe(mockEvent.created_at)

      // Check that payload is preserved exactly as is
      expect(transformedEvent.payload).toEqual(mockEvent.payload)

      // Check that non-mapped fields are not included
      expect(transformedEvent).not.toHaveProperty('public')
      expect(transformedEvent).not.toHaveProperty('actor')
    })
  })

  it('should include Authorization header when GITHUB_PAT is set', async () => {
    // Set GitHub PAT token
    process.env.GITHUB_PAT = 'test-github-token'

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    await GET()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'token test-github-token',
        }),
      })
    )
  })

  it('should not include Authorization header when GITHUB_PAT is not set', async () => {
    // Make sure GITHUB_PAT is not set
    delete process.env.GITHUB_PAT

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    await GET()

    // Verify fetch was called without the Authorization header
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      })
    )
  })

  it('should handle malformed GitHub API responses with missing repo property', async () => {
    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    // Create malformed data (missing repo object)
    const malformedData = [
      {
        id: '123',
        type: 'PushEvent',
        // repo property is missing entirely
        created_at: '2024-01-01T10:00:00Z',
        payload: { size: 1 },
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => malformedData,
    })

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBeDefined()
    expect(consoleErrorSpy).toHaveBeenCalled()

    // Clean up
    consoleErrorSpy.mockRestore()
  })

  it('should handle malformed GitHub API responses with incorrect repo type', async () => {
    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    // Create malformed data (repo is not an object)
    const malformedData = [
      {
        id: '123',
        type: 'PushEvent',
        repo: 'Not an object with name property',
        created_at: '2024-01-01T10:00:00Z',
        payload: { size: 1 },
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => malformedData,
    })

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBeDefined()
    expect(consoleErrorSpy).toHaveBeenCalled()

    // Clean up
    consoleErrorSpy.mockRestore()
  })

  it('should handle malformed GitHub API responses with missing repo.name', async () => {
    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    // Create malformed data (repo object without name property)
    const malformedData = [
      {
        id: '123',
        type: 'PushEvent',
        repo: { id: 456 }, // missing name property
        created_at: '2024-01-01T10:00:00Z',
        payload: { size: 1 },
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => malformedData,
    })

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBeDefined()
    expect(consoleErrorSpy).toHaveBeenCalled()

    // Clean up
    consoleErrorSpy.mockRestore()
  })

  it('should handle malformed GitHub API responses with missing created_at', async () => {
    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    // Create malformed data (missing created_at)
    const malformedData = [
      {
        id: '123',
        type: 'PushEvent',
        repo: { name: 'owner/repo1' },
        // created_at is missing
        payload: { size: 1 },
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => malformedData,
    })

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBeDefined()
    expect(consoleErrorSpy).toHaveBeenCalled()

    // Clean up
    consoleErrorSpy.mockRestore()
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

  it('should return default error message when fetch throws a non-Error object', async () => {
    // Throw a string instead of an Error object
    mockFetch.mockRejectedValueOnce('Not an error object')

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Internal server error')
  })

  it('should return default error message when fetch throws null or undefined', async () => {
    // Throw null
    mockFetch.mockRejectedValueOnce(null)

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Internal server error')
  })
})
