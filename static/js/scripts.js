document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    let points = 0;
    const progress = document.querySelector('.progress-bar');
    const animationDuration = 1000; // Duration of the animation in milliseconds

    // Define your questions data
    const questions = [
        {
            id: 1,
            question: "1. How many doses of levodopa are you taking?",
            options: ["3 doses or less", "4 doses", "5 doses or greater"],
            multiple: false
        },
        {
            id: 2,
            question: "2. How long have you been diagnosed with Parkinson's?",
            options: ["less than 1 year", "1-3 years", "more than 3 years"],
            multiple: false,
            disqualifyingOptions: ["less than 1 year"]
        },
        {
            id: 3,
            question: "3. Do you have dementia, psychosis or untreated depression?",
            options: ["Yes", "No"],
            multiple: false,
            disqualifyingOptions: ["Yes"]
        },
        {
            id: 4,
            question: "4. Do you have tremors and dyskinesias (involuntary movements of the face, arms, legs or trunk) that limit activities in your daily life?",
            options: ["Yes", "No"],
            multiple: false,
            points: { "Yes": 1, "No": 0 }
        },
        {
            id: 5,
            question: "5. Do you sometimes experience severe motor fluctuations (sudden and unpredictable recurrence of symptoms)?",
            options: ["Yes", "No"],
            multiple: false,
            points: { "Yes": 1, "No": 0 }
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

    // Function to create a question element
    function createQuestionElement(questionData) {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.id = `question-${questionData.id}`;

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
            <h3>${questionData.question}</h3>
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

        if (questionData.points) {
            points += questionData.points[selectedOption.value];
        }

        if (questionData.disqualifyingOptions && questionData.disqualifyingOptions.includes(selectedOption.value)) {
            document.getElementById('disqualification-screen').style.display = 'block';
            document.querySelectorAll('.question').forEach(questionElement => {
                if (questionElement.id !== 'disqualification-screen') {
                    questionElement.style.display = 'none';
                }
            });
            return;
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

    // Function to determine the category based on answers
    function determineCategory() {
        let dosesAnswer;
        const dosesQuestion = questions.find(question => question.id === 1);
        const dosesSelected = document.querySelector(`input[name="question-${dosesQuestion.id}"]:checked`);
        if (dosesSelected) {
            dosesAnswer = dosesSelected.value;
        }

        let category;
        if (dosesAnswer === "3 doses or less") {
            if (points === 0) {
                category = "Cat 1: Patient may be controlled on the current treatment regimen. Continue monitoring the patient based on best medical treatment/clinical guidelines and your professional judgment.";
            } else {
                category = "Cat 2: Patient may not be controlled on the current treatment regimen. Additional benefits may be obtained from further treatment optimization and device-aided therapies may not be needed at this time. However, use your patient’s medical history, treatment preference, and your best medical judgment for treatment recommendation.";
            }
        } else if (dosesAnswer === "4 doses") {
            if (points === 0) {
                category = "Cat 1: Patient may be controlled on the current treatment regimen. Continue monitoring the patient based on best medical treatment/clinical guidelines and your professional judgment.";
            } else {
                category = "Cat 3: Patient may not be controlled on the current treatment regimen and may benefit from device-aided therapy. It is suggested that you evaluate eligibility for device-aided therapy based on patient’s medical history, treatment preference, and your best medical judgment for treatment recommendation.";
            }
        } else if (dosesAnswer === "5 doses or greater") {
            category = "Cat 3: Patient may not be controlled on the current treatment regimen and may benefit from device-aided therapy. It is suggested that you evaluate eligibility for device-aided therapy based on patient’s medical history, treatment preference, and your best medical judgment for treatment recommendation.";
        }

        // Display the category to the user
        const resultContainer = document.createElement('div');
        resultContainer.classList.add('result');
        resultContainer.innerHTML = `<h3>Result</h3><p>${category}</p>`;
        document.getElementById('questions-container').appendChild(resultContainer);

        // Hide all questions
        const questionElements = document.querySelectorAll('.question');
        questionElements.forEach(questionElement => {
            questionElement.classList.add('fade-out');
        });

        // Show result container
        resultContainer.classList.remove('fade-out');
        resultContainer.classList.add('active');
    }

    // Initizalise the form when the DOM content is loaded
    initializeForm();
});
