document.addEventListener('DOMContentLoaded', function() {
    const symptomForm = document.getElementById('symptomForm');
    const symptomsTextarea = document.getElementById('symptoms');
    const symptomResults = document.getElementById('symptomResults');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const submitBtn = symptomForm.querySelector('button[type="submit"]');

    // Gemini API configuration
    const GEMINI_API_KEY = 'AIzaSyBcQ5YwhtqBvzsR_mXfNmMCIQL7jjjWdXw';
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    // Use window.showCustomMessage from auth.js
    const showCustomMessage = window.showCustomMessage || ((msg, type = 'info') => console.warn(`Custom Message (${type}): ${msg}`));

    // Function to set loading state
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Analyzing... <i class="fas fa-spinner fa-spin"></i>';
            symptomsTextarea.disabled = true;
            loadingIndicator.style.display = 'flex';
            symptomResults.style.display = 'none';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Check Symptoms';
            symptomsTextarea.disabled = false;
            loadingIndicator.style.display = 'none';
        }
    }

    // Function to display symptom analysis results
    function displaySymptomResults(analysis) {
        const { potentialCauses, nextSteps } = analysis;

        // Create HTML for causes
        const causesHtml = potentialCauses.map(cause => `<li>${cause}</li>`).join('');
        
        // Create HTML for next steps
        const stepsHtml = nextSteps.map(step => `<li>${step}</li>`).join('');

        const htmlContent = `
            <div class="results-container">
                <div class="results-header">
                    <h2><i class="fas fa-stethoscope"></i> Analysis Results</h2>
                </div>
                
                <div class="results-content">
                    <div class="result-section">
                        <h3><i class="fas fa-search"></i> Possible Causes</h3>
                        <ul class="result-list">
                            ${causesHtml}
                        </ul>
                    </div>
                    
                    <div class="result-section">
                        <h3><i class="fas fa-tasks"></i> What to Do Next</h3>
                        <ul class="result-list">
                            ${stepsHtml}
                        </ul>
                    </div>
                </div>
                
                <div class="disclaimer-box">
                    <p><i class="fas fa-exclamation-triangle"></i> <strong>Important:</strong> This is not a medical diagnosis. Always consult a healthcare professional for proper evaluation.</p>
                </div>
                
                <div class="result-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.print()">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button type="button" class="btn btn-primary" id="newCheckBtn">
                        <i class="fas fa-plus"></i> New Check
                    </button>
                </div>
            </div>
        `;
        
        symptomResults.innerHTML = htmlContent;
        symptomResults.style.display = 'block';
        symptomResults.scrollIntoView({ behavior: 'smooth' });

        // Add event listener for new check button
        document.getElementById('newCheckBtn').addEventListener('click', function() {
            symptomResults.style.display = 'none';
            symptomsTextarea.value = '';
            symptomsTextarea.focus();
        });
    }

    // Function to display error messages
    function displayError(message) {
        symptomResults.innerHTML = `
            <div class="error-container">
                <div class="error-content">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Analysis Failed</h3>
                    <p>${message}</p>
                    <button type="button" class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-refresh"></i> Try Again
                    </button>
                </div>
            </div>
        `;
        
        symptomResults.style.display = 'block';
        symptomResults.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Function to call Gemini API for symptom analysis
    async function analyzeSymptoms(symptoms) {
        const prompt = `You are a medical AI assistant. Analyze the following symptoms and provide a brief response.

Symptoms: "${symptoms}"

Provide your response in JSON format with:
1. "potentialCauses": Array of 3-4 brief possible causes (max 8 words each)
2. "nextSteps": Array of 3-4 concise recommendations (max 10 words each)

Keep responses simple and clear. Focus on common conditions and practical advice.

Example format:
{
  "potentialCauses": [
    "Common cold or viral infection",
    "Seasonal allergies",
    "Bacterial throat infection"
  ],
  "nextSteps": [
    "Rest and drink plenty of fluids",
    "Take over-the-counter pain relievers if needed",
    "See doctor if symptoms worsen or persist"
  ]
}`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.3,
                topK: 32,
                topP: 1,
                maxOutputTokens: 1024,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        "potentialCauses": {
                            type: "ARRAY",
                            items: { type: "STRING" }
                        },
                        "nextSteps": {
                            type: "ARRAY",
                            items: { type: "STRING" }
                        }
                    },
                    required: ["potentialCauses", "nextSteps"]
                }
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid API response structure');
        }

        const responseText = data.candidates[0].content.parts[0].text;

        try {
            const parsedResponse = JSON.parse(responseText);
            
            if (!Array.isArray(parsedResponse.potentialCauses) || !Array.isArray(parsedResponse.nextSteps)) {
                throw new Error('Invalid response format');
            }
            
            return parsedResponse;

        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            throw new Error('Failed to parse AI response');
        }
    }
    
    // Event listener for form submission
    symptomForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const symptoms = symptomsTextarea.value.trim();
        
        if (!symptoms) {
            showCustomMessage('Please describe your symptoms.', 'info');
            return;
        }
        
        if (symptoms.length < 15) {
            showCustomMessage('Please provide more details about your symptoms.', 'info');
            return;
        }
        
        setLoadingState(true);
        
        try {
            const analysis = await analyzeSymptoms(symptoms);
            displaySymptomResults(analysis);
            
        } catch (error) {
            console.error('Analysis failed:', error.message);
            
            let errorMessage = 'Analysis failed. ';
            
            if (error.message.includes('403')) {
                errorMessage += 'API access denied. Please check configuration.';
            } else if (error.message.includes('429')) {
                errorMessage += 'Service busy. Please try again in a moment.';
            } else if (error.message.includes('Invalid response') || error.message.includes('parse')) {
                errorMessage += 'Unable to process response. Please try again.';
            } else {
                errorMessage += 'Please check your connection and try again.';
            }
            
            displayError(errorMessage);
        } finally {
            setLoadingState(false);
        }
        Weglot.initialize({
        api_key: 'wg_1a225f55596f5b34b5f1fbd49d61f5ff3'
    });
    });
});
