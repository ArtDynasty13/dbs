document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
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
            options: ["One hour or more of Troublesome Dyskinesia (involuntary movement)", "Dystonia (uncontrolled muscle contraction)", "neither"],
            multiple: true,
        },
        {
            id: 4,
            question: "Is your Parkinson's 'Tremor Dominant'?",
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
            question: "Do you have memory issues, hallucinations and/or untreated depression?",
            options: ["Yes", "No"],
            multiple: false
        },
        {
            id: 8,
            question: "Please list your current PD medications frequency.",
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
                <div id="medication-container">
                    <div class="medication-entry">
                        <div>
                            <label for="medicationType">Select your medication type:</label>
                            <select name="medicationType" class="medication-type">
                                <option value="select">--Please Select an Option--</option>
                                <option value="Rasagiline">Rasagiline</option>
                                <option value="Selegiline">Selegiline</option>
                                <option value="Pramipexole">Pramipexole</option>
                                <option value="Ropinirole">Ropinirole</option>
                                <option value="Rotigotine transdermal patch">Rotigotine transdermal patch</option>
                                <option value="Bromocriptine">Bromocriptine</option>
                                <option value="Levodopa-carbidopa immediate-release">Levodopa-carbidopa immediate-release</option>
                                <option value="Levodopa-benserazide immediate-release">Levodopa-benserazide immediate-release</option>
                                <option value="Amantadine">Amantadine</option>
                                <option value="Benztropine">Benztropine</option>
                                <option value="Trihexyphenidyl">Trihexyphenidyl</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style="margin-left: 10px;">
                            <label for="frequency">Frequency per day:</label>
                            <select name="frequency" class="frequency">
                                <option value="na">Non Applicable</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5+">5+</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button type="button" class="add-medication-button">Add Another Medication</button>
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

        const addMedicationButton = questionDiv.querySelector('.add-medication-button');
        if (addMedicationButton) {
            addMedicationButton.addEventListener('click', addMedicationEntry);
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

        // Handle different question types
        if (questionData.id === 8) {
            const medications = document.querySelectorAll('.medication-entry');
            const medicationEntries = [];

            medications.forEach(entry => {
                const medicationType = entry.querySelector('select[name="medicationType"]').value;
                const frequency = entry.querySelector('select[name="frequency"]').value; // changed to select
                medicationEntries.push({ medicationType, frequency });
            });

            responses[questionData.id] = medicationEntries;
        } else {
            selectedOption = document.querySelector(`input[name="question-${questionData.id}"]:checked`);
            if (!selectedOption) {
                alert('Please select an option.');
                return;
            }
            responses[questionData.id] = selectedOption.value;
        }

        // Check for disqualification based on selected options
        if (questionData.disqualifyingOptions && questionData.disqualifyingOptions.includes(selectedOption.value)) {
            const customMessage = "Based on your answers, you may not benefit from DBS at this time. Please consult your physician for any further questions. Thank you for taking the time to complete this questionnaire.";
            displayCustomResult(customMessage);
            return;
        }

        // Find the index of the next valid question
        const nextIndex = findNextValidQuestion(currentQuestionIndex, selectedOption.value);
        if (nextIndex !== null) {
            showQuestion(nextIndex);
        } else {
            determineCategory();
        }

        // If on the last question, display all scores
        if (currentQuestionIndex === questions.length - 1) {
            displayAllScores();
        }
    }

    function previousQuestion() {
        showQuestion(currentQuestionIndex - 1);
    }

    function findNextValidQuestion(currentIndex, answer) {
        let nextIndex = currentIndex + 1;

        while (nextIndex < questions.length) {
            const nextQuestion = questions[nextIndex];
            // Check for conditions to skip certain questions if needed
            if (nextQuestion.id === 4 && answer === "No") {
                nextIndex++;
            } else {
                return nextIndex;
            }
        }

        return null;
    }

    function addMedicationEntry() {
        const medicationContainer = document.querySelector('#medication-container .medication-entry');
        if (!medicationContainer) {
            console.error('No element with ID #medication-container or class .medication-entry found');
            return;
        }
    
        const clone = medicationContainer.cloneNode(true);
        const medicationListContainer = document.getElementById('medication-container');
        if (!medicationListContainer) {
            console.error('No element with ID #medication-container found');
            return;
        }
    
        medicationListContainer.appendChild(clone);
        console.log('New medication entry added');
    }
    
    function determineCategory() {
        // Logic to determine the final category based on responses
        console.log('Determining final category based on responses...');
    }

    function displayAllScores() {
        // Display all scores or final results
        console.log('Displaying all scores or final results...');
    }

    function displayCustomResult(message) {
        const disqualificationScreen = document.getElementById('disqualification-screen');
        if (disqualificationScreen) {
            disqualificationScreen.style.display = 'block';
            const disqualificationMessage = document.getElementById('disqualification-message');
            disqualificationMessage.textContent = message;
        }
    }

    // Initialize the form on page load
    initializeForm();
});


