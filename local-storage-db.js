// local-storage-db.js
// This module handles all IndexedDB operations for patient data.

const DB_NAME = 'AyurJeevDB';
const DB_VERSION = 1;
const STORE_PATIENTS = 'patients'; // Store for individual patient profiles
const STORE_SESSIONS = 'sessions'; // Store for symptom checker/telemedicine sessions
const STORE_IMAGES = 'images';   // Store for image analysis entries

let db;

/**
 * Initializes the IndexedDB database.
 * Creates object stores if they don't exist.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance.
 */
function initDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.errorCode);
            reject(new Error('Failed to open IndexedDB: ' + event.target.error));
        };

        request.onupgradeneeded = (event) => {
            const idb = event.target.result;
            // Create patient store if it doesn't exist
            if (!idb.objectStoreNames.contains(STORE_PATIENTS)) {
                idb.createObjectStore(STORE_PATIENTS, { keyPath: 'userId' });
            }
            // Create sessions store if it doesn't exist
            // Session history will be linked to userId
            if (!idb.objectStoreNames.contains(STORE_SESSIONS)) {
                const sessionStore = idb.createObjectStore(STORE_SESSIONS, { keyPath: 'sessionId', autoIncrement: true });
                sessionStore.createIndex('userId', 'userId', { unique: false });
            }
            // Create images store if it doesn't exist
            // Image analysis will be linked to userId
            if (!idb.objectStoreNames.contains(STORE_IMAGES)) {
                const imageStore = idb.createObjectStore(STORE_IMAGES, { keyPath: 'imageId', autoIncrement: true });
                imageStore.createIndex('userId', 'userId', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('IndexedDB opened successfully.');
            resolve(db);
        };
    });
}

/**
 * Adds or updates a patient profile in IndexedDB.
 * @param {Object} patientData - The patient's profile data. Must include userId.
 * @returns {Promise<void>}
 */
async function savePatientProfile(patientData) {
    const idb = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = idb.transaction([STORE_PATIENTS], 'readwrite');
        const store = transaction.objectStore(STORE_PATIENTS);
        const request = store.put(patientData); // Use put to add or update

        request.onsuccess = () => {
            console.log('Patient profile saved/updated in IndexedDB:', patientData.userId);
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error saving patient profile to IndexedDB:', event.target.error);
            reject(new Error('Failed to save patient profile: ' + event.target.error));
        };
    });
}

/**
 * Retrieves a patient profile from IndexedDB.
 * @param {string} userId - The ID of the user/patient.
 * @returns {Promise<Object|null>} A promise that resolves with the patient data or null if not found.
 */
async function getPatientProfile(userId) {
    const idb = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = idb.transaction([STORE_PATIENTS], 'readonly');
        const store = transaction.objectStore(STORE_PATIENTS);
        const request = store.get(userId);

        request.onsuccess = (event) => {
            const result = event.target.result;
            if (result) {
                console.log('Patient profile retrieved from IndexedDB:', result);
                resolve(result);
            } else {
                console.log('Patient profile not found in IndexedDB for userId:', userId);
                resolve(null);
            }
        };

        request.onerror = (event) => {
            console.error('Error retrieving patient profile from IndexedDB:', event.target.error);
            reject(new Error('Failed to retrieve patient profile: ' + event.target.error));
        };
    });
}

/**
 * Adds a new session activity for a user.
 * @param {string} userId - The ID of the user.
 * @param {Object} sessionData - The session details (e.g., type, timestamp, summary).
 * @returns {Promise<void>}
 */
async function addSessionActivity(userId, sessionData) {
    const idb = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = idb.transaction([STORE_SESSIONS], 'readwrite');
        const store = transaction.objectStore(STORE_SESSIONS);
        
        // Ensure userId is part of the stored object for indexing
        const dataToStore = { ...sessionData, userId, timestamp: Date.now() };
        const request = store.add(dataToStore);

        request.onsuccess = () => {
            console.log('Session activity added for userId:', userId);
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error adding session activity to IndexedDB:', event.target.error);
            reject(new Error('Failed to add session activity: ' + event.target.error));
        };
    });
}

/**
 * Retrieves all session activities for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of session activities.
 */
async function getSessionActivities(userId) {
    const idb = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = idb.transaction([STORE_SESSIONS], 'readonly');
        const store = transaction.objectStore(STORE_SESSIONS);
        const index = store.index('userId');
        const request = index.getAll(userId);

        request.onsuccess = (event) => {
            const activities = event.target.result || [];
            console.log('Session activities retrieved for userId:', userId, activities);
            // Sort by timestamp if not already sorted by index (depends on creation order)
            activities.sort((a, b) => b.timestamp - a.timestamp); // Newest first
            resolve(activities);
        };

        request.onerror = (event) => {
            console.error('Error retrieving session activities from IndexedDB:', event.target.error);
            reject(new Error('Failed to retrieve session activities: ' + event.target.error));
        };
    });
}

/**
 * Adds a new image analysis entry for a user.
 * @param {string} userId - The ID of the user.
 * @param {Object} imageData - The image analysis details (e.g., base64 data, analysis results).
 * @returns {Promise<void>}
 */
async function saveImageAnalysis(userId, imageData) {
    const idb = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = idb.transaction([STORE_IMAGES], 'readwrite');
        const store = transaction.objectStore(STORE_IMAGES);
        
        // Ensure userId is part of the stored object for indexing
        const dataToStore = { ...imageData, userId, timestamp: Date.now() };
        const request = store.add(dataToStore);

        request.onsuccess = () => {
            console.log('Image analysis saved for userId:', userId);
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error saving image analysis to IndexedDB:', event.target.error);
            reject(new Error('Failed to save image analysis: ' + event.target.error));
        };
    });
}

/**
 * Retrieves all image analysis entries for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of image analysis entries.
 */
async function getImageAnalysisHistory(userId) {
    const idb = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = idb.transaction([STORE_IMAGES], 'readonly');
        const store = transaction.objectStore(STORE_IMAGES);
        const index = store.index('userId');
        const request = index.getAll(userId);

        request.onsuccess = (event) => {
            const history = event.target.result || [];
            console.log('Image analysis history retrieved for userId:', userId, history);
            // Sort by timestamp if not already sorted by index
            history.sort((a, b) => b.timestamp - a.timestamp); // Newest first
            resolve(history);
        };

        request.onerror = (event) => {
            console.error('Error retrieving image analysis history from IndexedDB:', event.target.error);
            reject(new Error('Failed to retrieve image analysis history: ' + event.target.error));
        };
    });
}


// Expose functions globally for use in other modules
window.indexedDBManager = {
    initDB,
    savePatientProfile,
    getPatientProfile,
    addSessionActivity,
    getSessionActivities,
    saveImageAnalysis,
    getImageAnalysisHistory
};

// Initialize DB on script load
initDB().catch(error => console.error("Error initializing IndexedDB:", error));
