document.addEventListener('DOMContentLoaded', function() {
    const educationForm = document.getElementById('educationForm');
    const diagnosisInput = document.getElementById('diagnosis');
    const backgroundInfoTextarea = document.getElementById('backgroundInfo');
    const preferredLanguageSelect = document.getElementById('preferredLanguage');
    const educationResults = document.getElementById('educationResults');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const submitBtn = educationForm.querySelector('button[type="submit"]');

    // Gemini API configuration
    // IMPORTANT: Ensure this key is enabled for gemini-2.0-flash or gemini-pro.
    // For more structured JSON output, gemini-pro is often preferred.
    const GEMINI_API_KEY = 'AIzaSyBcQ5YwhtqBvzsR_mXfNmMCIQL7jjjWdXw'; 
    // Using a more general model for text generation with better JSON handling.
    // If you specifically need gemini-pro, ensure it's enabled for your project.
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;


    // Use window.showCustomMessage from auth.js (if auth.js is loaded as a module)
    // If auth.js isn't loaded as a module or doesn't define it, this will fall back to a console warning.
    const showCustomMessage = window.showCustomMessage || ((msg, type = 'info') => console.warn(`Custom Message (${type}): ${msg}`));

    // Function to set loading state
    function setLoadingState(isLoading) {
        const inputs = educationForm.querySelectorAll('input, textarea, select');
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Generating Resources... <i class="fas fa-spinner fa-spin"></i>'; // Add spinner icon
            inputs.forEach(input => input.disabled = true);
            loadingIndicator.style.display = 'flex'; // Show loading spinner
            educationResults.style.display = 'none'; // Hide previous results
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Get Educational Resources';
            inputs.forEach(input => input.disabled = false);
            loadingIndicator.style.display = 'none'; // Hide loading spinner
        }
    }
    
    // Function to display educational resources
    function displayEducationResults(resources) {
        if (!Array.isArray(resources) || resources.length === 0) {
            educationResults.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-info-circle"></i>
                    <h3>No Resources Found</h3>
                    <p>The AI could not generate specific educational resources based on your input. Please try rephrasing or providing more details.</p>
                </div>
            `;
            educationResults.style.display = 'block';
            educationResults.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        let htmlContent = `
            <div class="results-header">
                <h2>Your Health Education Materials</h2>
                <p>Based on your diagnosis and background:</p>
            </div>
            <div class="resources-container">
        `;
        
        resources.forEach((resource, index) => {
            // Check if resource is an object with 'title' and 'content' or just a string
            if (typeof resource === 'object' && resource !== null && resource.title && resource.content) {
                htmlContent += `
                    <div class="resource-item">
                        <h3><i class="fas fa-book"></i> ${resource.title}</h3>
                        <p>${resource.content}</p>
                    </div>
                `;
            } else {
                // If it's a plain string, just display it
                htmlContent += `
                    <div class="resource-item">
                        <p>${resource}</p>
                    </div>
                `;
            }
        });
        
        htmlContent += `
            </div>
            <div class="results-disclaimer">
                <strong>Important:</strong> This information is for general guidance only. Always consult healthcare professionals for personalized medical advice.
            </div>
            <div class="actions">
                <button type="button" class="btn btn-secondary" onclick="window.print()"><i class="fas fa-print"></i> Print</button>
                <button type="button" class="btn btn-primary" id="newEducationSearchBtn"><i class="fas fa-redo"></i> New Search</button>
            </div>
        `;
        
        educationResults.innerHTML = htmlContent;
        educationResults.style.display = 'block';
        educationResults.scrollIntoView({ behavior: 'smooth' });

        // Add event listener for the "New Search" button
        document.getElementById('newEducationSearchBtn').addEventListener('click', function() {
            educationResults.style.display = 'none';
            diagnosisInput.value = '';
            backgroundInfoTextarea.value = '';
            preferredLanguageSelect.value = ''; // Reset select to default
            diagnosisInput.focus();
        });
    }
    
    // Function to display error messages
    function displayError(message) {
        educationResults.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to Generate Resources</h3>
                <p>${message}</p>
                <button type="button" class="btn btn-primary" onclick="location.reload()"><i class="fas fa-redo"></i> Try Again</button>
            </div>
        `;
        
        educationResults.style.display = 'block';
        educationResults.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Demo function for testing without backend (fallback)
    function generateDemoResources(diagnosis, background, language) {
        return [
            `Understanding ${diagnosis}: Basic information about your condition and how it affects your body.`,
            `Symptom management: Practical tips for managing common symptoms of ${diagnosis}.`,
            `Lifestyle modifications: Diet and exercise recommendations for people with ${diagnosis}.`,
            `Medication adherence: How to properly take prescribed medications for ${diagnosis}.`,
            `Warning signs: When to seek immediate medical attention for ${diagnosis}.`,
            `Daily care routine: Step-by-step self-care guide for managing ${diagnosis}.`,
            `Support resources: Finding help and support groups in your community.`
        ];
    }

    /**
     * Generates personalized health education prompt for Gemini API
     * @param {Object} input - The input parameters (diagnosis, background, language)
     * @returns {string} - The formatted prompt
     */
    function generateHealthEducationPrompt(input) {
        const { diagnosis, background, language } = input;
        
        return `You are a healthcare expert who provides personalized health education materials to patients.
Please provide educational resources in the following categories:
- Basic Information about the condition
- Symptoms to watch for
- Treatment and management tips
- Lifestyle modifications
- When to seek medical help
- Preventive measures
- Home remedies (if applicable and safe)

Consider the patient's cultural context and education level from their background information "${background}" when selecting the resources. The educational resources should be short, concise, and easy to understand.
Respond in the patient's preferred language: ${language}.

Diagnosis: ${diagnosis}

Format your response as a JSON object with an "educationalResources" array. Each item in the array should be a string representing an educational resource. Do NOT include markdown code blocks (e.g., \`\`\`json).

Example format:
{
  "educationalResources": [
    "Understanding [condition]: Simple explanation of what [condition] is and how it affects your body. This should be very simple and clear.",
    "Managing symptoms: Practical tips for dealing with [specific symptoms] at home.",
    "Diet recommendations: Easy-to-follow advice on foods to eat and avoid for [condition].",
    "Exercise guidelines: Simple and safe physical activities recommended for people with [condition].",
    "Medication management: How to take prescribed medications properly and common mistakes to avoid.",
    "Warning signs: Key signs when you need to contact your doctor immediately for [condition].",
    "Daily care routine: A simple, step-by-step guide for daily self-care to manage [condition]."
  ]
}

Make sure the information is:
1. Culturally appropriate
2. Easy to understand based on the background level (e.g., for 'limited literacy' keep it extremely simple)
3. Actionable and practical
4. Medically accurate
5. In the requested language`;
    }

    // Main function to get personalized health education materials from Gemini API
    async function getPersonalizedHealthEducation(input) {
        try {
            // Generate prompt
            const prompt = generateHealthEducationPrompt(input);

            // Prepare request body for Gemini API
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7, // Slightly higher temperature for more varied content
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                    responseMimeType: "application/json", // Request JSON directly
                    responseSchema: { // Define expected JSON schema
                        type: "OBJECT",
                        properties: {
                            "educationalResources": {
                                type: "ARRAY",
                                items: {
                                    type: "STRING"
                                }
                            }
                        }
                    }
                },
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
                ]
            };

            // Make API call to Gemini
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Gemini API Error: ${response.status} - ${errorData.error.message || response.statusText}`);
            }

            const data = await response.json();
            console.log("Raw API Response Data:", data); // Log the full API response

            // Gemini's generateContent with responseMimeType="application/json" returns text that needs JSON.parse()
            if (data.candidates && data.candidates.length > 0 && 
                data.candidates[0].content && data.candidates[0].content.parts &&
                data.candidates[0].content.parts.length > 0) {
                
                const jsonText = data.candidates[0].content.parts[0].text;
                console.log("Extracted JSON text from API response:", jsonText);
                
                let parsedResponse;
                try {
                    parsedResponse = JSON.parse(jsonText);
                } catch (parseError) {
                    console.error("Failed to parse JSON directly from API response:", parseError, "Raw text:", jsonText);
                    // Fallback to a structured response if direct JSON parse fails
                    return { educationalResources: [`Could not parse the response. Raw text received: ${jsonText.substring(0, 500)}...`] };
                }

                if (!parsedResponse.educationalResources || !Array.isArray(parsedResponse.educationalResources)) {
                    throw new Error('Invalid response structure: educationalResources array is required in the parsed JSON.');
                }
                return parsedResponse;

            } else {
                throw new Error('Invalid response format from Gemini API or no content generated.');
            }

        } catch (error) {
            console.error('Error in getPersonalizedHealthEducation:', error);
            throw error; // Re-throw to be caught by the form submit handler
        }
    }
    
    // Event listener for form submission
    educationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const diagnosis = diagnosisInput.value.trim();
        const backgroundInfo = backgroundInfoTextarea.value.trim();
        const language = preferredLanguageSelect.value;
        
        if (!diagnosis || !language) {
            showCustomMessage('Please fill in the Diagnosis and Preferred Language fields.', 'info');
            return;
        }
        
        setLoadingState(true);
        
        try {
            const inputData = {
                diagnosis: diagnosis,
                background: backgroundInfo,
                language: language
            };
            
            const result = await getPersonalizedHealthEducation(inputData);
            displayEducationResults(result.educationalResources);
            
        } catch (error) {
            console.error('Health education generation failed:', error.message);
            
            let errorMessage = `Failed to generate personalized health education materials: ${error.message}. `;
            if (error.message.includes('400')) {
                errorMessage += 'The request to the AI model was malformed or the input was invalid. Please try rephrasing or simplifying your input.';
            } else if (error.message.includes('403')) {
                errorMessage += 'Authentication failed. Please check your API key and ensure it is correctly configured and enabled for the Gemini API.';
            } else if (error.message.includes('429')) {
                errorMessage += 'Too many requests. Our service is currently experiencing high demand. Please wait a moment and try again.';
            } else if (error.message.includes('Invalid response structure')) {
                 errorMessage = 'The AI generated an unexpected response. Please try again or provide different input.';
            } else {
                errorMessage += 'Please check your internet connection and try again. If the problem persists, please contact support.';
            }
            displayError(errorMessage);
            
            // Fallback to demo resources if API fails
            showCustomMessage('API call failed or returned unexpected data, displaying demo resources as a fallback. Please try again later.');
            const demoResources = generateDemoResources(diagnosis, backgroundInfo, language);
            displayEducationResults(demoResources); // Always display demo as fallback
        } finally {
            setLoadingState(false);
        }
    });

    // Mobile navigation toggle (should be in home.js or a global script)
    // Removed local duplicate here for cleaner code.
});
