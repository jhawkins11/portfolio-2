import { useQuery } from '@tanstack/react-query'

export type GitHubEvent = {
  id: string
  type: string
  repo: string
  createdAt: string
  payload?: Record<string, unknown>
}

export interface PushEventPayload {
  commits?: Array<{ message: string }>
  size?: number
}

export interface CreateEventPayload {
  ref_type?: string
  ref?: string
}

export interface PullRequestEventPayload {
  action?: string
  pull_request?: {
    title: string
    html_url: string
  }
}

const fetchGitHubActivity = async (): Promise<GitHubEvent[]> => {
  const res = await fetch('/api/github-activity')
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || 'Failed to fetch GitHub activity')
  }
  return res.json()
}

// Get repository owner and name from full repo name
export const getRepoInfo = (fullRepoName: string) => {
  const [owner, repo] = fullRepoName.split('/')
  return { owner, repo }
}

// Helper to format event descriptions
export const formatEvent = (event: GitHubEvent): string => {
  switch (event.type) {
    case 'PushEvent':
      return `Pushed ${
        (event.payload as PushEventPayload)?.commits?.length ||
        (event.payload as PushEventPayload)?.size ||
        0
      } commit(s) to ${event.repo}`
    case 'CreateEvent':
      return `Created ${
        (event.payload as CreateEventPayload)?.ref_type || 'repository'
      } ${event.repo}`
    case 'PullRequestEvent':
      return `${
        (event.payload as PullRequestEventPayload)?.action || 'Opened'
      } pull request in ${event.repo}`
    case 'WatchEvent':
      return `Starred repository ${event.repo}`
    case 'ForkEvent':
      return `Forked repository ${event.repo}`
    default:
      return `${event.type} in ${event.repo}`
  }
}

// Custom hook for fetching GitHub activity
export default function useGitHubActivity() {
  return useQuery<GitHubEvent[], Error>({
    queryKey: ['githubActivity'],
    queryFn: fetchGitHubActivity,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
