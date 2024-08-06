document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    const progress = document.querySelector('.progress-bar');
    const animationDuration = 1000; // Duration of the animation in milliseconds

    const responses = {};

    let selectedMedications = [];

    let answeredQuestions = [];

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
            question: "Are you experiencing a total of greater than two hours of daily “off-time“ (where Parkinson’s symptoms become more noticeable often after an initial benefit from oral treatment)?",
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
            question: "Do you experience significant tremors that are not effectively managed by your current medication?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 6,
            question: "Do you experience problems maintaining your balance and coordination while walking (gait balancing impairment)?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 7,
            question: "Do you experience freezing of gait, where your feet are stuck to the ground?",
            options: ["Yes", "No"],
            multiple: false,
            skipIf: {
                previousQuestionId: 6,
                previousAnswer: "No"
            }

        },
        {
            id: 8,
            question: "Do you have memory issues or hallucinations?",
            options: ["Yes", "No"],
            multiple: false
        },
        {
            id: 9,
            question: "Do you have untreated depression?",
            options: ["Yes", "No"],
            multiple: false
        },
        {
            id: 10,
            question: "Please list your current PD medications frequency.",
            options: [
                //"Benztropine mesylate (pdp-Benztropine)",
                "Bromocriptine mesylate (Bromocriptine)",
                "Entacapone (Comtan)",
                //"Enthopropazine (Pasitan 50)",
                "Levodopa and benserazide (Prolopa)",
                "Levodopa and carbidopa (Sinemet)",
                "Levodopa and carbidopa (Sinemet CR)",
                "Levodopa, carbidopa and entacapone (Stalevo)",
                "pdp-amantadine hydrochloride",
                "Pramipexole dihydrochloride monohydrate (Mirapex)",
                "Rasagiline (Azilect)",
                "Ropinirole hydrochloride (Requip)",
                "Safinamide tablets (Onstryv)",
                "Selegiline hydrochloride (Mylan-Selegiline)",
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

        currentQuestionIndex = 10; //to debug med question

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

        if (questionData.id === 10) {
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
            <hr />
            ${optionsHTML}
            <button type="button" class="back-button">Back</button>
            <button type="button" class="next-button">Next</button>
        `;
        //<p>Choose ${questionData.multiple ? 'one or more answers' : '1 answer'}</p>

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

                    if (questions[i].id === 10) {
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
    
        if (currentQuestionData.id === 10) {
            const medicationTypes = document.querySelectorAll('.medication-type');
            const dosages = document.querySelectorAll('.dosage')
            const frequencies = document.querySelectorAll('.frequency');
            console.log(frequencies);
            responses[currentQuestionData.id] = [];
            medicationTypes.forEach((type, index) => {
                const typeValue = type.value;
                const dosageValue = dosages[index].value;
                const frequencyValue = frequencies[index].value;
                if (typeValue !== 'select' && frequencyValue !== 'select' && frequencyValue !== 'more') {
                    responses[currentQuestionData.id].push({
                        type: typeValue,
                        dosage: dosageValue,
                        frequency: frequencyValue
                    });
                }
                if(frequencyValue === 'more')
                {
                    const nonCustomFrequency = parseInt(document.querySelector('.custom-frequency-input').value, 10);
                    responses[currentQuestionData.id].push({
                        type: typeValue,
                        dosage: dosageValue,
                        frequency: nonCustomFrequency
                    });
                }
                console.log("Responses: ", responses);
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
    
        if (!answeredQuestions.includes(currentQuestionIndex)) {
            answeredQuestions.push(currentQuestionIndex);
        }
        // Check if the next question should be skipped
        const nextQuestionData = questions[currentQuestionIndex + 1];
        if (nextQuestionData && nextQuestionData.skipIf) {
            const previousQuestionData = questions.find(question => question.id === nextQuestionData.skipIf.previousQuestionId);
            const previousAnswer = document.querySelector(`input[name="question-${previousQuestionData.id}"]:checked`).value;
            if (previousAnswer === nextQuestionData.skipIf.previousAnswer) {
                currentQuestionIndex++;
                responses[currentQuestionIndex] = "No";
            }
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
        if (answeredQuestions.length > 0) {
            // Get the last answered question index
            const lastAnsweredQuestionIndex = answeredQuestions[answeredQuestions.length - 1];
            // Show the last answered question
            if (lastAnsweredQuestionIndex !== undefined) {
                // Remove the current question from answered questions
                answeredQuestions.pop();
                showQuestion(lastAnsweredQuestionIndex);
                currentQuestionIndex = lastAnsweredQuestionIndex;
            }
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
        if((questionId === 8 || questionId === 9) && response == 'Yes')
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
    
        const ledResult = calculateLED();
        const resultScreen = document.createElement('div');
        resultScreen.classList.add('question', 'result-screen');
        resultScreen.innerHTML = `
    <h2>Form Complete</h2>
        <p>Thank you for completing the survey. Based on your responses, it is advised that you:</p>
        <p style="font-weight: bold; text-align: center; margin-top: 20px;">Present this page to your primary doctor to discuss a referral to PMDP for an assessment for device-aided therapy.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr>
                    <th style="border: 1px solid #000; padding: 8px;">Question</th>
                    <th style="border: 1px solid #000; padding: 8px;">Response</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; padding: 8px;">2 hours off time</td>
                    <td style="border: 1px solid #000; padding: 8px;">${responses[2]}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 8px;">1 hour dyskinesia</td>
                    <td style="border: 1px solid #000; padding: 8px;">${responses[3]}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 8px;">Dystonia</td>
                    <td style="border: 1px solid #000; padding: 8px;">${responses[4]}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 8px;">Tremor dominant</td>
                    <td style="border: 1px solid #000; padding: 8px;">${responses[5]}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 8px;">Gait balancing impairment</td>
                    <td style="border: 1px solid #000; padding: 8px;">${responses[6]}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 8px;">Freezing of gait</td>
                    <td style="border: 1px solid #000; padding: 8px;">${responses[7]}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 8px;">Contra-indications</td>
                    <td style="border: 1px solid #000; padding: 8px;">${responses[8]}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 8px;">LED Score</td>
                    <td style="border: 1px solid #000; padding: 8px;">${ledResult}</td>
                </tr>
                ${otherMedicationValues.length > 0 ? `
                <tr>
                    <td style="border: 1px solid #000; padding: 8px;">Other Medications</td>
                    <td style="border: 1px solid #000; padding: 8px;">${otherMedicationValues.map(entry => `${entry.value} (${entry.frequency} times/day)`).join(', ')}</td>
                </tr>` : ''}
            </tbody>
        </table>
        <p style="text-align: center; margin-top: 20px;">Please ensure to follow up with your healthcare provider for further evaluation and potential next steps.</p>
        <div style="text-align: center; margin-top: 30px;">
            <button id="printButton" style="padding: 10px 20px; font-size: 16px;">PRINT/SAVE PAGE</button>
        </div>
        `;
    
        const questionsContainer = document.getElementById('questions-container');
        questionsContainer.appendChild(resultScreen);
    
        resultScreen.classList.remove('fade-out');
        resultScreen.classList.add('active');
    
        // Add event listener for print button
        document.getElementById('printButton').addEventListener('click', () => {
            window.print();
        });
    }
    let otherMedicationValues = [];
    let medicationIdCounter = 0;

    function addMedicationEntry() {
        const medicationContainer = document.getElementById('medication-container');
        if (!medicationContainer) {
            console.error("Medication container not found in the DOM.");
            return;
        }
    
        //for some reason the id is changing
        const medicationEntry = document.createElement('div');
        medicationEntry.classList.add('medication-entry');
        medicationEntry.innerHTML = `
            <label for="medication-type">Medication Type:</label>
            <select class="medication-type custom-select">
                <option value="select">Select Medication</option>
                ${questions[10].options.map(option => `<option value="${option}">${option}</option>`).join('')} 
            </select>
    
            <div class="dosage-container">
                <label for="dosage">Dosage:</label>
                <select class="dosage custom-select">
                    <option value="">Select Dosage</option>
                    <!-- Options will be populated based on medication selection -->
                </select>
            </div>
    
            <label for="other-medication" class="other-medication-label" style="display:none;">Name:</label>
            <input type="text" class="other-medication-input" style="display:none;" />
            
            <label for="frequency">Number per 24 hours:</label>
            <select class="frequency custom-select">
                <option value="select">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="na">N/A</option>
                <option value="more">more</option>
            </select>

            <label for="custom-frequency" class="custom-frequency-label" style="display:none;">Custom Frequency:</label>
            <input type="text" class="custom-frequency-input" style="display:none;" />
    
            <button type="button" class="remove-medication-button">Remove</button>
            <br>
        `;
    
        medicationContainer.appendChild(medicationEntry);
    
        const removeButton = medicationEntry.querySelector('.remove-medication-button');
        if (removeButton) {
            removeButton.addEventListener('click', () => {
                medicationEntry.remove();
                //console.log("Remove: ", medicationEntry.id)
                removeOtherMedicationEntry(medicationEntry.id);

                checkDuplicateMedication(); // Update duplicates after removal
            });
        }
    
        const medicationTypeSelect = medicationEntry.querySelector('.medication-type');
        if (medicationTypeSelect) {
            medicationTypeSelect.addEventListener('change', function() {
                updateDosageOptions(this);
                removeOtherMedicationEntry(medicationEntry.id);
                const dosageContainer = medicationEntry.querySelector('.dosage-container');
                const otherMedicationInput = medicationEntry.querySelector('.other-medication-input');
                const otherMedicationLabel = medicationEntry.querySelector('.other-medication-label');
                if (this.value === 'Other') {
                    otherMedicationInput.style.display = 'inline';
                    otherMedicationLabel.style.display = 'inline';
                    otherMedicationInput.focus();
                    dosageContainer.style.display = 'none'; // Hide the dosage container
                } else {
                    otherMedicationInput.style.display = 'none';
                    otherMedicationLabel.style.display = 'none';
                    otherMedicationInput.value = ''; // Clear input when not needed
                    dosageContainer.style.display = 'block'; // Show the dosage container
                }
                checkDuplicateMedication(); // Update duplicates
            });
        }

        const otherMedicationInput = medicationEntry.querySelector('.other-medication-input');
        const frequencySelect = medicationEntry.querySelector('.frequency');
        if (otherMedicationInput) {
            otherMedicationInput.addEventListener('blur', function() {
                removeOtherMedicationEntry(medicationEntry.id);
                const medicationType = medicationEntry.querySelector('.medication-type').value;
                if (medicationType === 'Other') {
                    let frequency;
                    if (frequencySelect.value === 'more') {
                        // Handle custom frequency
                        const customFrequencyInput = medicationEntry.querySelector('.custom-frequency-input');
                        frequency = parseInt(customFrequencyInput.value.trim(), 10);
                    } else {
                        // Handle predefined frequency
                        frequency = parseInt(frequencySelect.value, 10);
                    }
                    const value = this.value.trim();
                    medicationEntry.id = `medication-entry-${value}-${medicationIdCounter++}`;
                    updateOtherMedicationEntry(medicationEntry.id, value, frequency);
                    checkDuplicateMedication(); // Check for duplicates
                }
            });
        }

        if (frequencySelect) {
            frequencySelect.addEventListener('change', function() {
                const customFrequencyInput = medicationEntry.querySelector('.custom-frequency-input');
                const customFrequencyLabel = medicationEntry.querySelector('.custom-frequency-label');
                if (this.value === 'more') {
                    customFrequencyInput.style.display = 'inline';
                    customFrequencyLabel.style.display = 'inline';
                    customFrequencyInput.focus();
                } else {
                    customFrequencyInput.style.display = 'none';
                    customFrequencyLabel.style.display = 'none';
                    customFrequencyInput.value = ''; // Clear input when not needed

                    const nonCustomFrequency = parseInt(this.value, 10);
                    if (!isNaN(nonCustomFrequency)) {
                        // Update the medication entry with the non-custom frequency
                        updateOtherMedicationEntry(medicationEntry.id, otherMedicationInput.value.trim(), nonCustomFrequency);
                    }
                }
                checkDuplicateMedication(); // Update duplicates on frequency change
            });
        }

        const customFrequencyInput = medicationEntry.querySelector('.custom-frequency-input');
        if (customFrequencyInput) {
            customFrequencyInput.addEventListener('change', function() {
                const frequencySelect = medicationEntry.querySelector('.frequency');
                if (frequencySelect.value === 'more') {
                    let frequency;
                    if (frequencySelect.value === 'more') {
                        // Handle custom frequency
                        const customFrequencyInput = medicationEntry.querySelector('.custom-frequency-input');
                        frequency = parseInt(customFrequencyInput.value.trim(), 10);
                    } else {
                        // Handle predefined frequency
                        frequency = parseInt(frequencySelect.value, 10);
                    }
                    if (!isNaN(frequency) && frequency > 10) {
                        if(medicationEntry.id !== '') //make sure to only update 'other' med entries
                        {
                            updateOtherMedicationEntry(medicationEntry.id, otherMedicationInput.value.trim(), frequency);
                        }
                    } else {
                        alert('Please enter a valid number greater than 10.');
                    }
                    console.log("Frequency", frequency);
                }
            });
        }
    }   
    
    function removeOtherMedicationEntry(id)
    {
        const index = otherMedicationValues.findIndex(entry => entry.id === id);
        if (index !== -1)
        {
            console.log("REMOVE");
            otherMedicationValues = otherMedicationValues.filter(entry => entry.id !== id);
            console.log(otherMedicationValues);
        }
        otherMedicationValues = otherMedicationValues.filter(entry => {
            if (entry.id === "") {
                console.log("Removing entry with empty id:", entry);
                return false; // This entry will be removed
            }
            return true; // This entry will be kept
        });
    }

    function updateOtherMedicationEntry(id, value, frequency) {
        console.log(id, value, frequency);
        const index = otherMedicationValues.findIndex(entry => entry.id === id);
        if (index !== -1) {
            // Update existing entry
            otherMedicationValues[index].value = value;
            otherMedicationValues[index].frequency = frequency;
            console.log("Updated entry:", otherMedicationValues[index]);
        } else {
            // Add new entry
            otherMedicationValues.push({ id: id, value: value, frequency: frequency });
            console.log("Added new entry:", { id: id, value: value, frequency: frequency });
            console.log("Frequency: ", frequency)
        }
        console.log(otherMedicationValues);
        checkDuplicateMedication(); // Check for duplicates after update
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
    
    function updateDosageOptions(select) {
        // Find the closest .medication-entry to ensure you are targeting the correct dosage select
        const medicationEntry = select.closest('.medication-entry');
        const dosageSelect = medicationEntry ? medicationEntry.querySelector('.dosage') : null;
        
        if (!dosageSelect) {
            console.error('No element with class "dosage" found.');
            return;
        }
        
        dosageSelect.innerHTML = ''; // Clear existing options
    
        const medication = select.value;
        let dosages = [];
    
        switch (medication) {
            case 'Bromocriptine mesylate (Bromocriptine)':
                dosages = ['2.5-mg tablets', '5-mg capsules'];
                break;
            case 'Entacapone (Comtan)':
                dosages = ['200-mg tablets'];
                break;
            case 'Levodopa and benserazide (Prolopa)':
                dosages = ['50/12.5 mg capsules', '100/25-mg capsules', '200/50-mg capsules'];
                break;
            case 'Levodopa and carbidopa (Sinemet)':
                dosages = ['100/25-mg tablets', '250/25-mg tablets'];
                break;
            case 'Levodopa and carbidopa (Sinemet CR)':
                dosages = ['100/25-mg controlled release tablets', '250/25-mg controlled release tablets'];
                break;
            case 'Levodopa, carbidopa and entacapone (Stalevo)':
                dosages = [
                    '50/12.5/200-mg tablets', '75/18.75/200-mg tablets', '100/25/200-mg tablets',
                    '125/31.25/200-mg tablets', '150/37.5/200-mg tablets'
                ];
                break;
            case 'pdp-amantadine hydrochloride':
                dosages = ['100-mg capsules'];
                break;
            case 'Pramipexole dihydrochloride monohydrate (Mirapex)':
                dosages = ['0.125-mg tablets', '0.25-mg tablets'];
                break;
            case 'Rasagiline (Azilect)':
                dosages = ['0.5-mg tablets', '1-mg tablets'];
                break;
            case 'Ropinirole hydrochloride (Requip)':
                dosages = ['0.25-mg tablets', '1-mg tablets', '2-mg tablets', '5-mg tablets'];
                break;
            case 'Safinamide tablets (Onstryv)':
                dosages = ['50-mg tablets', '100-mg tablets'];
                break;
            case 'Selegiline hydrochloride (Mylan-Selegiline)':
                dosages = ['5-mg tablets'];
                break;
            case 'Other':
                dosages = [];
                break;
            default:
                dosages = [];
        }
    
        dosages.forEach(dosage => {
            const option = document.createElement('option');
            option.value = dosage;
            option.textContent = dosage;
            dosageSelect.appendChild(option);
        });
    }

    function calculateLED() {
        const conversionFactors = {
            "Benztropine mesylate (pdp-Benztropine)": { 
                "1-mg tablets": { "levodopa_dose": 0, "conversion_factor": 1 } 
            },
            "Bromocriptine mesylate (Bromocriptine)": { 
                "2.5-mg tablets": { "levodopa_dose": 2.5, "conversion_factor": 10 }, 
                "5-mg capsules": { "levodopa_dose": 5, "conversion_factor": 10 } 
            },
            "Entacapone (Comtan)": { 
                "200-mg tablets": { "levodopa_dose": 0, "conversion_factor": 0 } 
            },
            "Enthopropazine (Pasitan 50)": { 
                "50-mg tablets": { "levodopa_dose": 0, "conversion_factor": 1 } 
            },
            "Levodopa and benserazide (Prolopa)": { 
                "50/12.5 mg capsules": { "real_levodopa_dose": 50, "levodopa_dose": 50, "conversion_factor": 1 }, 
                "100/25-mg capsules": { "real_levodopa_dose": 100, "levodopa_dose": 100, "conversion_factor": 1 }, 
                "200/50-mg capsules": { "real_levodopa_dose": 200, "levodopa_dose": 200, "conversion_factor": 1 } 
            },
            "Levodopa and carbidopa (Sinemet)": { 
                "100/25-mg tablets": { "real_levodopa_dose": 100, "levodopa_dose": 100, "conversion_factor": 1 },
                "250/25-mg tablets": { "real_levodopa_dose": 250, "levodopa_dose": 250, "conversion_factor": 1 } 
            },
            "Levodopa and carbidopa (Sinemet CR)": { 
                "100/25-mg controlled release tablets": { "real_levodopa_dose": 100, "levodopa_dose": 100, "conversion_factor": 0.75 },
                "250/25-mg controlled release tablets": { "real_levodopa_dose": 250, "levodopa_dose": 250, "conversion_factor": 0.75 } 
            },
            //Stalevo does not need real_levodopa_doses bc this metric is only used for entacapone calculations :)
            "Levodopa, carbidopa and entacapone (Stalevo)": {
                "50/12.5/200-mg tablets": { "levodopa_dose": 50, "conversion_factor": 1.33 },
                "75/18.75/200-mg tablets": { "levodopa_dose": 75, "conversion_factor": 1.33 },
                "100/25/200-mg tablets": { "levodopa_dose": 100, "conversion_factor": 1.33 },
                "125/31.25/200-mg tablets": { "levodopa_dose": 125, "conversion_factor": 1.33 },
                "150/37.5/200-mg tablets": { "levodopa_dose": 150, "conversion_factor": 1.33 }
            },
            "pdp-amantadine hydrochloride": { 
                "100-mg capsules": { "levodopa_dose": 100, "conversion_factor": 1 } 
            },
            "Pramipexole dihydrochloride monohydrate (Mirapex)": { 
                "0.125-mg tablets": { "levodopa_dose": 0.125, "conversion_factor": 100 }, 
                "0.25-mg tablets": { "levodopa_dose": 0.25, "conversion_factor": 100 } 
            },
            "Rasagiline (Azilect)": { 
                "0.5-mg tablets": { "levodopa_dose": 0.5, "conversion_factor": 100 },
                "1-mg tablets": { "levodopa_dose": 1, "conversion_factor": 100 } 
            },
            "Ropinirole hydrochloride (Requip)": { 
                "0.25-mg tablets": { "levodopa_dose": 0.25, "conversion_factor": 20 }, 
                "1-mg tablets": { "levodopa_dose": 1, "conversion_factor": 20 }, 
                "2-mg tablets": { "levodopa_dose": 2, "conversion_factor": 20 }, 
                "5-mg tablets": { "levodopa_dose": 5, "conversion_factor": 20 } 
            },
            //Safinamide is always a constant 100-mg, ignoring 50 or 100-mg
            "Safinamide tablets (Onstryv)": { 
                "50-mg tablets": { "levodopa_dose": 100, "conversion_factor": 1 }, 
                "100-mg tablets": { "levodopa_dose": 100, "conversion_factor": 1 } 
            },
            "Selegiline hydrochloride (Mylan-Selegiline)": { 
                "5-mg tablets": { "levodopa_dose": 5, "conversion_factor": 10 } 
            }
        };        
        let totalLED = 0;
        let totalRealLevodopa = 0;
        let offset = 0; // this is considering what is missing by the entacapone calculation
        const medicationData = responses[10] || []; // Use the data collected from the form for question 10

        let foundEntacapone = medicationData.some(medication => medication.type === "Entacapone (Comtan)");
        medicationData.forEach(medication => {
            const type = medication.type;

            if (type !== 'Other')
            {
                let frequency = medication.frequency;
                const dosage = medication.dosage;
                const medicationInfo = conversionFactors[type];
                
                const { real_levodopa_dose, levodopa_dose, conversion_factor } = medicationInfo[dosage];
    
                if (frequency == 'na')
                {
                    frequency = 0;
                }
    
                if (foundEntacapone) {
                    if (medicationInfo && medicationInfo[dosage]) {
        
                        // Accumulate total real levodopa dose if it exists
                        if (real_levodopa_dose !== undefined) {
                            totalRealLevodopa += real_levodopa_dose * frequency;
                        } else
                        {
                            offset += levodopa_dose * conversion_factor * frequency;
                        }
                    }
                    totalLED = totalRealLevodopa * 0.33;
                    totalLED += offset;
                }else{
                    totalLED += levodopa_dose * conversion_factor * frequency;
                } 
                
            }

        });

        return totalLED;

    }
    
    initializeForm();
});