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
            responses[currentQuestionData.id] = [];
            medicationTypes.forEach((type, index) => {
                const typeValue = type.value;
                const dosageValue = dosages[index].value;
                const frequencyValue = frequencies[index].value;
                if (typeValue !== 'select' && frequencyValue !== 'select') {
                    responses[currentQuestionData.id].push({
                        type: typeValue,
                        dosage: dosageValue,
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
    
        // Check if the next question should be skipped
        const nextQuestionData = questions[currentQuestionIndex + 1];
        if (nextQuestionData && nextQuestionData.skipIf) {
            const previousQuestionData = questions.find(question => question.id === nextQuestionData.skipIf.previousQuestionId);
            const previousAnswer = document.querySelector(`input[name="question-${previousQuestionData.id}"]:checked`).value;
            if (previousAnswer === nextQuestionData.skipIf.previousAnswer) {
                currentQuestionIndex++;
            }
        }
    
        if (answered) {
            // Track answered question
            if (!answeredQuestions.includes(currentQuestionIndex)) {
                answeredQuestions.push(currentQuestionIndex);
            }
    
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
            // Remove the current question from answered questions
            answeredQuestions.pop();
            // Get the last answered question index
            const lastAnsweredQuestionIndex = answeredQuestions[answeredQuestions.length - 1];
            // Show the last answered question
            if (lastAnsweredQuestionIndex !== undefined) {
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
             <p>2 hours offtime: ${responses[2]}</p>
             <p>1 hour dyskinesia: ${responses[3]}</p>
             <p>Dystonia: ${responses[4]}</p>
             <p>Tremor dominant: ${responses[5]}</p>
             <p>Gait balancing impairment: ${responses[6]}</p>
             <p>Freezing of gait: ${responses[7]}</p>
             <p>Contra-indications: ${responses[8]}</p>
             <p>LED Score: ${ledResult}</p> <!-- Display the calculated result -->
            <p>Please ensure to follow up with your healthcare provider for further evaluation and potential next steps.</p>
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
                ${questions[10].options.map(option => `<option value="${option}">${option}</option>`).join('')}
            </select>

            <select class="dosage custom-select"> <!-- Add 'custom-select' class -->
                <option value="">Select Dosage</option>
                <!-- Options will be populated based on medication selection -->
            </select>

            <label for="other-medication" class="other-medication-label" style="display:none;">Please specify:</label>
            <input type="text" class="other-medication-input" style="display:none;" />
            
            <label for="frequency">Number per 24 hours:</label>
            <select class="frequency custom-select"> <!-- Add 'custom-select' class -->
                <option value="select">Select Frequency</option>
                <option value="na">N/A</option>
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
                //console.log('Medication type selected:', this.value);
                updateDosageOptions(this);
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
                "200-mg tablets": { "levodopa_dose": 0, "conversion_factor": 0.33 } 
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
        const medicationData = responses[10] || []; // Use the data collected from the form for question 10
    
        medicationData.forEach(medication => {
            const type = medication.type;
            const frequency = medication.frequency;
            const dosage = medication.dosage;
            const medicationInfo = conversionFactors[type];
            
            const { real_levodopa_dose, levodopa_dose, conversion_factor } = medicationInfo[dosage];

            let foundEntacapone = medicationData.some(medication => medication.type === "Entacapone (Comtan)");

            if (foundEntacapone) {
                if (medicationInfo && medicationInfo[dosage]) {
    
                    // Accumulate total real levodopa dose if it exists
                    if (real_levodopa_dose !== undefined) {
                        totalRealLevodopa += real_levodopa_dose * frequency;
                        totalLED -= real_levodopa_dose * frequency;
                    }
                }
                totalLED += totalRealLevodopa * 0.33;
            } 
            
            totalLED += levodopa_dose * conversion_factor * frequency;

        });

        return totalLED;

    }
    
    initializeForm();
});