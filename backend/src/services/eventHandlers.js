import { eventBus, Events } from './eventBus.js';

/**
 * Event Handlers for Career Pilot
 *
 * Registers all listeners on the central event bus.
 * Handlers are grouped into two categories:
 *   1. Notification handlers  – send emails, push notifications, socket alerts
 *   2. Analytics handlers     – log metrics, track usage, record milestones
 *
 * Call `initializeEventHandlers()` once at app startup (e.g. in index.js).
 */

// ═══════════════════════════════════════════════════════════════════════════════
//  NOTIFICATION HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Notify the user when their resume has been enhanced by AI.
 */
const onResumeEnhancedNotification = async (payload) => {
  const { userId, resumeId, enhancementType } = payload;

  console.log(`📧 [Notification] Resume enhanced for user ${userId}`);
  console.log(`   Resume ID   : ${resumeId}`);
  console.log(`   Enhancement : ${enhancementType || 'general'}`);

  // TODO: Integrate with mailService.js to send confirmation email
  // Example:
  // await sendResumeEnhancedMail({ userId, resumeId, enhancementType });
};

/**
 * Notify the user when a job alert is triggered and matches are found.
 */
const onJobAlertTriggeredNotification = async (payload) => {
  const { userId, alertId, matchCount, jobTitle, userEmail } = payload;

  console.log(`📧 [Notification] Job alert triggered for user ${userId}`);
  console.log(`   Alert ID    : ${alertId}`);
  console.log(`   Matches     : ${matchCount || 0}`);
  console.log(`   Job Title   : ${jobTitle || 'N/A'}`);

  // TODO: Integrate with mailService.js / jobAlertSocket.js
  // Example:
  // await sendMatchingJobMail({ userEmail, jobTitle, ... });
  // socketService.emitToUser(userId, 'job_alert', { alertId, matchCount });
};

/**
 * Notify the user when an interview session is completed with results.
 */
const onInterviewCompletedNotification = async (payload) => {
  const { userId, interviewId, overallScore, jobRole } = payload;

  console.log(`📧 [Notification] Interview completed for user ${userId}`);
  console.log(`   Interview ID : ${interviewId}`);
  console.log(`   Score        : ${overallScore || 'pending'}`);
  console.log(`   Role         : ${jobRole || 'N/A'}`);

  // TODO: Integrate with mailService.js to send results summary
  // Example:
  // await sendInterviewResultsMail({ userId, interviewId, overallScore, jobRole });
};

// ═══════════════════════════════════════════════════════════════════════════════
//  ANALYTICS HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Track resume enhancement events for usage analytics.
 */
const onResumeEnhancedAnalytics = async (payload) => {
  const { userId, resumeId, enhancementType, _meta } = payload;

  console.log(`📊 [Analytics] resume_enhanced tracked`);
  console.log(`   User ID     : ${userId}`);
  console.log(`   Timestamp   : ${_meta?.emittedAt}`);

  // TODO: Persist to analytics store / database
  // Example:
  // await AnalyticsModel.create({
  //   event: 'resume_enhanced',
  //   userId,
  //   metadata: { resumeId, enhancementType },
  //   timestamp: _meta?.emittedAt,
  // });
};

/**
 * Track job alert trigger events for platform metrics.
 */
const onJobAlertTriggeredAnalytics = async (payload) => {
  const { userId, alertId, matchCount, _meta } = payload;

  console.log(`📊 [Analytics] job_alert_triggered tracked`);
  console.log(`   User ID     : ${userId}`);
  console.log(`   Match Count : ${matchCount || 0}`);
  console.log(`   Timestamp   : ${_meta?.emittedAt}`);

  // TODO: Persist to analytics store / database
  // Example:
  // await AnalyticsModel.create({
  //   event: 'job_alert_triggered',
  //   userId,
  //   metadata: { alertId, matchCount },
  //   timestamp: _meta?.emittedAt,
  // });
};

/**
 * Track interview completion events for performance analytics.
 */
const onInterviewCompletedAnalytics = async (payload) => {
  const { userId, interviewId, overallScore, jobRole, experienceLevel, _meta } = payload;

  console.log(`📊 [Analytics] interview_completed tracked`);
  console.log(`   User ID     : ${userId}`);
  console.log(`   Score       : ${overallScore || 'N/A'}`);
  console.log(`   Role        : ${jobRole || 'N/A'}`);
  console.log(`   Timestamp   : ${_meta?.emittedAt}`);

  // TODO: Persist to analytics store / database
  // Example:
  // await AnalyticsModel.create({
  //   event: 'interview_completed',
  //   userId,
  //   metadata: { interviewId, overallScore, jobRole, experienceLevel },
  //   timestamp: _meta?.emittedAt,
  // });
};

// ═══════════════════════════════════════════════════════════════════════════════
//  INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Register all event handlers on the central event bus.
 * Call this once during application startup.
 */
export const initializeEventHandlers = () => {
  console.log('\n🔗 Registering event handlers...\n');

  // ── Notification listeners ────────────────────────────────────────────────
  eventBus.register(
    Events.RESUME_ENHANCED,
    'ResumeEnhanced:Notification',
    onResumeEnhancedNotification,
  );

  eventBus.register(
    Events.JOB_ALERT_TRIGGERED,
    'JobAlertTriggered:Notification',
    onJobAlertTriggeredNotification,
  );

  eventBus.register(
    Events.INTERVIEW_COMPLETED,
    'InterviewCompleted:Notification',
    onInterviewCompletedNotification,
  );

  // ── Analytics listeners ───────────────────────────────────────────────────
  eventBus.register(
    Events.RESUME_ENHANCED,
    'ResumeEnhanced:Analytics',
    onResumeEnhancedAnalytics,
  );

  eventBus.register(
    Events.JOB_ALERT_TRIGGERED,
    'JobAlertTriggered:Analytics',
    onJobAlertTriggeredAnalytics,
  );

  eventBus.register(
    Events.INTERVIEW_COMPLETED,
    'InterviewCompleted:Analytics',
    onInterviewCompletedAnalytics,
  );

  // ── Summary ───────────────────────────────────────────────────────────────
  const registry = eventBus.getRegistry();
  console.log('\n📋 Event handler registry:');
  for (const [event, handlers] of Object.entries(registry)) {
    console.log(`   ${event} → [${handlers.join(', ')}]`);
  }
  console.log('');
};

export default initializeEventHandlers;
