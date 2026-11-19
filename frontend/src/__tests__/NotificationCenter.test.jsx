import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import NotificationCenter from '../components/NotificationCenter';
import { SocketContext } from '../context/SocketContext';
import { MemoryRouter } from 'react-router-dom';

describe('NotificationCenter Component (#2040)', () => {
  const renderWithSocket = (unreadCount = 0) => {
    const mockSocketContext = {
      notifications: unreadCount > 0 ? Array(unreadCount).fill({ id: '1', read: false, type: 'notification' }) : [],
      unreadCount,
      markRead: vi.fn(),
      markAllRead: vi.fn(),
      dismissNotification: vi.fn(),
    };

    return render(
      <MemoryRouter>
        <SocketContext.Provider value={mockSocketContext}>
          <NotificationCenter />
        </SocketContext.Provider>
      </MemoryRouter>
    );
  };

  it('hides badge completely when unreadCount is 0', () => {
    renderWithSocket(0);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });

  it('displays accurate unread badge count when unreadCount > 0', () => {
    renderWithSocket(5);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
