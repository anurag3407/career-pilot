import { Client, Account, Databases, Storage } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// Remove quotes if present
const cleanProjectId = projectId?.replace(/^"|"$/g, '');
const cleanEndpoint = endpoint?.replace(/^"|"$/g, '');

const client = new Client()
    .setEndpoint(cleanEndpoint)
    .setProject(cleanProjectId);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };
