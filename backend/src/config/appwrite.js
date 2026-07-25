import { Client, Users, Databases, Storage } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

// Clean quotes if present
const cleanProjectId = projectId?.replace(/^"|"$/g, '');
const cleanEndpoint = endpoint?.replace(/^"|"$/g, '');
const cleanApiKey = apiKey?.replace(/^"|"$/g, '');

const client = new Client();

if (cleanEndpoint && cleanProjectId && cleanApiKey) {
    client
        .setEndpoint(cleanEndpoint)
        .setProject(cleanProjectId)
        .setKey(cleanApiKey);
} else {
    console.warn("⚠️ Appwrite environment variables missing in backend!");
}

const users = new Users(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, users, databases, storage };
