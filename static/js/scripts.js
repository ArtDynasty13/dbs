document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    const progress = document.querySelector('.progress-bar');
    const animationDuration = 1000; // Duration of the animation in milliseconds

    const responses = {};

    let selectedMedications = [];

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
            question: "Do you experience one hour or more of daily troublesome dyskinesia (involuntary movement)?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 4,
            question: "Do you experience dystonia (uncontrolled muscle contraction)?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 5,
            question: "Is your Parkinson's 'tremor dominant'?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 6,
            question: "Do you experience bothersome stiffness and/or slowness?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 7,
            question: "Do you experience gait balancing impairment (freezing of gait)?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 8,
            question: "Do you have memory issues, hallucinations and/or untreated depression?",
            options: ["Yes", "No"],
            multiple: false
        },
        {
            id: 9,
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

        const disqualificationScreen = document.createElement('div');
        disqualificationScreen.id = 'disqualification-screen';
        disqualificationScreen.classList.add('question');
        disqualificationScreen.innerHTML = `
            <div id="disqualification-message" style="color: blue; font-size: 2.5rem; margin-top: 20px;">
                Based on your answers, you may not benefit from device aided therapy at this time. Thank you for taking the time to complete this questionnaire. If you have any concerns or need further assistance, please consult with your physician.
            </div>
        `;
        questionsContainer.appendChild(disqualificationScreen);

        showQuestion(currentQuestionIndex);
    }

    function createQuestionElement(questionData) {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.id = `question-${questionData.id}`;

        function formatQuestionText(questionText) {
            return questionText.replace(/\[(.*?)\]/g, '<span class="bracket-text">[$1]</span>')
                .replace(/\((.*?)\)/g, '<span class="bracket-text">($1)</span>');
        }

        let formattedQuestion = formatQuestionText(questionData.question);
        let optionsHTML = '';

        if (questionData.id === 9) {
            optionsHTML += `
                <div id="medication-container"></div>
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

    function showQuestion(index) {
        const questionElements = document.querySelectorAll('.question');

        if (index >= 0 && index < questionElements.length) {
            questionElements.forEach((questionElement, i) => {
                if (i === index) {
                    questionElement.classList.remove('fade-out');
                    questionElement.classList.add('active');

                    if (questions[i].id === 9) {
                        if (document.querySelectorAll('.medication-entry').length === 0) {
                            addMedicationEntry();
                        }
                    }
                } else {
                    questionElement.classList.remove('active');
                    questionElement.classList.add('fade-out');
                }
            });

            const backButton = questionElements[index].querySelector('.back-button');
            if (backButton) {
                backButton.style.display = index === 0 ? 'none' : 'inline-block';
            }

            const progressPercent = ((index + 1) / questionElements.length) * 100;
            progress.style.width = `${progressPercent}%`;
        }
    }

    function nextQuestion(currentQuestionData) {
        const questionInputs = document.querySelectorAll(`#question-${currentQuestionData.id} .option-input`);
        let answered = false;

        if (currentQuestionData.id === 9) {
            const medicationTypes = document.querySelectorAll('.medication-type');
            const frequencies = document.querySelectorAll('.frequency');
            responses[currentQuestionData.id] = [];
            medicationTypes.forEach((type, index) => {
                const typeValue = type.value;
                const frequencyValue = frequencies[index].value;
                if (typeValue !== 'select' && frequencyValue !== 'select') {
                    responses[currentQuestionData.id].push({
                        type: typeValue,
                        frequency: frequencyValue
                    });
                }
            });
            answered = responses[currentQuestionData.id].length > 0;
        } else {
            questionInputs.forEach(input => {
                if (input.checked) {
                    answered = true;
                    responses[currentQuestionData.id] = input.value;
                }
            });
        }

        if (answered) {
            if (checkDisqualification(currentQuestionData.id, responses[currentQuestionData.id])) {
                showDisqualificationScreen();
            } else {
                currentQuestionIndex++;
                if (currentQuestionIndex >= questions.length) {
                    showResults();
                } else {
                    showQuestion(currentQuestionIndex);
                }
            }
        } else {
            alert('Please select an answer before proceeding.');
        }
    }

    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    }

    function checkDisqualification(questionId, response) {
        // Less than 5 doses of levodopa
        if (questionId === 1 && response === 'No') {
            return true;
        }
        // failed 5 (levodopa doses) - 2 (off-time) - 1 (dyskinesia) test
        if(questionId === 3 && response === 'No' && responses[2] === 'No') {
            return true;
        }
        //self reported cognitive issues
        if(questionId === 8 && response == 'Yes')
        {
            return true;
        }
        // Add other disqualification conditions as needed
        return false;
    }

    function showDisqualificationScreen() {
        const questionElements = document.querySelectorAll('.question');
        questionElements.forEach(questionElement => {
            questionElement.classList.remove('active');
            questionElement.classList.add('fade-out');
        });

        const disqualificationScreen = document.getElementById('disqualification-screen');
        disqualificationScreen.classList.remove('fade-out');
        disqualificationScreen.classList.add('active');
    }

    function showResults() {
        const questionElements = document.querySelectorAll('.question');
        questionElements.forEach(questionElement => {
            questionElement.classList.remove('active');
            questionElement.classList.add('fade-out');
        });

        const resultScreen = document.createElement('div');
        resultScreen.classList.add('question', 'result-screen');
        resultScreen.innerHTML = `
            <h2>Survey Results</h2>
            <p>Thank you for completing the survey. Here are your responses:</p>
            <pre>${JSON.stringify(responses, null, 2)}</pre>
        `;

        const questionsContainer = document.getElementById('questions-container');
        questionsContainer.appendChild(resultScreen);

        resultScreen.classList.remove('fade-out');
        resultScreen.classList.add('active');
    }

    function addMedicationEntry() {
        const medicationContainer = document.getElementById('medication-container');
        if (!medicationContainer) {
            console.error("Medication container not found in the DOM.");
            return;
        }
    
        const medicationEntry = document.createElement('div');
        medicationEntry.classList.add('medication-entry');
        medicationEntry.innerHTML = `
            <label for="medication-type">Medication Type:</label>
            <select class="medication-type custom-select"> <!-- Add 'custom-select' class -->
                <option value="select">Select Medication</option>
                ${questions[9].options.map(option => `<option value="${option}">${option}</option>`).join('')}
            </select>
            <label for="other-medication" class="other-medication-label" style="display:none;">Please specify:</label>
            <input type="text" class="other-medication-input" style="display:none;" />
            <label for="frequency">Frequency:</label>
            <select class="frequency custom-select"> <!-- Add 'custom-select' class -->
                <option value="select">Select Frequency</option>
                <option value="na">N/A</option>
                <option value="1">1 time a day</option>
                <option value="2">2 times a day</option>
                <option value="3">3 times a day</option>
                <option value="4">4 times a day</option>
                <option value="5">5 times a day</option>
            </select>
            <button type="button" class="remove-medication-button">Remove</button>
            <br>
        `;
        
    
        medicationContainer.appendChild(medicationEntry);
    
        const removeButton = medicationEntry.querySelector('.remove-medication-button');
        if (removeButton) {
            removeButton.addEventListener('click', () => {
                medicationEntry.remove();
                checkDuplicateMedication(); // Update duplicates after removal
            });
        }
    
        const medicationTypeSelect = medicationEntry.querySelector('.medication-type');
        if (medicationTypeSelect) {
            medicationTypeSelect.addEventListener('change', function() {
                const otherMedicationInput = medicationEntry.querySelector('.other-medication-input');
                const otherMedicationLabel = medicationEntry.querySelector('.other-medication-label');
                if (this.value === 'Other') {
                    otherMedicationInput.style.display = 'inline';
                    otherMedicationLabel.style.display = 'inline';
                    otherMedicationInput.focus();
                } else {
                    otherMedicationInput.style.display = 'none';
                    otherMedicationLabel.style.display = 'none';
                    otherMedicationInput.value = ''; // Clear input when not needed
                }
                checkDuplicateMedication(); // Update duplicates
            });
        }
    
        const otherMedicationInput = medicationEntry.querySelector('.other-medication-input');
        if (otherMedicationInput) {
            otherMedicationInput.addEventListener('input', checkDuplicateMedication);
        }
    
        const frequencySelect = medicationEntry.querySelector('.frequency');
        if (frequencySelect) {
            frequencySelect.addEventListener('change', checkDuplicateMedication);
        }
    }
    
    function checkDuplicateMedication() {
        const medicationTypes = document.querySelectorAll('.medication-type');
        const otherMedicationInputs = document.querySelectorAll('.other-medication-input');
        selectedMedications = [];
    
        medicationTypes.forEach((select, index) => {
            const value = select.value;
            if (value === 'Other') {
                const otherInput = otherMedicationInputs[index];
                if (otherInput && otherInput.value.trim()) {
                    selectedMedications.push(otherInput.value.trim());
                }
            } else if (value !== 'select') {
                selectedMedications.push(value);
            }
        });
    
        const duplicates = selectedMedications.filter((item, index) => selectedMedications.indexOf(item) !== index);
        
        medicationTypes.forEach((select, index) => {
            if (select.value === 'Other') {
                const otherInput = otherMedicationInputs[index];
                if (otherInput && duplicates.includes(otherInput.value.trim())) {
                    select.setCustomValidity('This custom medication has already been selected.');
                    otherInput.setCustomValidity('This custom medication has already been selected.');
                } else {
                    select.setCustomValidity('');
                    otherInput.setCustomValidity('');
                }
            } else if (duplicates.includes(select.value)) {
                select.setCustomValidity('This medication has already been selected.');
            } else {
                select.setCustomValidity('');
            }
            select.reportValidity();
        });
    }
    

    initializeForm();
});
