import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginFormDiv = document.getElementById('loginForm');
    const signupFormDiv = document.getElementById('signupForm');

    const loginForm = loginFormDiv.querySelector('form');
    const signupForm = signupFormDiv.querySelector('form');

    const auth = window.getAuthInstance(); // Get Firebase Auth instance from auth.js
    const db = window.getFirestoreInstance(); // Get Firebase Firestore instance from auth.js
    const appId = window.getAppId(); // Get appId from auth.js

    // Function to switch between login and signup forms
    function showForm(formType) {
        if (formType === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginFormDiv.classList.add('active');
            signupFormDiv.classList.remove('active');
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupFormDiv.classList.add('active');
            loginFormDiv.classList.remove('active');
        }
    }

    // Determine initial form to show based on URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    if (action === 'signup') {
        showForm('signup');
    } else {
        showForm('login');
    }

    // Tab button event listeners
    loginTab.addEventListener('click', () => showForm('login'));
    signupTab.addEventListener('click', () => showForm('signup'));


    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = loginForm.querySelector('#loginEmail').value;
        const password = loginForm.querySelector('#loginPassword').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.showCustomMessage("Logged in successfully! Redirecting...");
            setTimeout(() => {
                window.location.href = 'home.html'; // Redirect to home page
            }, 1000);
        } catch (error) {
            console.error("Login error:", error.code, error.message);
            let errorMessage = "Login failed.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "Invalid email or password.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format.";
            }
            window.showCustomMessage(errorMessage, 'error');
        }
    });

    // Signup form submission
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = signupForm.querySelector('#signupUsername').value.trim();
        const email = signupForm.querySelector('#signupEmail').value.trim();
        const mobile = signupForm.querySelector('#signupMobile').value.trim();
        const dob = signupForm.querySelector('#signupDob').value; // YYYY-MM-DD
        const age = parseInt(signupForm.querySelector('#signupAge').value, 10);
        const height = parseFloat(signupForm.querySelector('#signupHeight').value);
        const weight = parseFloat(signupForm.querySelector('#signupWeight').value);
        const password = signupForm.querySelector('#signupPassword').value;
        const confirmPassword = signupForm.querySelector('#signupConfirmPassword').value;

        if (password !== confirmPassword) {
            window.showCustomMessage("Passwords do not match.", 'error');
            return;
        }
        if (password.length < 6) {
            window.showCustomMessage("Password should be at least 6 characters.", 'error');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User signed up:", user.uid);

            // Initialize user profile in Firestore
            const userDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/profile`, 'data');
            
            const profileData = {
                username: username,
                email: email,
                mobile: mobile,
                dob: dob,
                age: age,
                height: height,
                weight: weight,
                credits: 100, // Initial credits
                joinedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                surveyHistory: [], // Placeholder for future use
                chatHistory: [], // Placeholder for future use
                recentActivity: [`Account created (${new Date().toLocaleDateString()})`]
            };

            await setDoc(userDocRef, profileData);
            console.log("User profile saved to Firestore:", profileData);


            window.showCustomMessage(`Account created for ${username}! Redirecting...`, 'success');
            setTimeout(() => {
                window.location.href = 'home.html'; // Redirect to home page
            }, 1000);

        } catch (error) {
            console.error("Signup error:", error.code, error.message);
            let errorMessage = "Signup failed.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already in use.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak. Please choose a stronger one.";
            }
            window.showCustomMessage(errorMessage, 'error');
        }
    });
});
