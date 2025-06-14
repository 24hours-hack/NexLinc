document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const telemedicineAuthPrompt = document.getElementById('telemedicineAuthPrompt');
    const telemedicineService = document.getElementById('telemedicineService');
    const generateLinkBtn = document.getElementById('generateLinkBtn');
    const meetingLinkDisplay = document.getElementById('meetingLinkDisplay');
    const meetingLink = document.getElementById('meetingLink');
    const copyLinkBtn = document.getElementById('copyLinkBtn');

    // Function to update the UI based on login status
    function updateTelemedicineUI() {
        if (window.isLoggedIn()) {
            telemedicineAuthPrompt.style.display = 'none';
            telemedicineService.style.display = 'block';
            console.log("Telemedicine UI: User is logged in, showing service content.");
        } else {
            telemedicineAuthPrompt.style.display = 'block';
            telemedicineService.style.display = 'none';
            meetingLinkDisplay.style.display = 'none'; // Hide link if user logs out or isn't logged in
            console.log("Telemedicine UI: User is NOT logged in, showing login prompt.");
        }
    }

    // Event listener for generating meeting link
    generateLinkBtn.addEventListener('click', function() {
        if (!window.isLoggedIn()) {
            window.showCustomMessage('Please log in to generate a meeting link.', 'info', () => {
                window.location.href = 'login_signin.html?action=login'; // Redirect if somehow not logged in
            });
            return;
        }

        // Simulate generating a unique meeting link that resembles a Google Meet link.
        // NOTE: This is a client-side simulation. It will not create a real Google Meet meeting.
        // A real video call system would require backend integration (e.g., Google Meet API, Zoom API, WebRTC).
        const generateMeetId = () => {
            // Google Meet IDs are typically 10 characters long, in the format xxx-yyyy-zzz
            const generateRandomString = (length) => Math.random().toString(36).substring(2, 2 + length);
            const part1 = generateRandomString(3);
            const part2 = generateRandomString(4);
            const part3 = generateRandomString(3);
            return `${part1}-${part2}-${part3}`;
        };
        const uniqueMeetId = generateMeetId();
        const generatedLink = `https://meet.google.com/${uniqueMeetId}`; // Example: Google Meet link format

        meetingLink.href = generatedLink;
        meetingLink.textContent = generatedLink;
        meetingLinkDisplay.style.display = 'block';

        window.showCustomMessage('Meeting link generated successfully! You can copy it or click to open.', 'success');

        // Optional: Deduct credits for generating link (example)
        // You can integrate Firestore here using window.getFirestoreInstance() and window.getCurrentUserId()
        /*
        const userId = window.getCurrentUserId();
        if (userId) {
            const db = window.getFirestoreInstance();
            const appId = window.getAppId(); // Get appId from auth.js
            const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile`, 'data');
            // Assuming getDoc and updateDoc are imported or globally available (they should be from auth.js implicitly)
            // if you need them here, you might need to import them again if not careful with modules.
            // For this snippet, assuming getDoc and updateDoc are accessible.
            getDoc(userDocRef).then(docSnap => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.credits >= 10) { // Example cost
                        updateDoc(userDocRef, {
                            credits: userData.credits - 10,
                            recentActivity: arrayUnion(`Generated telemedicine link (${new Date().toLocaleDateString()})`)
                        }).then(() => {
                            console.log("Credits deducted for meeting link.");
                        }).catch(error => console.error("Error deducting credits:", error));
                    } else {
                        window.showCustomMessage("Not enough credits to generate link. Please earn more.", 'error');
                    }
                } else {
                    console.warn("User profile not found in Firestore for credit deduction.");
                }
            }).catch(error => console.error("Error fetching user data for credits:", error));
        } else {
            console.warn("User ID not available for credit deduction.");
        }
        */
    });

    // Event listener for copying link to clipboard
    copyLinkBtn.addEventListener('click', function() {
        const linkToCopy = meetingLink.textContent;
        // Use document.execCommand('copy') for better compatibility in iframes
        const textarea = document.createElement('textarea');
        textarea.value = linkToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            window.showCustomMessage('Meeting link copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            window.showCustomMessage('Failed to copy link. Please copy it manually.', 'error');
        }
        document.body.removeChild(textarea);
    });

    // Listen for the custom event from auth.js to update UI
    window.addEventListener('ayurjeev:auth-ready', updateTelemedicineUI);

    // Attach event listener for the profile button in the nav bar
    const profileButton = document.getElementById('nav-profile-button');
    if (profileButton) {
        profileButton.addEventListener('click', () => {
            if (window.isLoggedIn()) {
                window.location.href = 'profile.html';
            } else {
                window.showCustomMessage("Please log in to view your profile.", 'info');
            }
        });
    }
});
