import { act, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import CommentSection from '../components/community/CommentSection'
import { communityApi } from '../services/api'

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    custom: vi.fn(),
    loading: vi.fn(),
  },
}))

vi.mock('../services/api', () => ({
  communityApi: {
    getComments: vi.fn(),
    createComment: vi.fn(),
    toggleLikeComment: vi.fn(),
  },
}))

describe('CommentSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('keeps the latest post comments when an older request resolves late', async () => {
    let resolveFirstRequest
    let resolveSecondRequest

    communityApi.getComments
      .mockImplementationOnce(
        () => new Promise((resolve) => { resolveFirstRequest = resolve })
      )
      .mockImplementationOnce(
        () => new Promise((resolve) => { resolveSecondRequest = resolve })
      )

    const { rerender } = render(
      <CommentSection
        postId="post-a"
        currentUser={{ uid: 'user-1', displayName: 'Alex' }}
      />
    )

    rerender(
      <CommentSection
        postId="post-b"
        currentUser={{ uid: 'user-1', displayName: 'Alex' }}
      />
    )

    await waitFor(() => {
      expect(communityApi.getComments).toHaveBeenCalledTimes(2)
    })

    await act(async () => {
      resolveSecondRequest({
        comments: [
          {
            id: 'comment-new',
            content: 'Latest thread comment',
            createdAt: '2024-01-01T00:00:00.000Z',
            author: { uid: 'user-2', name: 'Jordan' },
          },
        ],
        pagination: { total: 1 },
      })
    })

    expect(
      await screen.findByText('Latest thread comment')
    ).toBeInTheDocument()

    await act(async () => {
      resolveFirstRequest({
        comments: [
          {
            id: 'comment-old',
            content: 'Stale thread comment',
            createdAt: '2024-01-01T00:00:00.000Z',
            author: { uid: 'user-3', name: 'Taylor' },
          },
        ],
        pagination: { total: 1 },
      })
    })

    expect(screen.getByText('Latest thread comment')).toBeInTheDocument()
    expect(screen.queryByText('Stale thread comment')).not.toBeInTheDocument()
  })
})
