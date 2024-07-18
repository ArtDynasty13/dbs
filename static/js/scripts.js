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
            question: "Are you taking 5 doses or more of levodopa?",
            options: ["Yes", "No"],
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
            question: "Have you experienced any of the following?",
            options: ["troublesome dyskinesia (involuntary movement)", "dystonia (more than one hour of uncontrolled muscle contraction)", "neither"],
            multiple: true,
        },
        {
            id: 4,
            question: "Is your Parkinson's tremor dominant?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 5,
            question: "Do you experience bothersome stiffness and/or slowness?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 6,
            question: "Do you experience any gait balancing impairment (freezing of gait)?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 7,
            question: "Do you have any memory issues, hallucinations and/or untreated depression?",
            options: ["Yes", "No"],
            multiple: false
        },
        {
            id: 8,
            question: "Please list your current PD medications dosage and frequency.",
            options: [
                "Rasagiline",
                "Selegiline",
                "Pramipexole",
                "Ropinirole",
                "Rotigotine transdermal patch",
                "Bromocriptine",
                "Levodopa-carbidopa immediate-release",
                "Levodopa-benserazide immediate-release",
                "Amantadine",
                "Benztropine",
                "Trihexyphenidyl",
                "Other"
            ],
            multiple: false
        },
        {
            id: 9,
            question: "This is the end of the survey. You may return to any previous questions before submitting.",
            options: ["I understand"],
            multiple: false
        },
        {
            id: 10,
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
            return questionText.replace(/\[(.*?)\]/g, '<span class="bracket-text">[$1]</span>')
                               .replace(/\((.*?)\)/g, '<span class="bracket-text">($1)</span>');
        }
    
        let formattedQuestion = formatQuestionText(questionData.question);
        let optionsHTML = '';
    
        if (questionData.id === 8) {
            optionsHTML += `
                    <label for="cars">Choose a car:</label>
                    <select name="cars" id="cars">
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="opel">Opel</option>
                        <option value="audi">Audi</option>
                    </select>
                    <br><br>
            `;
        } else {
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
        }
    
        questionDiv.innerHTML = `
            <h3>${formattedQuestion}</h3>
            <p>Choose ${questionData.multiple ? 'one or more answers' : '1 answer'}</p>
            <hr />
            ${optionsHTML}
            <button type="button" class="back-button">Back</button>
            <button type="button" class="next-button">Next</button>
        `;
    
        if (questionData.id === 1) {
            questionDiv.querySelector('.back-button').style.display = 'none';
        }
    
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
        let selectedOption;
        if (questionData.id === 8) {
            const medicationDropdown = document.getElementById('medication-dropdown');
            const frequencyInput = document.getElementById('frequency-input');
            const otherMedicationInput = document.getElementById('other-medication-input');
    
            const medication = medicationDropdown.value;
            const frequency = frequencyInput.value;
            const otherMedication = otherMedicationInput.value;
    
            if (medication === "Other" && !otherMedication) {
                alert('Please enter the name of the other medication.');
                return;
            }
    
            responses[questionData.id] = {
                medication: medication === "Other" ? otherMedication : medication,
                frequency: frequency
            };
        } else {
            selectedOption = document.querySelector(`input[name="question-${questionData.id}"]:checked`);
            if (!selectedOption) {
                alert('Please select an option.');
                return;
            }
            responses[questionData.id] = selectedOption.value;
        }

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