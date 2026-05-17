/**
 * Firebase Data Service
 * Syncs important data (users, job alerts, notifications) to Firebase Firestore
 * This ensures data persistence and real-time sync across devices
 */

import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

// Collection references
const usersRef = db.collection('users');
const jobAlertsRef = db.collection('jobAlerts');
const notificationLogsRef = db.collection('notificationLogs');
const jobListingsRef = db.collection('jobListings');

/**
 * Save or update user profile in Firebase
 * @param {Object} userData - User data from authentication
 */
export const saveUserToFirebase = async (userData) => {
    try {
        const userId = userData.uid || userData.userId;
        const userDoc = usersRef.doc(userId);

        const userProfile = {
            uid: userId,
            email: userData.email,
            displayName: userData.displayName || userData.name || userData.userName,
            photoURL: userData.photoURL || userData.picture || null,
            phoneNumber: userData.phoneNumber || null,
            // Additional profile data
            jobRole: userData.jobRole || null,
            gender: userData.gender || null,
            yearsOfExperience: userData.yearsOfExperience || null,
            collegeStudent: userData.collegeStudent || false,
            skills: userData.skills || [],
            // Metadata
            lastLogin: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
        };

        await db.runTransaction(async (tx) => {
            const existing = await tx.get(userDoc);
            const createdAt = existing.exists && existing.data().createdAt
                ? existing.data().createdAt
                : FieldValue.serverTimestamp();

            tx.set(userDoc, {
                ...userProfile,
                createdAt
            }, { merge: true });
        });

        console.log(`✅ Firebase: Saved user ${userId}`);

        return { success: true, userId };
    } catch (error) {
        console.error('❌ Firebase: Error saving user:', error.message);
        throw error;
    }
};

/**
 * Save job alert to Firebase
 * @param {Object} alertData - Job alert data
 */
export const saveJobAlertToFirebase = async (alertData) => {
    try {
        const alertId = alertData._id?.toString() || alertData.id;
        const alertDoc = jobAlertsRef.doc(alertId);

        const alertFirebase = {
            userId: alertData.userId,
            userEmail: alertData.userEmail,
            userName: alertData.userName || 'Job Seeker',
            title: alertData.title,
            keywords: alertData.keywords || [],
            location: alertData.location || '',
            remoteOnly: alertData.remoteOnly || false,
            salaryMin: alertData.salaryMin || null,
            salaryMax: alertData.salaryMax || null,
            employmentType: alertData.employmentType || ['full-time'],
            isActive: alertData.isActive !== undefined ? alertData.isActive : true,
            lastCheckedAt: alertData.lastCheckedAt || null,
            totalJobsFound: alertData.totalJobsFound || 0,
            totalEmailsSent: alertData.totalEmailsSent || 0,
            createdAt: alertData.createdAt || FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
        };

        await alertDoc.set(alertFirebase, { merge: true });
        console.log(`✅ Firebase: Saved job alert ${alertId}`);

        return { success: true, alertId };
    } catch (error) {
        console.error('❌ Firebase: Error saving job alert:', error.message);
        throw error;
    }
};

/**
 * Delete job alert from Firebase
 * @param {string} alertId - Alert ID to delete
 */
export const deleteJobAlertFromFirebase = async (alertId) => {
    try {
        await jobAlertsRef.doc(alertId).delete();
        console.log(`✅ Firebase: Deleted job alert ${alertId}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Firebase: Error deleting job alert:', error.message);
        throw error;
    }
};

/**
 * Save notification log to Firebase
 * @param {Object} notificationData - Notification data
 */
export const saveNotificationToFirebase = async (notificationData) => {
    try {
        const notificationId = notificationData._id?.toString() || notificationData.id;
        const notificationDoc = notificationLogsRef.doc(notificationId);

        const notification = {
            userId: notificationData.userId,
            alertId: notificationData.alertId,
            jobListingId: notificationData.jobListingId?.toString() || null,
            externalJobId: notificationData.externalJobId || null,
            emailStatus: notificationData.emailStatus || 'pending',
            emailMessageId: notificationData.emailMessageId || null,
            errorMessage: notificationData.errorMessage || null,
            sentAt: notificationData.sentAt || FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp()
        };

        await notificationDoc.set(notification, { merge: true });
        console.log(`✅ Firebase: Saved notification ${notificationId}`);

        return { success: true, notificationId };
    } catch (error) {
        console.error('❌ Firebase: Error saving notification:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Save job listing to Firebase
 * @param {Object} jobData - Job listing data
 */
export const saveJobListingToFirebase = async (jobData) => {
    try {
        const jobId = jobData._id?.toString() || jobData.id || jobData.externalId;
        const jobDoc = jobListingsRef.doc(jobId);

        const job = {
            externalId: jobData.externalId,
            title: jobData.title || 'Untitled Position',
            company: jobData.company || 'Unknown Company',
            location: jobData.location || 'Remote',
            description: jobData.description || '',
            employmentType: jobData.employmentType || 'full-time',
            isRemote: jobData.isRemote || false,
            salary: jobData.salary || null,
            applyLink: jobData.applyLink || '#',
            companyLogo: jobData.companyLogo || null,
            postedAt: jobData.postedAt || null,
            source: jobData.source || 'rapidapi',
            createdAt: FieldValue.serverTimestamp()
        };

        await jobDoc.set(job, { merge: true });
        
        return { success: true, jobId };
    } catch (error) {
        console.error('❌ Firebase: Error saving job listing:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Get user's job alerts from Firebase
 * @param {string} userId - User ID
 */
export const getUserAlertsFromFirebase = async (userId) => {
    try {
        const snapshot = await jobAlertsRef
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        const alerts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.(),
            updatedAt: doc.data().updatedAt?.toDate?.()
        }));

        return { success: true, alerts };
    } catch (error) {
        console.error('❌ Firebase: Error getting user alerts:', error.message);
        return { success: false, error: error.message, alerts: [] };
    }
};

/**
 * Sync MongoDB data to Firebase (one-time migration or periodic sync)
 * @param {Object} mongoModels - MongoDB models
 */
export const syncMongoToFirebase = async (mongoModels) => {
    try {
        console.log('\n🔄 Starting MongoDB to Firebase sync...');
        
        const { JobAlert, NotificationLog, JobListing } = mongoModels;
        
        // Sync Job Alerts
        if (JobAlert) {
            const alerts = await JobAlert.find({}).lean();
            console.log(`   Found ${alerts.length} job alerts to sync`);
            
            for (const alert of alerts) {
                await saveJobAlertToFirebase(alert);
            }
        }
        
        // Sync Notification Logs (last 1000)
        if (NotificationLog) {
            const notifications = await NotificationLog.find({})
                .sort({ createdAt: -1 })
                .limit(1000)
                .lean();
            console.log(`   Found ${notifications.length} notifications to sync`);
            
            for (const notification of notifications) {
                await saveNotificationToFirebase(notification);
            }
        }
        
        // Sync Job Listings (last 1000)
        if (JobListing) {
            const jobs = await JobListing.find({})
                .sort({ createdAt: -1 })
                .limit(1000)
                .lean();
            console.log(`   Found ${jobs.length} job listings to sync`);
            
            for (const job of jobs) {
                await saveJobListingToFirebase(job);
            }
        }
        
        console.log('✅ MongoDB to Firebase sync completed\n');
        return { success: true };
    } catch (error) {
        console.error('❌ Sync error:', error.message);
        return { success: false, error: error.message };
    }
};

export default {
    saveUserToFirebase,
    saveJobAlertToFirebase,
    deleteJobAlertFromFirebase,
    saveNotificationToFirebase,
    saveJobListingToFirebase,
    getUserAlertsFromFirebase,
    syncMongoToFirebase
};
