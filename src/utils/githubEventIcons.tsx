import {
  FiGithub,
  FiGitPullRequest,
  FiCodepen,
  FiStar,
  FiBookmark,
  FiGitBranch,
} from 'react-icons/fi'

// Helper to get appropriate icon for event type
export const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'PushEvent':
      return <FiGitBranch className='w-6 h-6 text-primary' />
    case 'PullRequestEvent':
      return <FiGitPullRequest className='w-6 h-6 text-primary' />
    case 'CreateEvent':
      return <FiCodepen className='w-6 h-6 text-primary' />
    case 'WatchEvent':
      return <FiStar className='w-6 h-6 text-primary' />
    case 'ForkEvent':
      return <FiBookmark className='w-6 h-6 text-primary' />
    default:
      return <FiGithub className='w-6 h-6 text-primary' />
  }
}
