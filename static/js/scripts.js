document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    let points = 0;
    let motorFluctuationsScore = 0;
    let freezingOfGaitScore = 0;
    let nonMotorSymptomsScore = 0;
    let hallucinationScore = 0;
    let offTimeScore = 0;
    let dyskinesiaScore = 0;
    let adlImpairmentScore = 0;
    let fallsScore = 0;
    let dystoniaScore = 0;
    let impulseControlScore = 0;
    const progress = document.querySelector('.progress-bar');
    const animationDuration = 1000; // Duration of the animation in milliseconds

    const responses = {};

    // Define your questions data
    const questions = [
        {
            id: 0,
            question: "This simple survey is designed to assess your suitability for consulting with a Movement Disorder Specialist for possible Deep Brain Stimulation (DBS).",
            options: ["I understand"],
            multiple: false
        },
        {
            id: 1,
            question: "How many daily doses of levodopa are you taking?",
            options: ["≤3 doses", "4 doses", "≥5 doses"],
            multiple: false
        },
        {
            id: 2,
            question: "Are you experiencing a total of greater than 2 hours of daily “off-time“ (where Parkinson’s symptoms become more noticeable often after an initial benefit from oral treatment)?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 3,
            question: "Are you experiencing unpredictable fluctuations of motor symptoms (a sudden and unpredictable recurrence of symptoms generally unrelated to next dose timing) with your current oral treatment?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 4,
            question: "Are you experiencing troublesome dyskinesia (involuntary body movements that interfere with your daily living activities) with your current oral treatment?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 5,
            question: "Are you presently limited in performing one or more activities of daily living (eg: walking, bathing, dressing, eating, toileting, etc.)?",
            options: ["Yes", "No"],
            multiple: false,
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
            points: { "Never": 0, "Rarely (≤1/week)": 1, "Sometimes (several times per week)": 2, "Most/All the time (daily)": 3 },
            skipIf: {
                previousQuestionId: 3,
                previousAnswer: "No"
            }
        },
        {
            id: 8,
            section: "MOTOR FLUCTUATIONS",
            question: "How troublesome are your motor fluctuations?",
            options: ["Mild", "Moderate", "Severe"],
            multiple: false,
            points: { "Mild": 1, "Moderate": 2, "Severe": 3 },
            skipIf: {
                previousQuestionId: 3,
                previousAnswer: "No"
            }
        },
        {
            id: 9,
            section: "FREEZING OF GAIT",
            question: "How often do you experience freezing of gait during “off-time“?",
            options: ["Never", "Rarely (≤1/week)", "Sometimes (several times per week)", "Most/All the time (daily)"],
            multiple: false,
            points: { "Never": 0, "Rarely (≤1/week)": 1, "Sometimes (several times per week)": 2, "Most/All the time (daily)": 3 }
        },
        {
            id: 10,
            section: "FREEZING OF GAIT",
            question: "How troublesome are your episodes of freezing of gait during “off-time“?",
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
            question: "How troublesome are your non-motor 'off' symptoms?",
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
            question: "How troublesome are your episodes of hallucinations/psychosis without insight?",
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
            question: "How troublesome are your “off-time“ periods with current oral treatment?",
            options: ["Mild", "Moderate", "Severe"],
            multiple: false,
            points: { "Mild": 1, "Moderate": 2, "Severe": 3 },
            skipIf: {
                previousQuestionId: 2,
                previousAnswer: "No"
            }
        },
        {
            id: 16,
            section: "DYSKINESIA",
            question: "How often do you experience troublesome dyskinesia?",
            options: ["Never", "Rarely (≤1/week)", "Sometimes (several times per week)", "Most/All the time (daily)"],
            multiple: false,
            points: { "Never": 0, "Rarely (≤1/week)": 1, "Sometimes (several times per week)": 2, "Most/All the time (daily)": 3 },
            skipIf: {
                previousQuestionId: 4,
                previousAnswer: "No"
            }
        },
        {
            id: 17,
            section: "ACTIVITIES OF DAILY LIVING (ADL)",
            question: "What is your level of independence in activities of daily living?",
            options: ["Independent in all activities", "Independent in most activities", "Needs assistance/dependent in some activities", "Totally dependent in all activities"],
            multiple: false,
            points: { "Independent in all activities": 0, "Independent in most activities": 1, "Needs assistance/dependent in some activities": 2, "Totally dependent in all activities": 3 },
            skipIf: {
                previousQuestionId: 5,
                previousAnswer: "No"
            }
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
            question: "How troublesome is your dystonia with pain?",
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
            question: "How troublesome is the impairment due to your impulse control disorder?",
            options: ["Mild", "Moderate", "Severe"],
            multiple: false,
            points: { "Mild": 1, "Moderate": 2, "Severe": 3 }
        },
        {
            id: 23,
            question: "This is the end of the survey. You may return to any previous questions before submitting.",
            options: ["I understand"],
            multiple: false
        },
        {
            id: 24,
            question: "",
            options: [""],
            multiple: false
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

    function nextQuestion(questionData) {
        const selectedOption = document.querySelector(`input[name="question-${questionData.id}"]:checked`);
        if (!selectedOption) {
            alert('Please select an option.');
            return;
        }

        //5th question is last in SECTION 1
        if(currentQuestionIndex === 5) {
            let levodopaDoses = responses[1];
                // Extract numerical value from the string using a regular expression
            const matches = levodopaDoses.match(/\d+/);
            if (matches) {
                levodopaDoses = parseInt(matches[0], 10);
            } else {
                // Handle case where no number is found, if necessary
                levodopaDoses = 0; // Default value or handle as needed
            }
            const result = determineCategory(responses, levodopaDoses);
            //console.log(result.category)
            if(result.category !== 3)
            {
                displayCustomResult(result.message);
            }
        }

        //add responses to holder
        responses[questionData.id] = selectedOption.value;

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

        //printScores()

        if (questionData.disqualifyingOptions && questionData.disqualifyingOptions.includes(selectedOption.value)) {
            customMessage = "Based on your answers, you may not benefit from DBS at this time. Please consult your physician for any further questions. Thank you for taking the time to complete this questionnaire."
            displayCustomResult(customMessage);
            console.log(`${questionData.id}`);
            return;
        }
    
        // Check if there's a question to skip based on current question's skipIf condition
        const nextIndex = findNextValidQuestion(currentQuestionIndex, selectedOption.value);
        if (nextIndex !== null) {
            showQuestion(nextIndex);
        } else {
            determineCategory();
        }

        //IF ON LAST QUESTION, PRINT RESULTS
        if(currentQuestionIndex === questions[questions.length - 1].id){
                displayAllScores();
        }
    }
    
    function findNextValidQuestion(startIndex, answerValue) {
        // Start searching from the next question after startIndex
        for (let i = startIndex + 1; i < questions.length; i++) {
            const question = questions[i];
    
            if (question.skipIf) {
                const { previousQuestionId, previousAnswer } = question.skipIf;
                const previousQuestion = questions.find(q => q.id === previousQuestionId);
                const previousAnswerValue = document.querySelector(`input[name="question-${previousQuestion.id}"]:checked`).value;
    
                if (previousAnswerValue === previousAnswer) {
                    // Continue to skip this question
                    continue;
                }
            }
    
            // Check if this question should be skipped based on current answer
            if (question.skipIf && question.skipIf.previousAnswer === answerValue) {
                continue;
            }
    
            // Return index of the first valid question found
            return i;
        }
    
        // Return null if no valid question found
        return null;
    }
    

    function previousQuestion() {
        // Find the index of the last answered question before the current index
        for (let i = currentQuestionIndex - 1; i >= 0; i--) {
            const questionElement = document.getElementById(`question-${i}`);
            const selectedOption = questionElement.querySelector(`input[name="question-${i}"]:checked`);
            if (selectedOption) {
                showQuestion(i);
                return;
            }
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

    function isAnyResponseYes(responses)
    {
        const values = Object.values(responses);
        return values.some(response => response === 'Yes');
    }

    function determineCategory(responses, levodopaDoses) {
        // Ensure all branches return a value
        if (levodopaDoses !== 5 && !isAnyResponseYes(responses)) {
            return {
                category: 1,
                message: "CAT 1 - Based on your answers, you may not benefit from DBS at this time. Please consult your physician for any further questions. Thank you for taking the time to complete this questionnaire."
            };
        } else if (levodopaDoses !== 5 && isAnyResponseYes(responses)) {
            if (levodopaDoses === 3) {
                return {
                    category: 2,
                    message: "CAT 2 - Based on your answers, you may not benefit from DBS at this time. Please ask your physician about potentially optimizing current treatment. Thank you for taking the time to complete this questionnaire."
                };
            } else { // levodopaDoses is 4 and one yes
                return {
                    category: 3, //message does not display, will just proceed to next question
                    //message: "CAT 3 - Based on your answers, you are a candidate for DBS at this time. Please consult a specialist about device-aided therapy. Please proceed to Section 2."
                };
            }
        } else if (levodopaDoses === 5) {
            return {
                category: 3,//message does not display, will just proceed to next question
                //message: "CAT 3 - Based on your answers, you are a candidate for DBS at this time. Please consult a specialist about device-aided therapy. Please proceed to Section 2."
            };
        }

        // Default return value to handle unexpected cases
        return {
            category: -1,
            message: "An unexpected error occurred. Please try again."
        };
}
function displayAllScores() {
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = `
        <div class="custom-result">
            <h3>Survey Results</h3>
            <p>Motor Fluctuations Score: ${motorFluctuationsScore}</p>
            <p>Freezing of Gait Score: ${freezingOfGaitScore}</p>
            <p>Non-Motor Symptoms Score: ${nonMotorSymptomsScore}</p>
            <p>Hallucination/Psychosis Score: ${hallucinationScore}</p>
            <p>Off-Time Score: ${offTimeScore}</p>
            <p>Dyskinesia Score: ${dyskinesiaScore}</p>
            <p>ADL Impairment Score: ${adlImpairmentScore}</p>
            <p>Falls Score: ${fallsScore}</p>
            <p>Dystonia Score: ${dystoniaScore}</p>
            <p>Impulse Control Disorder Score: ${impulseControlScore}</p>
        </div>
    `;
}


    // Initialize the form when the DOM content is loaded
    initializeForm();
});