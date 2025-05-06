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

    const data = (await response.json()) as unknown

    // Validate data is an array
    if (!Array.isArray(data)) {
      throw new Error('GitHub API response is not an array')
    }

    try {
      const relevantEvents: GitHubEventResponse[] = data.map(
        (event: unknown) => {
          // Type validation for event fields
          if (
            !event ||
            typeof event !== 'object' ||
            !('id' in event) ||
            !('type' in event) ||
            !('repo' in event) ||
            !('created_at' in event) ||
            !('payload' in event) ||
            typeof event.id !== 'string' ||
            typeof event.type !== 'string' ||
            !event.repo ||
            typeof event.repo !== 'object' ||
            !('name' in event.repo) ||
            typeof event.repo.name !== 'string' ||
            typeof event.created_at !== 'string'
          ) {
            throw new Error(
              'Malformed GitHub event data: ' + JSON.stringify(event)
            )
          }

          const typedEvent = event as GitHubEvent

          return {
            id: typedEvent.id,
            type: typedEvent.type,
            repo: typedEvent.repo.name,
            createdAt: typedEvent.created_at,
            payload: typedEvent.payload,
          }
        }
      )

      return NextResponse.json(relevantEvents)
    } catch (validationError) {
      console.error('Error processing GitHub event data:', validationError)
      return NextResponse.json(
        { error: 'Error processing GitHub API data' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error fetching GitHub activity:', error)
    const message =
      error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
