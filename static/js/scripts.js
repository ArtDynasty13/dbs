document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    let points = 0;
    let motorFluctuationsScore = 0;
    let freezingOfGaitScore = 0;
    let nonMotorSymptomsScore = 0;
    let hallucinationScore = 0;
    const progress = document.querySelector('.progress-bar');
    const animationDuration = 1000; // Duration of the animation in milliseconds

    // Define your questions data
    const questions = [
        {
            id: 1,
            question: "1. Are you taking 5 doses or greater of levodopa?",
            options: ["Yes", "No"],
            multiple: false,
            disqualifyingOptions: ["No"]
        },
        {
            id: 2,
            question: "2. Are you experiencing a total of greater than 2 hours of daily “off” time (where Parkinson’s symptoms become more noticeable often after an initial benefit from oral treatment)?",
            options: ["Yes", "No"],
            multiple: false,
            disqualifyingOptions: ["No"]
        },
        {
            id: 3,
            question: "3. Are you experiencing unpredictable fluctuations of motor symptoms (a sudden and unpredictable recurrence of symptoms generally unrelated to next dose timing) with your current oral treatment?",
            options: ["Yes", "No"],
            multiple: false,
            disqualifyingOptions: ["No"]
        },
        {
            id: 4,
            question: "4. Are you experiencing troublesome dyskinesia (involuntary body movements that interfere with your daily living activities) due to your current oral treatment?",
            options: ["Yes", "No"],
            multiple: false,
            disqualifyingOptions: ["No"]
        },
        {
            id: 5,
            question: "Are you presently limited in performing one or more activities of daily living (eg: writing, walking, bathing, dressing, eating, toileting, etc.)?",
            options: ["Yes", "No"],
            multiple: false,
            disqualifyingOptions: ["No"]
        },

        //SECTION 2 -- deeper analysis of symptoms --

        {
            id: 6,
            question: "This next section assesses the frequency and severity of several symptoms, including key motor, non-motor symptoms, adverse events and functional impact.",
            options: ["I understand"],
            mutliple: false,
        },
        {
            id: 7,
            section: "MOTOR FLUCTUATIONS",
            question: "How often are your motor fluctuations unpredictable?",
            options: ["Never", "Rarely (≤1/week)", "Sometimes (several times per week)", "Most/All the time (daily)"],
            multiple: false,
            points: { "Never": 0, "Rarely (≤1/week)": 1, "Sometimes (several times per week)": 2, "Most/All the time (daily)": 3 }
        },
        {
            id: 8,
            section: "MOTOR FLUCTUATIONS",
            question: "How severe/troublesome are your motor fluctuations?",
            options: ["Mild", "Moderate", "Severe"],
            multiple: false,
            points: { "Mild": 1, "Moderate": 2, "Severe": 3 },
            skipIf: {
                previousQuestionId: 7,
                previousAnswer: "Never"
            }
        },
        {
            id: 9,
            section: "FREEZING OF GAIT",
            question: "How often do you experience freezing of gait during 'off' time?",
            options: ["Never", "Rarely (≤1/week)", "Sometimes (several times per week)", "Most/All the time (daily)"],
            multiple: false,
            points: { "Never": 0, "Rarely (≤1/week)": 1, "Sometimes (several times per week)": 2, "Most/All the time (daily)": 3 }
        },
        {
            id: 10,
            section: "FREEZING OF GAIT",
            question: "How severe/troublesome are your episodes of freezing of gait during 'off' time?",
            options: ["Mild", "Moderate", "Severe"],
            multiple: false,
            points: { "Mild": 1, "Moderate": 2, "Severe": 3 },
            skipIf: {
                previousQuestionId: 9,
                previousAnswer: "Never"
            }
        },
        {
            id: 11,
            section: "NON-MOTOR SYMPTOMS",
            question: "How often do you experience non-motor 'off' symptoms (e.g., anxiety, pain, mood changes, sleep issues)?",
            options: ["Never", "Rarely (≤1/week)", "Sometimes (several times per week)", "Most/All the time (daily)"],
            multiple: false,
            points: { "Never": 0, "Rarely (≤1/week)": 1, "Sometimes (several times per week)": 2, "Most/All the time (daily)": 3 }
        },
        {
            id: 12,
            section: "NON-MOTOR SYMPTOMS",
            question: "How severe/troublesome are your non-motor 'off' symptoms?",
            options: ["Mild", "Moderate", "Severe"],
            multiple: false,
            points: { "Mild": 1, "Moderate": 2, "Severe": 3 },
            skipIf: {
                previousQuestionId: 11,
                previousAnswer: "Never"
            }
        },
        {
            id: 13,
            section: "HALLUCINATION/PSYCHOSIS",
            question: "How often do you experience hallucinations/psychosis without insight?",
            options: ["Never", "Rarely (≤1/week)", "Sometimes (several times per week)", "Most/All the time (daily)"],
            multiple: false,
            points: { "Never": 0, "Rarely (≤1/week)": 1, "Sometimes (several times per week)": 2, "Most/All the time (daily)": 3 }
        },
        {
            id: 14,
            section: "HALLUCINATION/PSYCHOSIS",
            question: "How severe/troublesome are your episodes of hallucinations/psychosis without insight?",
            options: ["Mild", "Moderate", "Severe"],
            multiple: false,
            points: { "Mild": 1, "Moderate": 2, "Severe": 3 },
            skipIf: {
                previousQuestionId: 13,
                previousAnswer: "Never"
            }
        },
        {
            id: 15,
            section: "OFF-TIME",
            question: "How severe/troublesome are your 'off' time periods with current oral treatment?",
            options: ["Mild", "Moderate", "Severe"],
            multiple: false,
            points: { "Mild": 1, "Moderate": 2, "Severe": 3 }
        },
        {
            id: 16,
            section: "DYSKINESIA",
            question: "How often do you experience troublesome dyskinesia?",
            options: ["Never", "Rarely (≤1/week)", "Sometimes (several times per week)", "Most/All the time (daily)"],
            multiple: false,
            points: { "Never": 0, "Rarely (≤1/week)": 1, "Sometimes (several times per week)": 2, "Most/All the time (daily)": 3 }
        },
        {
            id: 17,
            section: "ACTIVITIES OF DAILY LIVING (ADL)",
            question: "What is your level of independence in activities of daily living?",
            options: ["Independent in all activities", "Independent in most activities", "Needs assistance/dependent in some activities", "Totally dependent in all activities"],
            multiple: false,
            points: { "Independent in all activities": 0, "Independent in most activities": 1, "Needs assistance/dependent in some activities": 2, "Totally dependent in all activities": 3 }
        },
        {
            id: 18,
            section: "FALLS",
            question: "How many falls do you experience per month?",
            options: ["No falls", "1 fall", "2 or more falls"],
            multiple: false,
            points: { "No falls": 0, "1 fall": 1, "2 or more falls": 2 }
        },
        {
            id: 19,
            section: "DYSTONIA",
            question: "How often do you experience dystonia with pain?",
            options: ["Never", "Rarely (≤1/week)", "Sometimes (several times per week)", "Most/All the time (daily)"],
            multiple: false,
            points: { "Never": 0, "Rarely (≤1/week)": 1, "Sometimes (several times per week)": 2, "Most/All the time (daily)": 3 }
        },
        {
            id: 20,
            section: "DYSTONIA",
            question: "How severe/troublesome is your dystonia with pain?",
            options: ["Mild", "Moderate", "Severe"],
            multiple: false,
            points: { "Mild": 1, "Moderate": 2, "Severe": 3 }
        },
        {
            id: 21,
            section: "IMPULSE CONTROL DISORDER",
            question: "How often do you experience impulse control disorder?",
            options: ["Never", "Rarely (≤1/week)", "Sometimes (several times per week)", "Most/All the time (daily)"],
            multiple: false,
            points: { "Never": 0, "Rarely (≤1/week)": 1, "Sometimes (several times per week)": 2, "Most/All the time (daily)": 3 }
        },
        {
            id: 22,
            section: "IMPULSE CONTROL DISORDER",
            question: "How severe/troublesome is the impairment due to your impulse control disorder?",
            options: ["Mild", "Moderate", "Severe"],
            multiple: false,
            points: { "Mild": 1, "Moderate": 2, "Severe": 3 }
        }
    ];

    // Initialize the form with questions
    function initializeForm() {
        const questionsContainer = document.getElementById('questions-container');
        if (!questionsContainer) {
            console.error("Questions container not found in the DOM.");
            return;
        }

        questions.forEach(question => {
            const questionElement = createQuestionElement(question);
            questionsContainer.appendChild(questionElement);
        });

        // Create disqualification screen
        const disqualificationScreen = document.createElement('div');
        disqualificationScreen.id = 'disqualification-screen';
        disqualificationScreen.classList.add('question');
        disqualificationScreen.innerHTML = `
            <div id="disqualification-message" style="color: red; font-size: 1.5rem; margin-top: 20px;">
                Non-candidacy.
            </div>
        `;
        questionsContainer.appendChild(disqualificationScreen);

        showQuestion(currentQuestionIndex);
    }

    function createQuestionElement(questionData) {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.id = `question-${questionData.id}`;
    
        // Function to wrap text inside brackets with a span for colour styling
        function formatQuestionText(questionText) {
            // Match text inside both square brackets [] and round brackets ()
            return questionText.replace(/\[(.*?)\]/g, '<span class="bracket-text">[$1]</span>')
                               .replace(/\((.*?)\)/g, '<span class="bracket-text">($1)</span>');
        }
    
        let formattedQuestion = formatQuestionText(questionData.question);
    
        let optionsHTML = '';
        questionData.options.forEach((option, index) => {
            const optionId = `option-${questionData.id}-${index + 1}`;
            const inputType = questionData.multiple ? 'checkbox' : 'radio';
            optionsHTML += `
                <div class="option-block">
                    <label for="${optionId}" class="option-label">
                        <input type="${inputType}" name="question-${questionData.id}" value="${option}" id="${optionId}" class="option-input" />
                        <span class="custom-radio"></span>
                        ${option}
                    </label>
                    <span id="result-${optionId}"></span>
                </div>
                <hr />
            `;
        });
    
        // Build question HTML
        questionDiv.innerHTML = `
            <h3>${formattedQuestion}</h3>
            <p>Choose ${questionData.multiple ? 'one or more answers' : '1 answer'}</p>
            <hr />
            ${optionsHTML}
            <button type="button" class="back-button">Back</button>
            <button type="button" class="next-button">Next</button>
        `;
    
        // Hide back button on first question
        if (questionData.id === 1) {
            questionDiv.querySelector('.back-button').style.display = 'none';
        }
    
        // Add event listeners for next and previous buttons
        const backButton = questionDiv.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', previousQuestion);
        }
    
        const nextButton = questionDiv.querySelector('.next-button');
        if (nextButton) {
            nextButton.addEventListener('click', () => nextQuestion(questionData));
        }
    
        return questionDiv;
    }

    // Show a specific question by index
    function showQuestion(index) {
        const questionElements = document.querySelectorAll('.question');

        if (index >= 0 && index < questionElements.length) {
            questionElements.forEach((questionElement, i) => {
                if (i === index) {
                    questionElement.classList.remove('fade-out');
                    questionElement.classList.add('active');
                } else {
                    questionElement.classList.remove('active');
                    questionElement.classList.add('fade-out');
                }
            });

            // Toggle back button visibility
            const backButton = questionElements[index].querySelector('.back-button');
            if (backButton) {
                backButton.style.display = index === 0 ? 'none' : 'inline-block';
            }

            // Update progress bar
            const progressPercent = ((index + 1) / questions.length) * 100;
            progress.style.width = `${progressPercent}%`;

            currentQuestionIndex = index;
        } else {
            console.error(`Invalid index ${index} for questions array.`);
        }
    }

    // Function to handle the next question
    function nextQuestion(questionData) {
        const selectedOption = document.querySelector(`input[name="question-${questionData.id}"]:checked`);
        if (!selectedOption) {
            alert('Please select an option.');
            return;
        }

        switch (questionData.section) {
            case "MOTOR FLUCTUATIONS":
                if (questionData.id === 7) {
                    score1 = questionData.points[selectedOption.value];
                } else if (questionData.id === 8) {
                    score2 = questionData.points[selectedOption.value];
                    motorFluctuationsScore = score1 * score2;
                }
                break;
            case "FREEZING OF GAIT":
                if (questionData.id === 9) {
                    score1 = questionData.points[selectedOption.value];
                } else if (questionData.id === 10) {
                    score2 = questionData.points[selectedOption.value];
                    freezingOfGaitScore = score1 * score2;
                }
                break;
            case "NON-MOTOR SYMPTOMS":
                if (questionData.id === 11) {
                    score1 = questionData.points[selectedOption.value];
                } else if (questionData.id === 12) {
                    score2 = questionData.points[selectedOption.value];
                    nonMotorSymptomsScore = score1 * score2;
                }
                break;
            case "HALLUCINATION/PSYCHOSIS":
                if (questionData.id === 13) {
                    score1 = questionData.points[selectedOption.value];
                } else if (questionData.id === 14) {
                    score2 = questionData.points[selectedOption.value];
                    hallucinationScore = score1 * score2;
                }
                break;
            case "OFF-TIME":
                offTimeScore = questionData.points[selectedOption.value];
                break;
            case "DYSKINESIA":
                dyskinesiaScore = questionData.points[selectedOption.value];
                break;
            case "ACTIVITIES OF DAILY LIVING (ADL)":
                adlImpairmentScore = questionData.points[selectedOption.value];
                break;
            case "FALLS":
                fallsScore = questionData.points[selectedOption.value];
                break;
            case "DYSTONIA":
                if (questionData.id === 19) {
                    score1 = questionData.points[selectedOption.value];
                } else if (questionData.id === 20) {
                    score2 = questionData.points[selectedOption.value];
                    dystoniaScore = score1 * score2;
                }
                break;
            case "IMPULSE CONTROL DISORDER":
                if (questionData.id === 21) {
                    score1 = questionData.points[selectedOption.value];
                } else if (questionData.id === 22) {
                    score2 = questionData.points[selectedOption.value];
                    impulseControlScore = score1 * score2;
                }
                break;
            default:
                break;
        }

        printScores()

        if (questionData.disqualifyingOptions && questionData.disqualifyingOptions.includes(selectedOption.value)) {
            customMessage = "Based on your answers, you may not benefit from DBS at this time. Please consult your physician for any further questions. Thank you for taking the time to complete this questionnaire."
            displayCustomResult(customMessage);
            console.log(`${questionData.id}`);
            return;
        }


        // Check if the next question should be skipped
        const nextQuestionData = questions[currentQuestionIndex + 1];
        if (nextQuestionData && nextQuestionData.skipIf) {
            const previousQuestionData = questions.find(question => question.id === nextQuestionData.skipIf.previousQuestionId);
            const previousAnswer = document.querySelector(`input[name="question-${previousQuestionData.id}"]:checked`).value;
            if (previousAnswer === nextQuestionData.skipIf.previousAnswer) {
                currentQuestionIndex++;
            }
        }

        if (currentQuestionIndex < questions.length - 1) {
            showQuestion(currentQuestionIndex + 1);
        } else {
            determineCategory();
        }
    }

    // Function to handle the previous question
    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            showQuestion(currentQuestionIndex - 1);
        }
    }

    // Function to display custom result
    function displayCustomResult(message) {
        const questionsContainer = document.getElementById('questions-container');
        questionsContainer.innerHTML = `
            <div class="custom-result">
                <h3>${message}</h3>
            </div>
        `;
    }

    function printScores()
    {
        console.log("Motor Fluctuations Score:", motorFluctuationsScore);
        console.log("Freezing of Gait Score:", freezingOfGaitScore);
        console.log("Non-Motor Symptoms Score:", nonMotorSymptomsScore);
        console.log("Hallucination/Psychosis Score:", hallucinationScore);
        //console.log("Off-Time Score:", offTimeScore);
        //console.log("Dyskinesia Score:", dyskinesiaScore);
        //console.log("ADL Impairment Score:", adlImpairmentScore);
        //console.log("Falls Score:", fallsScore);
        //console.log("Dystonia Score:", dystoniaScore);
        //console.log("Impulse Control Disorder Score:", impulseControlScore);
            }

    // DEPRECIATED - FUNCTIONED FOR PREVIOUS POINT SYSTEM 
    function determineCategory() {
        let dosesAnswer;
        const dosesQuestion = questions.find(question => question.id === 1);
        const dosesSelected = document.querySelector(`input[name="question-${dosesQuestion.id}"]:checked`);

        cat_1 = "Based on your answers, you may not benefit from DBS at this time. Please consult your physician for any further questions. Thank you for taking the time to complete this questionnaire.";
        cat_2 = "Based on your answers, you may not benefit from DBS at this time. Please ask your physician about potentially optimizing current treatment. Thank you for taking the time to complete this questionnaire."
        cat_3 = "Based on your answers, you are a candidate for DBS at this time. Please consult a specialist about device-aided therapy. Thank you for taking the time to complete this questionnaire."
        if (dosesSelected) {
            dosesAnswer = dosesSelected.value;
        }

        let category;
        if (dosesAnswer === "3 doses or less") {
            if (points === 0) {
                category = cat_1;
            } else {
                category = cat_2;
            }
        } else if (dosesAnswer === "4 doses") {
            if (points === 0) {
                category = cat_1;
            } else {
                category = cat_3;
            }
        } else if (dosesAnswer === "5 doses or greater") {
            category = cat_3;
        }

        displayCustomResult(category);
    }

    // Initialize the form when the DOM content is loaded
    initializeForm();
});
