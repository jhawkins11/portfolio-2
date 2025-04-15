import { describe, it, expect } from 'vitest'
import { getEventIcon } from './githubEventIcons'
import {
  FiGithub,
  FiGitPullRequest,
  FiCodepen,
  FiStar,
  FiBookmark,
  FiGitBranch,
} from 'react-icons/fi'

describe('getEventIcon', () => {
  it('returns FiGitBranch for PushEvent', () => {
    const result = getEventIcon('PushEvent')
    expect(result.type).toBe(FiGitBranch) // Check component type directly
  })

  it('returns FiGitPullRequest for PullRequestEvent', () => {
    const result = getEventIcon('PullRequestEvent')
    expect(result.type).toBe(FiGitPullRequest)
  })

  it('returns FiCodepen for CreateEvent', () => {
    const result = getEventIcon('CreateEvent')
    expect(result.type).toBe(FiCodepen)
  })

  it('returns FiStar for WatchEvent', () => {
    const result = getEventIcon('WatchEvent')
    expect(result.type).toBe(FiStar)
  })

  it('returns FiBookmark for ForkEvent', () => {
    const result = getEventIcon('ForkEvent')
    expect(result.type).toBe(FiBookmark)
  })

  it('returns FiGithub for unknown event types', () => {
    const result = getEventIcon('SomeOtherEvent')
    expect(result.type).toBe(FiGithub) // Default case check
  })

  it('returns FiGithub for empty event type', () => {
    const result = getEventIcon('')
    expect(result.type).toBe(FiGithub) // Default case check
  })
})
