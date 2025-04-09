import { NextResponse } from 'next/server'

interface GitHubEvent {
  id: string
  type: string
  repo: {
    name: string
  }
  created_at: string
  payload: Record<string, unknown>
}

interface GitHubEventResponse {
  id: string
  type: string
  repo: string
  createdAt: string
  payload: Record<string, unknown>
}

export async function GET() {
  const username = 'jhawkins11'
  const githubToken = process.env.GITHUB_PAT

  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=5`,
      {
        headers,
      }
    )

    if (!response.ok) {
      throw new Error(
        `GitHub API Error: ${response.status} ${response.statusText}`
      )
    }

    const data = (await response.json()) as GitHubEvent[]
    const relevantEvents: GitHubEventResponse[] = data.map(
      (event: GitHubEvent) => ({
        id: event.id,
        type: event.type,
        repo: event.repo.name,
        createdAt: event.created_at,
        payload: event.payload,
      })
    )

    return NextResponse.json(relevantEvents)
  } catch (error) {
    console.error('Error fetching GitHub activity:', error)
    const message =
      error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
