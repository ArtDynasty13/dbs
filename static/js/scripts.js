document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    const progress = document.querySelector('.progress-bar');
    const animationDuration = 1000; // Duration of the animation in milliseconds

    const responses = {};

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
                        <button type="button" class="remove-medication-button">Remove</button>
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

        const removeMedicationButtons = questionDiv.querySelectorAll('.remove-medication-button');
        removeMedicationButtons.forEach(button => {
            button.addEventListener('click', removeMedicationEntry);
        });

        return questionDiv;
    }

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

        if (currentQuestionData.id === 8) {
            const medicationTypes = document.querySelectorAll('.medication-type');
            const frequencies = document.querySelectorAll('.frequency');
            responses[currentQuestionData.id] = [];
            medicationTypes.forEach((type, index) => {
                const typeValue = type.value;
                const frequencyValue = frequencies[index].value;
                if (typeValue !== 'select' && frequencyValue !== 'na') {
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

    function addMedicationEntry() {
        const container = document.getElementById('medication-container');
        const newEntry = document.createElement('div');
        newEntry.classList.add('medication-entry');

        newEntry.innerHTML = `
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
            <button type="button" class="remove-medication-button">Remove</button>
        `;

        const removeButton = newEntry.querySelector('.remove-medication-button');
        removeButton.addEventListener('click', removeMedicationEntry);

        container.appendChild(newEntry);
    }

    function removeMedicationEntry(event) {
        const button = event.target;
        const entry = button.closest('.medication-entry');
        entry.remove();
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

    initializeForm();
});
