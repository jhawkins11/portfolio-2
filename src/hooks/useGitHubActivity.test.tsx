import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useGitHubActivity, {
  formatEvent,
  getRepoInfo,
  GitHubEvent,
} from './useGitHubActivity'

// --- Helper Function Tests ---

describe('GitHub Activity Helpers', () => {
  describe('getRepoInfo', () => {
    it('parses owner/repo correctly', () => {
      expect(getRepoInfo('jhawkins11/portfolio-v2')).toEqual({
        owner: 'jhawkins11',
        repo: 'portfolio-v2',
      })
    })

    it('handles hyphens/numbers in names', () => {
      expect(getRepoInfo('some-user/repo-123')).toEqual({
        owner: 'some-user',
        repo: 'repo-123',
      })
    })

    // Test edge case, though TS should prevent this input type
    it('handles strings without slash (edge case)', () => {
      expect(getRepoInfo('just-a-repo')).toEqual({
        owner: 'just-a-repo',
        repo: undefined,
      })
    })
  })

  describe('formatEvent', () => {
    // Basic event object structure for tests
    const baseEvent: GitHubEvent = {
      id: '1',
      repo: 'owner/repo',
      createdAt: '',
      type: '',
    }

    it('formats PushEvent (with commits array)', () => {
      const event = {
        ...baseEvent,
        type: 'PushEvent',
        payload: { commits: [{}, {}] },
      }
      expect(formatEvent(event)).toBe('Pushed 2 commit(s) to owner/repo')
    })

    it('formats PushEvent (with size property)', () => {
      const event = { ...baseEvent, type: 'PushEvent', payload: { size: 3 } }
      expect(formatEvent(event)).toBe('Pushed 3 commit(s) to owner/repo')
    })

    it('formats CreateEvent (repository type)', () => {
      const event = {
        ...baseEvent,
        type: 'CreateEvent',
        payload: { ref_type: 'repository' },
      }
      expect(formatEvent(event)).toBe('Created repository owner/repo')
    })

    it('formats CreateEvent (branch type)', () => {
      const event = {
        ...baseEvent,
        type: 'CreateEvent',
        payload: { ref_type: 'branch' },
      }
      expect(formatEvent(event)).toBe('Created branch owner/repo')
    })

    it('formats PullRequestEvent (opened)', () => {
      const event = {
        ...baseEvent,
        type: 'PullRequestEvent',
        payload: { action: 'opened' },
      }
      expect(formatEvent(event)).toBe('opened pull request in owner/repo')
    })

    it('formats PullRequestEvent (closed)', () => {
      const event = {
        ...baseEvent,
        type: 'PullRequestEvent',
        payload: { action: 'closed' },
      }
      expect(formatEvent(event)).toBe('closed pull request in owner/repo')
    })

    it('formats WatchEvent', () => {
      const event = { ...baseEvent, type: 'WatchEvent' }
      expect(formatEvent(event)).toBe('Starred repository owner/repo')
    })

    it('formats ForkEvent', () => {
      const event = { ...baseEvent, type: 'ForkEvent' }
      expect(formatEvent(event)).toBe('Forked repository owner/repo')
    })

    it('formats unknown event types generically', () => {
      const event = { ...baseEvent, type: 'GollumEvent' } // Example of another event type
      expect(formatEvent(event)).toBe('GollumEvent in owner/repo')
    })
  })
})

// --- Hook Tests (useGitHubActivity) ---

// Wrapper component providing QueryClient needed by useQuery
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }, // Disable retries for tests
  })
  // Assign the wrapper component to a variable
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  // Add the displayName property for linting/debugging
  TestWrapper.displayName = 'QueryClientTestWrapper'
  return TestWrapper // Return the named component
}

describe('useGitHubActivity Hook', () => {
  // Mock fetch globally for all tests in this suite
  const mockFetch = vi.fn()
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  // Restore original fetch after each test
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts in loading state', () => {
    // Mock fetch to be pending indefinitely
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => new Promise(() => {}),
    })
    const { result } = renderHook(() => useGitHubActivity(), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(true)
  })

  it('fetches and returns data successfully', async () => {
    const mockData: Partial<GitHubEvent>[] = [
      { id: '1', type: 'PushEvent', repo: 'owner/repo1' },
    ]
    // Mock a successful fetch response
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockData })

    const { result } = renderHook(() => useGitHubActivity(), {
      wrapper: createWrapper(),
    })

    // Wait for the query to settle and check the success state
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.data).toEqual(mockData)
  })

  it('handles API error response', async () => {
    const errorMsg = 'API rate limit exceeded'
    // Mock an error response (e.g., 4xx or 5xx)
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: errorMsg }),
    })

    const { result } = renderHook(() => useGitHubActivity(), {
      wrapper: createWrapper(),
    })

    // Wait for the query to settle and check the error state
    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe(errorMsg)
  })

  it('handles network errors (fetch rejection)', async () => {
    const errorMsg = 'Network Failed'
    // Mock fetch to throw an error
    mockFetch.mockRejectedValueOnce(new Error(errorMsg))

    const { result } = renderHook(() => useGitHubActivity(), {
      wrapper: createWrapper(),
    })

    // Wait for the query to settle and check the error state
    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe(errorMsg)
  })
})
