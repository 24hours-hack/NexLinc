// Configuration (Gemini API related constants are no longer used for functionality)
// const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; // Not used in this version
// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"; // Not used in this version

// Body parts mapping
const bodyParts = {
    'head': 'Head',
    'neck': 'Neck',
    'chest': 'Chest',
    'abdomen': 'Abdomen',
    'pelvis': 'Pelvis',
    'left-arm': 'Left Arm',
    'right-arm': 'Right Arm',
    'left-hand': 'Left Hand',
    'right-hand': 'Right Hand',
    'left-leg': 'Left Leg',
    'right-leg': 'Right Leg',
    'left-foot': 'Left Foot',
    'right-foot': 'Right Foot'
};

// --- Pre-built Medical Data ---
const prebuiltMedicalData = {
    'head': {
        questions: [
            {
                text: "How would you describe the pain in your head?",
                options: ["Dull ache", "Sharp and throbbing", "Pressure-like", "Stabbing"]
            },
            {
                text: "When did the headache start?",
                options: ["Within the last hour", "A few hours ago", "Yesterday", "More than 2 days ago"]
            },
            {
                text: "Do you experience any other symptoms with the headache?",
                options: ["Nausea or vomiting", "Sensitivity to light/sound", "Vision changes", "No other symptoms"]
            },
            {
                text: "What is the intensity of the pain on a scale of 1-10?",
                options: ["1-3 (Mild)", "4-6 (Moderate)", "7-8 (Severe)", "9-10 (Very Severe)"]
            },
            {
                text: "Is the pain worse when you lie down or stand up?",
                options: ["Worse when lying down", "Worse when standing up", "No change with position", "Only when moving"]
            },
            {
                text: "Have you recently experienced any head injury?",
                options: ["Yes, within 24 hours", "Yes, within the last week", "No, not recently", "I don't recall"]
            },
            {
                text: "Are you taking any medication for your head pain?",
                options: ["Over-the-counter pain relievers", "Prescription medication", "No medication", "Herbal remedies"]
            }
        ],
        recommendations: {
            specialist: "Neurologist or General Physician",
            tests: "CT scan of head, MRI of brain, Blood tests to rule out infections.",
            action: "Monitor symptoms closely. If pain is severe, sudden, or accompanied by weakness/vision changes, seek urgent medical attention. Otherwise, consult a doctor if persistent.",
            urgency: 3, // Scale 1-5, 5 being highest urgency
            summary: "Headache symptoms can vary widely in cause and severity. It's important to consult a healthcare professional for an accurate diagnosis, especially if accompanied by neurological symptoms or if they are sudden and severe."
        }
    },
    'neck': {
        questions: [
            {
                text: "How would you describe your neck pain?",
                options: ["Stiff", "Aching", "Sharp", "Burning"]
            },
            {
                text: "Does the pain radiate to your arm or hand?",
                options: ["Yes, to one arm", "Yes, to both arms", "No, it stays in the neck", "Only to the shoulder"]
            },
            {
                text: "Have you had any recent injury to your neck?",
                options: ["Yes, a recent fall/accident", "Yes, a minor strain", "No, no injury", "Not sure"]
            },
            {
                text: "Is the pain worse with movement?",
                options: ["Yes, especially turning head", "Yes, with certain movements", "No, constant pain", "Better with movement"]
            },
            {
                text: "Do you experience numbness or tingling in your arms/hands?",
                options: ["Yes, in one arm", "Yes, in both arms", "No numbness/tingling", "Occasionally"]
            },
            {
                text: "Is there any muscle weakness in your arms or hands?",
                options: ["Yes, significant weakness", "Mild weakness", "No weakness", "Unable to tell"]
            },
            {
                text: "Does applying heat or ice help relieve the pain?",
                options: ["Heat helps", "Ice helps", "Neither helps", "Both help slightly"]
            }
        ],
        recommendations: {
            specialist: "Orthopedist or Physical Therapist",
            tests: "X-ray of cervical spine, MRI of cervical spine, Nerve conduction study if numbness is present.",
            action: "Rest, apply ice/heat packs. Avoid strenuous activities that aggravate pain. Consult if pain persists, worsens, or is accompanied by neurological symptoms.",
            urgency: 2,
            summary: "Neck pain can arise from muscle strain, poor posture, or underlying spinal issues. Persistent pain, especially with radiating symptoms or numbness, warrants medical evaluation to rule out nerve compression."
        }
    },
    'chest': {
        questions: [
            {
                text: "How would you describe your chest pain?",
                options: ["Sharp", "Dull ache", "Pressure/tightness", "Burning"]
            },
            {
                text: "Does the pain radiate to other areas?",
                options: ["Left arm/shoulder", "Jaw or back", "Neck", "No, it stays in the chest"]
            },
            {
                text: "Is the chest pain related to physical activity or exertion?",
                options: ["Yes, it worsens with activity", "No, it occurs at rest", "Sometimes, but not always", "Only with deep breaths"]
            },
            {
                text: "Do you experience shortness of breath with the pain?",
                options: ["Yes, severe", "Yes, mild", "No, breathing is normal", "Only when lying down"]
            },
            {
                text: "Do you have a cough?",
                options: ["Yes, dry cough", "Yes, productive cough", "No cough", "Only when eating"]
            },
            {
                text: "Is the pain affected by position or deep breaths?",
                options: ["Worse with deep breaths/coughing", "Worse when lying down", "Better when leaning forward", "No change"]
            },
            {
                text: "Do you have any history of heart disease or lung conditions?",
                options: ["Yes, heart disease", "Yes, lung condition", "No relevant history", "Unsure"]
            }
        ],
        recommendations: {
            specialist: "Cardiologist or Pulmonologist (Emergency if severe)",
            tests: "ECG, Chest X-ray, Blood tests (cardiac enzymes), CT Angiogram.",
            action: "If severe, crushing chest pain with shortness of breath, radiating pain, or dizziness, **seek immediate emergency medical help**. Otherwise, consult a doctor promptly.",
            urgency: 5,
            summary: "Chest pain can indicate serious conditions like heart attack or pulmonary embolism. Urgent evaluation is critical to determine the cause and initiate appropriate treatment."
        }
    },
    'abdomen': {
        questions: [
            {
                text: "Where in your abdomen is the pain located?",
                options: ["Upper abdomen", "Lower abdomen", "Left side", "Right side", "All over"]
            },
            {
                text: "How would you describe the pain?",
                options: ["Cramping", "Sharp", "Dull ache", "Burning"]
            },
            {
                text: "When did the abdominal pain start?",
                options: ["Within hours", "Last 1-2 days", "Several days ago", "Weeks/months ago"]
            },
            {
                text: "Do you have nausea or vomiting?",
                options: ["Yes, both", "Only nausea", "Only vomiting", "Neither"]
            },
            {
                text: "Have you noticed any changes in your bowel movements?",
                options: ["Diarrhea", "Constipation", "Blood in stool", "No change"]
            },
            {
                text: "Is the pain worse after eating?",
                options: ["Yes, significantly worse", "Slightly worse", "No change", "Better after eating"]
            },
            {
                text: "Do you have a fever?",
                options: ["Yes, high fever", "Yes, low-grade fever", "No fever", "Not sure"]
            }
        ],
        recommendations: {
            specialist: "Gastroenterologist or General Surgeon",
            tests: "Blood tests (CBC, LFTs), Urinalysis, Abdominal Ultrasound, CT scan of abdomen/pelvis.",
            action: "Avoid solid food for a few hours, drink clear fluids. If pain is severe, persistent, or accompanied by fever/vomiting/blood in stool, seek urgent medical care.",
            urgency: 4,
            summary: "Abdominal pain can stem from various causes, from mild indigestion to serious conditions like appendicitis or bowel obstruction. Prompt medical attention is advised for severe or worsening pain."
        }
    },
    'pelvis': {
        questions: [
            {
                text: "How would you describe your pelvic pain?",
                options: ["Dull ache", "Sharp", "Pressure", "Cramping"]
            },
            {
                text: "Is the pain constant or does it come and go?",
                options: ["Constant", "Comes and goes", "Worse at certain times of day", "Only with specific activities"]
            },
            {
                text: "For females, is the pain related to your menstrual cycle?",
                options: ["Yes, during menstruation", "Yes, before menstruation", "No, not related", "Post-menopausal"]
            },
            {
                text: "Do you experience pain during urination or bowel movements?",
                options: ["Painful urination", "Painful bowel movements", "Both are painful", "No pain with elimination"]
            },
            {
                text: "Have you noticed any unusual vaginal discharge or bleeding (for females)?",
                options: ["Yes, discharge", "Yes, bleeding", "Both", "Neither"]
            },
            {
                text: "Do you have a fever or chills?",
                options: ["Yes, fever", "Yes, chills", "Both", "Neither"]
            },
            {
                text: "Have you recently had any pelvic procedures or new sexual partners?",
                options: ["Yes, recent procedure", "Yes, new partner", "No", "Unsure"]
            }
        ],
        recommendations: {
            specialist: "Gynecologist (for females), Urologist, or General Surgeon",
            tests: "Urinalysis, Pelvic Ultrasound, Blood tests (CBC, inflammatory markers), STI testing.",
            action: "Monitor symptoms. For severe or persistent pain, or if accompanied by fever, abnormal bleeding/discharge, or difficulty urinating, seek prompt medical attention.",
            urgency: 3,
            summary: "Pelvic pain can have gynecological, urological, or gastrointestinal origins. Its evaluation often requires a comprehensive approach to identify the underlying cause."
        }
    },
    'left-arm': {
        questions: [
            {
                text: "How would you describe the pain in your left arm?",
                options: ["Aching", "Sharp", "Numbness/tingling", "Weakness"]
            },
            {
                text: "Did the pain start suddenly after an injury?",
                options: ["Yes, after a fall/impact", "Yes, after heavy lifting", "No, gradual onset", "Unknown cause"]
            },
            {
                text: "Does the pain radiate from your neck or shoulder?",
                options: ["Yes, from neck", "Yes, from shoulder", "No, localized to arm", "Unsure"]
            },
            {
                text: "Is the arm swollen or discolored?",
                options: ["Yes, significantly swollen", "Slightly swollen", "Discolored (bruising)", "No, looks normal"]
            },
            {
                text: "Can you move your arm and hand normally?",
                options: ["Full range of motion", "Limited range of motion", "Cannot move due to pain", "Weak grip"]
            },
            {
                text: "Is the pain worse at night or when resting?",
                options: ["Worse at night", "Worse with activity", "Constant pain", "Better with rest"]
            },
            {
                text: "Do you experience any numbness or pins and needles in your fingers?",
                options: ["Thumb and index finger", "Ring and pinky finger", "All fingers", "No numbness"]
            }
        ],
        recommendations: {
            specialist: "Orthopedist or Physical Therapist (Cardiologist if chest pain involved)",
            tests: "X-ray of arm/shoulder, MRI of arm/shoulder, Nerve conduction study, ECG if chest pain also present.",
            action: "Rest the arm, apply ice. If severe pain, deformity, or inability to move, seek immediate medical attention. Otherwise, consult a doctor if pain persists.",
            urgency: 3,
            summary: "Left arm pain can be muscular, nerve-related, or in rare cases, a symptom of cardiac issues, especially if accompanied by chest pain. Evaluation depends on associated symptoms."
        }
    },
    'right-arm': {
        questions: [
            {
                text: "How would you describe the pain in your right arm?",
                options: ["Aching", "Sharp", "Numbness/tingling", "Weakness"]
            },
            {
                text: "Did the pain start suddenly after an injury?",
                options: ["Yes, after a fall/impact", "Yes, after heavy lifting", "No, gradual onset", "Unknown cause"]
            },
            {
                text: "Does the pain radiate from your neck or shoulder?",
                options: ["Yes, from neck", "Yes, from shoulder", "No, localized to arm", "Unsure"]
            },
            {
                text: "Is the arm swollen or discolored?",
                options: ["Yes, significantly swollen", "Slightly swollen", "Discolored (bruising)", "No, looks normal"]
            },
            {
                text: "Can you move your arm and hand normally?",
                options: ["Full range of motion", "Limited range of motion", "Cannot move due to pain", "Weak grip"]
            },
            {
                text: "Is the pain worse at night or when resting?",
                options: ["Worse at night", "Worse with activity", "Constant pain", "Better with rest"]
            },
            {
                text: "Do you experience any numbness or pins and needles in your fingers?",
                options: ["Thumb and index finger", "Ring and pinky finger", "All fingers", "No numbness"]
            }
        ],
        recommendations: {
            specialist: "Orthopedist or Physical Therapist",
            tests: "X-ray of arm/shoulder, MRI of arm/shoulder, Nerve conduction study.",
            action: "Rest the arm, apply ice. If severe pain, deformity, or inability to move, seek immediate medical attention. Otherwise, consult a doctor if pain persists.",
            urgency: 2,
            summary: "Right arm pain is commonly due to musculoskeletal issues like strains, sprains, or nerve impingement. Persistent pain or accompanied by weakness should be evaluated by a healthcare professional."
        }
    },
    'left-hand': {
        questions: [
            {
                text: "How would you describe the pain in your left hand?",
                options: ["Sharp", "Aching", "Burning", "Numbness/tingling"]
            },
            {
                text: "Which part of your hand is most affected?",
                options: ["Wrist", "Fingers", "Palm", "Back of hand", "Thumb"]
            },
            {
                text: "Did the pain start after repetitive hand movements or activity?",
                options: ["Yes, after repetitive work", "Yes, after sports", "No, spontaneous onset", "After an injury"]
            },
            {
                text: "Do you experience stiffness in your fingers, especially in the morning?",
                options: ["Yes, significant stiffness", "Mild stiffness", "No stiffness", "Only after prolonged rest"]
            },
            {
                text: "Is there any swelling or warmth in your hand/joints?",
                options: ["Yes, swollen", "Yes, warm to touch", "Both", "Neither"]
            },
            {
                text: "Do you have difficulty gripping objects or performing fine motor tasks?",
                options: ["Yes, significant difficulty", "Some difficulty", "No difficulty", "Only with heavy objects"]
            },
            {
                text: "Have you recently sustained an injury to your hand?",
                options: ["Yes, a direct impact", "Yes, a sprain", "No, no injury", "Not sure"]
            }
        ],
        recommendations: {
            specialist: "Orthopedic Hand Surgeon or Rheumatologist",
            tests: "X-ray of hand/wrist, MRI, Blood tests for inflammatory conditions, Nerve conduction study.",
            action: "Rest, ice, and elevation. Avoid aggravating activities. Consult a doctor if pain is persistent, severe, or affects daily activities.",
            urgency: 2,
            summary: "Left hand pain can be caused by overuse injuries, arthritis, nerve compression (like carpal tunnel), or acute injuries. Proper diagnosis is key for effective treatment."
        }
    },
    'right-hand': {
        questions: [
            {
                text: "How would you describe the pain in your right hand?",
                options: ["Sharp", "Aching", "Burning", "Numbness/tingling"]
            },
            {
                text: "Which part of your hand is most affected?",
                options: ["Wrist", "Fingers", "Palm", "Back of hand", "Thumb"]
            },
            {
                text: "Did the pain start after repetitive hand movements or activity?",
                options: ["Yes, after repetitive work", "Yes, after sports", "No, spontaneous onset", "After an injury"]
            },
            {
                text: "Do you experience stiffness in your fingers, especially in the morning?",
                options: ["Yes, significant stiffness", "Mild stiffness", "No stiffness", "Only after prolonged rest"]
            },
            {
                text: "Is there any swelling or warmth in your hand/joints?",
                options: ["Yes, swollen", "Yes, warm to touch", "Both", "Neither"]
            },
            {
                text: "Do you have difficulty gripping objects or performing fine motor tasks?",
                options: ["Yes, significant difficulty", "Some difficulty", "No difficulty", "Only with heavy objects"]
            },
            {
                text: "Have you recently sustained an injury to your hand?",
                options: ["Yes, a direct impact", "Yes, a sprain", "No, no injury", "Not sure"]
            }
        ],
        recommendations: {
            specialist: "Orthopedic Hand Surgeon or Rheumatologist",
            tests: "X-ray of hand/wrist, MRI, Blood tests for inflammatory conditions, Nerve conduction study.",
            action: "Rest, ice, and elevation. Avoid aggravating activities. Consult a doctor if pain is persistent, severe, or affects daily activities.",
            urgency: 2,
            summary: "Right hand pain is commonly due to overuse, arthritis, or nerve issues. As it's often the dominant hand, persistent issues can significantly impact daily life and require proper medical evaluation."
        }
    },
    'left-leg': {
        questions: [
            {
                text: "How would you describe the pain in your left leg?",
                options: ["Dull ache", "Sharp", "Cramping", "Burning"]
            },
            {
                text: "Where is the pain most intense?",
                options: ["Thigh", "Knee", "Shin", "Calf", "Ankle"]
            },
            {
                text: "Does the pain radiate from your lower back?",
                options: ["Yes, from lower back", "No, it's localized to leg", "Only to buttocks", "Unsure"]
            },
            {
                text: "Is the pain worse with walking or standing?",
                options: ["Worse with walking", "Worse with standing", "Worse with sitting", "Constant pain"]
            },
            {
                text: "Do you experience numbness, tingling, or weakness in your leg or foot?",
                options: ["Yes, numbness", "Yes, tingling", "Yes, weakness", "None of these"]
            },
            {
                text: "Is there any swelling, redness, or warmth in the leg?",
                options: ["Yes, swelling", "Yes, redness", "Yes, warmth", "None of these"]
            },
            {
                text: "Have you had a recent injury or unusually strenuous activity involving your leg?",
                options: ["Yes, specific injury", "Yes, strenuous activity", "No, spontaneous onset", "Not sure"]
            }
        ],
        recommendations: {
            specialist: "Orthopedist or Vascular Surgeon",
            tests: "X-ray of leg/knee/hip, MRI, Doppler ultrasound of leg veins, Blood tests.",
            action: "Rest, elevate the leg, apply ice if swollen. If sudden, severe pain with swelling, redness, or difficulty bearing weight, seek urgent medical attention to rule out DVT or fracture.",
            urgency: 4,
            summary: "Left leg pain can range from muscle strains to more serious conditions like deep vein thrombosis (DVT), nerve compression (sciatica), or arterial issues. The presence of swelling, redness, or severe pain warrants prompt evaluation."
        }
    },
    'right-leg': {
        questions: [
            {
                text: "How would you describe the pain in your right leg?",
                options: ["Dull ache", "Sharp", "Cramping", "Burning"]
            },
            {
                text: "Where is the pain most intense?",
                options: ["Thigh", "Knee", "Shin", "Calf", "Ankle"]
            },
            {
                text: "Does the pain radiate from your lower back?",
                options: ["Yes, from lower back", "No, it's localized to leg", "Only to buttocks", "Unsure"]
            },
            {
                text: "Is the pain worse with walking or standing?",
                options: ["Worse with walking", "Worse with standing", "Worse with sitting", "Constant pain"]
            },
            {
                text: "Do you experience numbness, tingling, or weakness in your leg or foot?",
                options: ["Yes, numbness", "Yes, tingling", "Yes, weakness", "None of these"]
            },
            {
                text: "Is there any swelling, redness, or warmth in the leg?",
                options: ["Yes, swelling", "Yes, redness", "Yes, warmth", "None of these"]
            },
            {
                text: "Have you had a recent injury or unusually strenuous activity involving your leg?",
                options: ["Yes, specific injury", "Yes, strenuous activity", "No, spontaneous onset", "Not sure"]
            }
        ],
        recommendations: {
            specialist: "Orthopedist or Vascular Surgeon",
            tests: "X-ray of leg/knee/hip, MRI, Doppler ultrasound of leg veins, Blood tests.",
            action: "Rest, elevate the leg, apply ice if swollen. If severe pain with swelling, redness, or difficulty bearing weight, seek urgent medical attention.",
            urgency: 3,
            summary: "Right leg pain is commonly due to musculoskeletal injuries, nerve issues, or circulatory problems. Persistent pain, especially with associated symptoms like swelling or numbness, should be medically evaluated."
        }
    },
    'left-foot': {
        questions: [
            {
                text: "How would you describe the pain in your left foot?",
                options: ["Sharp", "Aching", "Burning", "Stiffness"]
            },
            {
                text: "Which part of your foot is most affected?",
                options: ["Heel", "Arch", "Toes", "Ball of foot", "Ankle"]
            },
            {
                text: "Is the pain worse in the morning or after rest?",
                options: ["Yes, worse in morning", "Yes, worse after rest", "Worse with activity", "Constant pain"]
            },
            {
                text: "Did the pain start after an injury or change in footwear/activity?",
                options: ["Yes, after injury", "Yes, new shoes/activity", "No, spontaneous onset", "Unsure"]
            },
            {
                text: "Do you notice any swelling, redness, or bruising on your foot?",
                options: ["Yes, swelling", "Yes, redness", "Yes, bruising", "None of these"]
            },
            {
                text: "Can you put weight on your foot normally?",
                options: ["Yes, no problem", "Some difficulty", "Cannot put weight", "Only with severe pain"]
            },
            {
                text: "Do you have any numbness or tingling in your toes?",
                options: ["Yes, in specific toes", "Yes, all toes", "No numbness/tingling", "Occasionally"]
            }
        ],
        recommendations: {
            specialist: "Podiatrist or Orthopedist",
            tests: "X-ray of foot/ankle, MRI, Ultrasound.",
            action: "Rest, ice, elevate. Avoid aggravating activities and wear supportive footwear. If severe pain, inability to bear weight, or deformity, seek immediate medical attention.",
            urgency: 2,
            summary: "Left foot pain often results from overuse, improper footwear, or injuries like sprains/strains. Persistent pain requires evaluation to rule out fractures, nerve entrapment, or inflammatory conditions."
        }
    },
    'right-foot': {
        questions: [
            {
                text: "How would you describe the pain in your right foot?",
                options: ["Sharp", "Aching", "Burning", "Stiffness"]
            },
            {
                text: "Which part of your foot is most affected?",
                options: ["Heel", "Arch", "Toes", "Ball of foot", "Ankle"]
            },
            {
                text: "Is the pain worse in the morning or after rest?",
                options: ["Yes, worse in morning", "Yes, worse after rest", "Worse with activity", "Constant pain"]
            },
            {
                text: "Did the pain start after an injury or change in footwear/activity?",
                options: ["Yes, after injury", "Yes, new shoes/activity", "No, spontaneous onset", "Unsure"]
            },
            {
                text: "Do you notice any swelling, redness, or bruising on your foot?",
                options: ["Yes, swelling", "Yes, redness", "Yes, bruising", "None of these"]
            },
            {
                text: "Can you put weight on your foot normally?",
                options: ["Yes, no problem", "Some difficulty", "Cannot put weight", "Only with severe pain"]
            },
            {
                text: "Do you have any numbness or tingling in your toes?",
                options: ["Yes, in specific toes", "Yes, all toes", "No numbness/tingling", "Occasionally"]
            }
        ],
        recommendations: {
            specialist: "Podiatrist or Orthopedist",
            tests: "X-ray of foot/ankle, MRI, Ultrasound.",
            action: "Rest, ice, elevate. Avoid aggravating activities and wear supportive footwear. If severe pain, inability to bear weight, or deformity, seek immediate medical attention.",
            urgency: 2,
            summary: "Right foot pain commonly arises from musculoskeletal issues. Proper care and, if needed, professional evaluation are important for persistent pain to prevent chronic problems."
        }
    }
    // Add other body parts here following the same structure
};


document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const bodyAreas = document.querySelectorAll('area[data-part]');
    const questionnaireSection = document.getElementById('questionnaire-section');
    const selectedPartTitle = document.getElementById('selected-part');
    const questionContainer = document.getElementById('question-container');
    const submitAnswersBtn = document.getElementById('submit-answers');
    const resultsSection = document.getElementById('results-section');
    // const startOverBtn = document.getElementById('start-over'); // This will be re-rendered in results section
    // const generateReportBtn = document.getElementById('generate-report'); // This will be re-rendered in results section
    
    let selectedBodyPart = '';
    let currentQuestions = [];
    let userAnswers = [];

    // Initialize body part interactions
    bodyAreas.forEach(area => {
        area.addEventListener('mouseover', function() {
            this.style.cursor = 'pointer';
        });
        
        area.addEventListener('click', async function(e) {
            e.preventDefault();
            selectedBodyPart = this.getAttribute('data-part');
            selectedPartTitle.textContent = bodyParts[selectedBodyPart];
            
            // Show loading state (briefly, as questions are hardcoded)
            questionContainer.innerHTML = '<div class="loading-spinner"></div><p>Loading questions...</p>';
            questionnaireSection.style.display = 'block';
            console.log(`User clicked on: ${selectedBodyPart}`);
            
            // Get pre-built questions
            const questionsData = prebuiltMedicalData[selectedBodyPart];
            if (questionsData && questionsData.questions) {
                currentQuestions = questionsData.questions;
                renderQuestions(currentQuestions);
                console.log("Pre-built questions loaded and rendered successfully.");
            } else {
                questionContainer.innerHTML = '<p class="error">No questions available for this body part.</p>';
                console.error(`No pre-built questions found for ${selectedBodyPart}`);
            }
            
            window.scrollTo({
                top: questionnaireSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // Removed generateQuestions and callGeminiAPI functions as they are no longer needed.
    // The data is now taken directly from prebuiltMedicalData.

    // Render questions to the UI
    function renderQuestions(questions) {
        questionContainer.innerHTML = '';
        
        if (!Array.isArray(questions) || questions.length === 0) {
            questionContainer.innerHTML = '<p class="error">No questions received or questions are in an unexpected format.</p>';
            console.warn("renderQuestions received invalid or empty questions array:", questions);
            return;
        }

        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.innerHTML = `
                <h3>${q.text}</h3>
                <div class="answer-options" id="options-${index}"></div>
            `;
            questionContainer.appendChild(questionDiv);

            const optionsContainer = document.getElementById(`options-${index}`);
            q.options.forEach(option => {
                const optionId = `option-${index}-${option.replace(/\W+/g, '-').toLowerCase()}`;
                optionsContainer.innerHTML += `
                    <div class="answer-option">
                        <input type="radio" name="question-${index}" id="${optionId}" value="${option}">
                        <label for="${optionId}">${option}</label>
                    </div>
                `;
            });
        });
        
        submitAnswersBtn.style.display = 'block';
    }

    // Submit answers handler
    submitAnswersBtn.addEventListener('click', function() { // Made synchronous
        userAnswers = [];
        let allAnswered = true;
        
        currentQuestions.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
            if (selectedOption) {
                userAnswers.push(selectedOption.value);
                // Remove unanswered class if previously added
                document.getElementById(`options-${index}`).classList.remove('unanswered');
            } else {
                allAnswered = false;
                document.getElementById(`options-${index}`).classList.add('unanswered');
                console.warn(`Question ${index} was not answered.`);
            }
        });
        
        if (allAnswered) {
            console.log("All questions answered. User answers:", userAnswers);
            
            // Show loading state (briefly, as recommendations are hardcoded)
            resultsSection.innerHTML = '<div class="loading-spinner"></div><p>Analyzing your responses...</p>';
            resultsSection.style.display = 'block';
            
            // Get pre-built recommendations
            const recommendations = prebuiltMedicalData[selectedBodyPart].recommendations;
            if (recommendations) {
                displayRecommendations(recommendations);
                console.log("Pre-built recommendations displayed successfully.");
            } else {
                resultsSection.innerHTML = '<p class="error">No recommendations available for this body part.</p>';
                console.error(`No pre-built recommendations found for ${selectedBodyPart}`);
            }
            
            questionnaireSection.style.display = 'none';
            window.scrollTo({
                top: resultsSection.offsetTop,
                behavior: 'smooth'
            });
        } else {
            alert('Please answer all questions before submitting.');
            console.log("User needs to answer all questions.");
        }
    });

    // Removed getRecommendations function as it is no longer needed.
    // The data is now taken directly from prebuiltMedicalData.

    // Display recommendations
    function displayRecommendations(data) {
        console.log("Displaying recommendations:", data);
        resultsSection.innerHTML = `
            <h2><i class="fas fa-stethoscope"></i> Your Recommendations</h2>
            
            <div class="recommendation-section urgency-section">
                <h3>Urgency Level: <span class="urgency-score">${data.urgency || 3}/5</span></h3>
                <div class="stars">
                    ${'★'.repeat(data.urgency || 3)}${'☆'.repeat(5 - (data.urgency || 3))}
                </div>
                <p class="urgency-description">${getUrgencyDescription(data.urgency || 3)}</p>
            </div>
            
            <div class="recommendation-card">
                <h3><i class="fas fa-user-md"></i> Recommended Specialist</h3>
                <p>${data.specialist || "General Physician"}</p>
            </div>
            
            <div class="recommendation-card">
                <h3><i class="fas fa-flask"></i> Suggested Tests</h3>
                <p>${data.tests || "Basic examination and consultation."}</p>
            </div>
            
            <div class="recommendation-card">
                <h3><i class="fas fa-exclamation-triangle"></i> Action Guidance</h3>
                <p>${data.action || "Consult a healthcare professional for proper evaluation."}</p>
            </div>
            
            <div class="recommendation-card">
                <h3><i class="fas fa-info-circle"></i> Summary of Condition</h3>
                <p>${data.summary || "Please consult a doctor for a proper evaluation and personalized advice."}</p>
            </div>
            
            <div class="buttons-container">
                <button id="generate-report" class="btn btn-primary"><i class="fas fa-file-pdf"></i> Generate Doctor's Report</button>
                <button id="start-over" class="btn btn-secondary"><i class="fas fa-redo"></i> Start Over</button>
            </div>
            
            <div class="disclaimer">
                <p><i class="fas fa-info-circle"></i> <strong>Disclaimer:</strong> These recommendations are for informational purposes only, based on pre-defined data, and are not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
            </div>
        `;
        
        // Reattach event listeners to the new buttons
        document.getElementById('generate-report').addEventListener('click', generateReport);
        document.getElementById('start-over').addEventListener('click', startOver);
    }

    // Get urgency description
    function getUrgencyDescription(level) {
        const descriptions = [
            "Very Low urgency: Routine check recommended at your convenience.", // Level 0 (if applicable)
            "Low urgency: Schedule a consultation when convenient.",
            "Moderate urgency: Schedule a consultation soon, within a few days.",
            "High urgency: Seek care within 24-48 hours.",
            "Very high urgency: Seek care immediately (e.g., ER or urgent care).",
            "Emergency: Urgent medical attention required NOW."
        ];
        return descriptions[level] || descriptions[2]; // Default to moderate if level is out of range
    }

    // Generate PDF report
    function generateReport() {
        console.log("Generating report...");
        const recommendationsData = prebuiltMedicalData[selectedBodyPart].recommendations;

        const reportContent = `
            <div class="report-header">
                <h2>Patient Symptom Report</h2>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Affected Body Part:</strong> ${bodyParts[selectedBodyPart]}</p>
            </div>
            
            <div class="report-section">
                <h3><i class="fas fa-clipboard-list"></i> Patient Responses:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Your Answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentQuestions.map((q, i) => `
                            <tr>
                                <td>${q.text}</td>
                                <td><strong>${userAnswers[i] || 'Not Answered'}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="report-section">
                <h3><i class="fas fa-lightbulb"></i> Suggested Recommendations:</h3>
                <table class="recommendations-table">
                    <tr>
                        <td><strong>Urgency Level:</strong></td>
                        <td>${recommendationsData.urgency || 3}/5 - ${getUrgencyDescription(recommendationsData.urgency || 3)}</td>
                    </tr>
                    <tr>
                        <td><strong>Recommended Specialist:</strong></td>
                        <td>${recommendationsData.specialist || "General Physician"}</td>
                    </tr>
                    <tr>
                        <td><strong>Suggested Tests:</strong></td>
                        <td>${recommendationsData.tests || "Basic examination and consultation."}</td>
                    </tr>
                    <tr>
                        <td><strong>Action Guidance:</strong></td>
                        <td>${recommendationsData.action || "Consult a healthcare professional for proper evaluation."}</td>
                    </tr>
                    <tr>
                        <td><strong>Summary of Condition:</strong></td>
                        <td>${recommendationsData.summary || "Please consult a doctor for a proper evaluation and personalized advice."}</td>
                    </tr>
                </table>
            </div>
            
            <div class="report-footer">
                <p>Generated by AyurJeev Symptom Navigator</p>
                <p><em>Disclaimer: This report is for informational purposes only and is not a medical diagnosis. Always consult a healthcare professional.</em></p>
            </div>
        `;
        
        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Patient Symptom Report - ${bodyParts[selectedBodyPart]}</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; line-height: 1.6; color: #333; margin: 0 auto; max-width: 800px; }
                    .report-header { text-align: center; margin-bottom: 30px; }
                    .report-header h2 { color: #2c3e50; font-size: 2em; margin-bottom: 5px; }
                    .report-header p { font-size: 0.9em; color: #666; }
                    .report-section { margin-bottom: 30px; border: 1px solid #eee; padding: 15px; border-radius: 8px; background-color: #f9f9f9; }
                    .report-section h3 { color: #3498db; font-size: 1.4em; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 15px; display: flex; align-items: center; }
                    .report-section h3 i { margin-right: 10px; color: #3498db; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { padding: 10px 12px; border: 1px solid #ddd; text-align: left; }
                    th { background-color: #eef; font-weight: bold; color: #555; }
                    td strong { color: #222; }
                    .recommendations-table td:first-child { width: 30%; font-weight: bold; color: #444; }
                    .report-footer { margin-top: 40px; font-size: 0.85em; text-align: center; color: #777; border-top: 1px dashed #ccc; padding-top: 15px; }
                    .report-footer p { margin-bottom: 5px; }
                    button { display: block; margin: 20px auto; padding: 12px 25px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1em; }
                    button:hover { background: #218838; }
                </style>
            </head>
            <body>
                <div class="report-container">
                    ${reportContent}
                    <button onclick="window.print()">
                        <i class="fas fa-print"></i> Print Report
                    </button>
                </div>
            </body>
            </html>
        `);
        reportWindow.document.close(); // Important for some browsers
    }

    // Start over
    function startOver() {
        console.log("Starting over...");
        resultsSection.style.display = 'none';
        questionnaireSection.style.display = 'none';
        userAnswers = [];
        currentQuestions = [];
        questionContainer.innerHTML = ''; 
        submitAnswersBtn.style.display = 'none';
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});