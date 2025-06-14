import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase Configuration from user's request
const firebaseConfig = {
    apiKey: "AIzaSyASjim8xHTQyzH8YrPRaP438YdsiljQcHU",
    authDomain: "git24-3b116.firebaseapp.com",
    projectId: "git24-3b116",
    storageBucket: "git24-3b116.firebasestorage.app",
    messagingSenderId: "1058174974791",
    appId: "1:1058174974791:web:07782edfbce07ad5326a62",
    measurementId: "G-LN31CC0EE7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global variables for Canvas environment
const appId = typeof __app_id !== 'undefined' ? __app_id : firebaseConfig.appId;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let currentUser = null; // To store the current authenticated user object
let isAuthInitialized = false; // Flag to track if auth state has been checked

// Custom message display function (replaces alert/confirm)
window.showCustomMessage = (message, type = 'info', callback = null) => {
    const messageBox = document.getElementById('custom-message-box');
    if (!messageBox) {
        console.warn("Custom message box element not found. Message:", message);
        if (callback) callback();
        return;
    }

    messageBox.textContent = message;
    messageBox.className = `custom-message ${type}`; // Add type for styling (e.g., 'info', 'success', 'error')
    messageBox.style.display = 'block';

    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageBox.style.display = 'none';
        if (callback) callback();
    }, 3000);
};


// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    console.log("Auth state changed. User:", user ? user.uid : "No user");

    // Get references to the navigation buttons/links
    const profileButton = document.getElementById('nav-profile-button');
    const navLoginLink = document.getElementById('nav-login-link');
    // Note: nav-logout-button is removed from main nav, handled only on profile.html

    // Update visibility based on authentication state
    if (user) {
        // User is signed in: show profile button, hide login link
        if (profileButton) profileButton.style.display = 'block';
        if (navLoginLink) navLoginLink.style.display = 'none';

        // Set user's first initial if possible for the profile button
        const userInitialElement = document.querySelector('#nav-profile-button .profile-initial');
        if (userInitialElement && user.email) {
            userInitialElement.textContent = user.email.charAt(0).toUpperCase();
        } else if (userInitialElement) {
             userInitialElement.textContent = 'P'; // Default initial if email is not available
        }

    } else {
        // User is signed out: hide profile button, show login link
        if (profileButton) profileButton.style.display = 'none';
        if (navLoginLink) navLoginLink.style.display = 'block';
    }

    // Dispatch a custom event once auth state is initialized for other scripts to use
    if (!isAuthInitialized) {
        isAuthInitialized = true;
        console.log("Dispatching 'ayurjeev:auth-ready' event.");
        window.dispatchEvent(new CustomEvent('ayurjeev:auth-ready', { detail: { user: currentUser } }));
    }
});

// Initial sign-in attempt
(async () => {
    try {
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
            console.log("Signed in with custom token.");
        } else {
            await signInAnonymously(auth);
            console.log("Signed in anonymously.");
        }
    } catch (error) {
        console.error("Firebase initial sign-in error:", error);
        window.showCustomMessage("Authentication error. Please try again later.", 'error');
    }
})();


// Global helper functions
window.isLoggedIn = () => {
    return currentUser !== null;
};

window.getCurrentUserId = () => {
    return currentUser ? currentUser.uid : null;
};

window.getAuthInstance = () => {
    return auth;
};

window.getFirestoreInstance = () => {
    return db;
};

window.getAppId = () => {
    return appId;
};

window.logout = async () => {
    try {
        await signOut(auth);
        window.showCustomMessage("Logged out successfully.", 'success');
        // Redirect to login page after logout
        window.location.href = 'login_signin.html';
    } catch (error) {
        console.error("Error logging out:", error);
        window.showCustomMessage("Error logging out. Please try again.", 'error');
    }
};

// Add a simple message box to the body (can be styled via styles.css or a global CSS file)
document.addEventListener('DOMContentLoaded', () => {
    let messageBox = document.getElementById('custom-message-box');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'custom-message-box';
        messageBox.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50; /* Green for success */
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: none;
            text-align: center;
            font-size: 1.1em;
            opacity: 0.95;
            min-width: 250px;
            transition: all 0.3s ease-in-out;
        `;
        document.body.appendChild(messageBox);
    }
});
