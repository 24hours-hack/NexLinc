// IMPORTANT: Removed Firestore imports as profile data will now be fetched from IndexedDB
// import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Import the new IndexedDB helper module
import { indexedDBManager } from './local-storage-db.js';


document.addEventListener('DOMContentLoaded', async function() {
    const auth = window.getAuthInstance(); // Still use Firebase Auth for user ID
    // IMPORTANT: Firestore instance is no longer directly needed here
    // const db = window.getFirestoreInstance(); 
    // const appId = window.getAppId(); // App ID is not strictly needed by IndexedDB operations in this context

    const profileLoading = document.getElementById('profile-loading');
    const profileDetailsDiv = document.getElementById('profile-details');
    const profileError = document.getElementById('profile-error');
    const sessionHistoryDiv = document.getElementById('session-history');
    const historyError = document.getElementById('history-error');

    // Listen for auth-ready to ensure Firebase state is loaded before checking
    window.addEventListener('ayurjeev:auth-ready', async () => {
        if (!window.isLoggedIn()) {
            window.showCustomMessage("Please log in to view your profile.", 'info', () => {
                window.location.href = 'login_signin.html';
            });
            return; // Stop execution
        }

        const userId = window.getCurrentUserId();
        if (!userId) {
            profileError.textContent = "User ID not found. Please log in again.";
            profileError.style.display = 'block';
            profileLoading.style.display = 'none';
            return;
        }
        console.log("Attempting to fetch profile for user ID:", userId, " from IndexedDB.");

        // --- Fetch and Display User Profile Data from IndexedDB ---
        profileLoading.style.display = 'block';
        profileDetailsDiv.style.display = 'none';
        profileError.style.display = 'none';

        try {
            const userData = await indexedDBManager.getPatientProfile(userId);

            if (userData) {
                console.log("User profile data fetched successfully from IndexedDB:", userData);

                document.getElementById('profile-username').textContent = userData.username || 'N/A';
                document.getElementById('profile-email').textContent = userData.email || 'N/A';
                document.getElementById('profile-mobile').textContent = userData.mobile || 'N/A';
                document.getElementById('profile-dob').textContent = userData.dob || 'N/A';
                // Ensure age, height, weight display 'N/A' if not a valid number or null
                document.getElementById('profile-age').textContent = userData.age !== undefined && userData.age !== null && !isNaN(userData.age) ? userData.age : 'N/A';
                document.getElementById('profile-height').textContent = userData.height !== undefined && userData.height !== null && !isNaN(userData.height) ? `${userData.height} cm` : 'N/A';
                document.getElementById('profile-weight').textContent = userData.weight !== undefined && userData.weight !== null && !isNaN(userData.weight) ? `${userData.weight} kg` : 'N/A';
                document.getElementById('profile-joined-date').textContent = userData.joinedDate || 'N/A';

                profileDetailsDiv.style.display = 'block';
                profileLoading.style.display = 'none';

                // --- Display Session History (Recent Activity) from IndexedDB ---
                // Fetching from the dedicated sessions store for more detail:
                const detailedSessions = await indexedDBManager.getSessionActivities(userId);
                console.log("Detailed sessions from IndexedDB:", detailedSessions);

                if (detailedSessions.length > 0) {
                    const historyList = document.createElement('ul');
                    // Displaying sessions from the dedicated store (newest first)
                    detailedSessions.forEach(session => {
                        const listItem = document.createElement('li');
                        // Example: "Symptom Check: Cough (2025-06-14 10:30 AM)"
                        const date = new Date(session.timestamp).toLocaleString();
                        listItem.innerHTML = `<i class="fas fa-calendar-alt"></i> <span>${session.type}: ${session.summary || 'No summary'} (${date})</span>`;
                        historyList.appendChild(listItem);
                    });
                    sessionHistoryDiv.innerHTML = ''; // Clear loading text
                    sessionHistoryDiv.appendChild(historyList);
                    console.log("Session history displayed from IndexedDB.");
                } else {
                    sessionHistoryDiv.innerHTML = '<p>No recent activity or sessions recorded yet.</p>';
                    console.log("No recent activity found in IndexedDB sessions store.");
                }

            } else {
                profileError.textContent = "No profile data found for this user in local storage. Please ensure you have signed up correctly or your browser data has not been cleared.";
                profileError.style.display = 'block';
                profileLoading.style.display = 'none';
                sessionHistoryDiv.innerHTML = '<p>No recent activity or sessions recorded yet.</p>';
                console.warn("No profile data document found in IndexedDB for user:", userId);
            }
        } catch (error) {
            console.error("Error fetching user profile data from IndexedDB:", error);
            profileError.textContent = `Error loading profile from local storage: ${error.message}. Please try again or clear browser data.`;
            profileError.style.display = 'block';
            profileLoading.style.display = 'none';
            historyError.textContent = `Error loading history from local storage: ${error.message}.`;
            historyError.style.display = 'block';
        }
    });

    // Attach event listener for the profile button in the nav bar (if on this page)
    const navProfileButton = document.getElementById('nav-profile-button');
    if (navProfileButton) {
        navProfileButton.addEventListener('click', () => {
            // Already on profile page, so maybe scroll to top or refresh
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
