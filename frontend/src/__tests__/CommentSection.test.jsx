import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
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

  test('ignores repeated load more clicks while a page is already loading', async () => {
    let resolveLoadMore

    communityApi.getComments
      .mockResolvedValueOnce({
        comments: Array.from({ length: 20 }, (_, index) => ({
          id: `comment-${index + 1}`,
          content: `Thread comment ${index + 1}`,
          createdAt: '2024-01-01T00:00:00.000Z',
          author: { uid: `user-${index + 1}`, name: `User ${index + 1}` },
        })),
        pagination: { total: 40 },
      })
      .mockImplementationOnce(
        () => new Promise((resolve) => { resolveLoadMore = resolve })
      )

    render(
      <CommentSection
        postId="post-a"
        currentUser={{ uid: 'user-1', displayName: 'Alex' }}
      />
    )

    expect(await screen.findByText('Thread comment 1')).toBeInTheDocument()

    const loadMoreButton = screen.getByRole('button', { name: /load more comments/i })

    fireEvent.click(loadMoreButton)
    await waitFor(() => {
      expect(communityApi.getComments).toHaveBeenCalledTimes(2)
    })

    fireEvent.click(loadMoreButton)
    expect(communityApi.getComments).toHaveBeenCalledTimes(2)
    expect(loadMoreButton).toBeDisabled()

    await act(async () => {
      resolveLoadMore({
        comments: Array.from({ length: 20 }, (_, index) => ({
          id: `comment-${index + 21}`,
          content: `Thread comment ${index + 21}`,
          createdAt: '2024-01-01T00:00:00.000Z',
          author: { uid: `user-${index + 21}`, name: `User ${index + 21}` },
        })),
        pagination: { total: 40 },
      })
    })

    expect(screen.getByText('Thread comment 21')).toBeInTheDocument()
  })
})
