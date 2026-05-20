import { z } from 'zod';

/**
 * PUT /api/auth/notification-preferences
 */
export const updateNotificationPrefsSchema = z.object({
  jobAlerts: z.boolean({
    required_error: 'jobAlerts is required',
    invalid_type_error: 'jobAlerts must be a boolean',
  }),
  directMessages: z.boolean({
    required_error: 'directMessages is required',
    invalid_type_error: 'directMessages must be a boolean',
  }),
  proposalUpdates: z.boolean({
    required_error: 'proposalUpdates is required',
    invalid_type_error: 'proposalUpdates must be a boolean',
  }),
});
