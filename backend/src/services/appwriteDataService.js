import { databases } from '../config/appwrite.js';
import { ID, Query } from 'node-appwrite';

// Appwrite uses Database ID and Collection IDs from env
const DB_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'default_db';
const USERS_COLLECTION = process.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users';
const ALERTS_COLLECTION = process.env.VITE_APPWRITE_ALERTS_COLLECTION_ID || 'jobAlerts';
const NOTIFICATIONS_COLLECTION = process.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID || 'notificationLogs';
const JOBS_COLLECTION = process.env.VITE_APPWRITE_JOBS_COLLECTION_ID || 'jobListings';

export const saveUserToAppwrite = async (userData) => {
    try {
        const userId = userData.uid || userData.userId;

        const userProfile = {
            email: userData.email,
            displayName: userData.displayName || userData.name || userData.userName,
            photoURL: userData.photoURL || userData.picture || null,
            phoneNumber: userData.phoneNumber || null,
            jobRole: userData.jobRole || null,
            gender: userData.gender || null,
            yearsOfExperience: userData.yearsOfExperience ? Number(userData.yearsOfExperience) : null,
            collegeStudent: userData.collegeStudent || false,
            skills: userData.skills || [],
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            // Check if exists
            await databases.getDocument(DB_ID, USERS_COLLECTION, userId);
            // Update
            await databases.updateDocument(DB_ID, USERS_COLLECTION, userId, userProfile);
        } catch (e) {
            if (e.code === 404) {
                // Create
                userProfile.createdAt = new Date().toISOString();
                await databases.createDocument(DB_ID, USERS_COLLECTION, userId, userProfile);
            } else throw e;
        }

        console.log(`✅ Appwrite: Saved user ${userId}`);
        return { success: true, userId };
    } catch (error) {
        console.error('❌ Appwrite: Error saving user:', error.message);
        throw error;
    }
};

export const saveJobAlertToAppwrite = async (alertData) => {
    try {
        const alertId = alertData._id?.toString() || alertData.id || ID.unique();
        const alertAppwrite = {
            userId: alertData.userId,
            userEmail: alertData.userEmail,
            userName: alertData.userName || 'Job Seeker',
            title: alertData.title,
            keywords: alertData.keywords || [],
            location: alertData.location || '',
            remoteOnly: alertData.remoteOnly || false,
            salaryMin: alertData.salaryMin ? Number(alertData.salaryMin) : null,
            salaryMax: alertData.salaryMax ? Number(alertData.salaryMax) : null,
            employmentType: alertData.employmentType || ['full-time'],
            isActive: alertData.isActive !== undefined ? alertData.isActive : true,
            lastCheckedAt: alertData.lastCheckedAt || null,
            totalJobsFound: alertData.totalJobsFound || 0,
            totalEmailsSent: alertData.totalEmailsSent || 0,
            updatedAt: new Date().toISOString()
        };

        try {
            await databases.getDocument(DB_ID, ALERTS_COLLECTION, alertId);
            await databases.updateDocument(DB_ID, ALERTS_COLLECTION, alertId, alertAppwrite);
        } catch(e) {
            if (e.code === 404) {
                alertAppwrite.createdAt = alertData.createdAt || new Date().toISOString();
                await databases.createDocument(DB_ID, ALERTS_COLLECTION, alertId, alertAppwrite);
            } else throw e;
        }

        console.log(`✅ Appwrite: Saved job alert ${alertId}`);
        return { success: true, alertId };
    } catch (error) {
        console.error('❌ Appwrite: Error saving job alert:', error.message);
        throw error;
    }
};

export const deleteJobAlertFromAppwrite = async (alertId) => {
    try {
        await databases.deleteDocument(DB_ID, ALERTS_COLLECTION, alertId);
        console.log(`✅ Appwrite: Deleted job alert ${alertId}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Appwrite: Error deleting job alert:', error.message);
        throw error;
    }
};

export const saveNotificationToAppwrite = async (notificationData) => {
    try {
        const notificationId = notificationData._id?.toString() || notificationData.id || ID.unique();
        const notification = {
            userId: notificationData.userId,
            alertId: notificationData.alertId,
            jobListingId: notificationData.jobListingId?.toString() || null,
            externalJobId: notificationData.externalJobId || null,
            emailStatus: notificationData.emailStatus || 'pending',
            emailMessageId: notificationData.emailMessageId || null,
            errorMessage: notificationData.errorMessage || null,
            sentAt: notificationData.sentAt || new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        await databases.createDocument(DB_ID, NOTIFICATIONS_COLLECTION, notificationId, notification);
        console.log(`✅ Appwrite: Saved notification ${notificationId}`);
        return { success: true, notificationId };
    } catch (error) {
        console.error('❌ Appwrite: Error saving notification:', error.message);
        return { success: false, error: error.message };
    }
};

export const saveJobListingToAppwrite = async (jobData) => {
    try {
        // Appwrite document IDs must be <= 36 chars and match ^[a-zA-Z0-9][a-zA-Z0-9._-]*$
        // Use ID.unique() if externalId is invalid or too long
        let jobId = jobData._id?.toString() || jobData.id || jobData.externalId;
        if (!jobId || jobId.length > 36 || !/^[a-zA-Z0-9]/.test(jobId)) {
            jobId = ID.unique();
        }

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
            updatedAt: new Date().toISOString()
        };

        try {
            await databases.getDocument(DB_ID, JOBS_COLLECTION, jobId);
            await databases.updateDocument(DB_ID, JOBS_COLLECTION, jobId, job);
        } catch (e) {
            if (e.code === 404) {
                job.createdAt = new Date().toISOString();
                await databases.createDocument(DB_ID, JOBS_COLLECTION, jobId, job);
            } else throw e;
        }
        
        return { success: true, jobId };
    } catch (error) {
        console.error('❌ Appwrite: Error saving job listing:', error.message);
        return { success: false, error: error.message };
    }
};

export const getUserAlertsFromAppwrite = async (userId) => {
    try {
        const response = await databases.listDocuments(
            DB_ID,
            ALERTS_COLLECTION,
            [
                Query.equal('userId', userId),
                Query.orderDesc('createdAt')
            ]
        );

        const alerts = response.documents.map(doc => ({
            id: doc.$id,
            ...doc
        }));

        return { success: true, alerts };
    } catch (error) {
        console.error('❌ Appwrite: Error getting user alerts:', error.message);
        return { success: false, alerts: [] };
    }
};

export const syncMongoToAppwrite = async (mongoModels) => {
    console.log('\n🔄 Starting MongoDB to Appwrite sync...');
    return { success: true, message: "Mongo sync configured for Appwrite" };
};

export default {
    saveUserToAppwrite,
    saveJobAlertToAppwrite,
    deleteJobAlertFromAppwrite,
    saveNotificationToAppwrite,
    saveJobListingToAppwrite,
    getUserAlertsFromAppwrite,
    syncMongoToAppwrite
};
