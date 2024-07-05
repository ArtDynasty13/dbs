document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    const progress = document.querySelector('.progress-bar');
    const animationDuration = 1000; // Duration of the animation in milliseconds

    // Define your questions data
    const questions = [
        {
            id: 1,
            question: "1. Have you been diagnosed with any of the following?",
            options: ["Parkinson's", "Essential Tremor", "Dystonia", "None"],
            multiple: true,
            disqualifyingOptions: ["None"] // Disqualifying option for this question
        },
        {
            id: 2,
            question: "2. Are you a genius?",
            options: ["yes", "no", "maybe", "so"],
            multiple: false,
            disqualifyingOptions: [] // No disqualifying options for this question
        },
        {
            id: 3,
            question: "3. Which programming languages do you know?",
            options: ["JavaScript", "Python", "Java", "C++"],
            multiple: true,
            disqualifyingOptions: [] // No disqualifying options for this question
        }
        // Add more questions as needed
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
            nextButton.addEventListener('click', nextQuestion);
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

    function nextQuestion() {
        const questionElements = document.querySelectorAll('.question');
        const currentQuestion = questionElements[currentQuestionIndex];
        const disqualificationMessage = document.getElementById('disqualification-message');

        // Check if an option is selected
        const selectedOptions = currentQuestion.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
        const selectedValues = Array.from(selectedOptions).map(option => option.value);

        // Specific check for disqualifying options
        const disqualifyingOptions = questions[currentQuestionIndex].disqualifyingOptions;

        if (selectedValues.length === 0) {
            alert('Please select an answer before proceeding to the next question.');
            return;
        }

        const isDisqualified = selectedValues.some(value => disqualifyingOptions.includes(value));
        if (isDisqualified) {
            disqualificationMessage.innerHTML = 'Based on your answers, you may not qualify for Deep Brain Stimulation.';
            currentQuestion.classList.add('fade-out');
            setTimeout(() => {
                showQuestion(questionElements.length - 1);
            }, animationDuration);
            return;
        }

        if (currentQuestion) {
            currentQuestion.classList.add('fade-out');

            setTimeout(() => {
                if (currentQuestionIndex < questions.length - 1) {
                    currentQuestionIndex++;
                    showQuestion(currentQuestionIndex);
                }
            }, animationDuration);
        } else {
            console.error('Current question element not found.');
        }
    }

    // Move to the previous question
    function previousQuestion() {
        const questionElements = document.querySelectorAll('.question');
        const currentQuestion = questionElements[currentQuestionIndex];
        console.log('Current Question Index:', currentQuestionIndex);
        console.log('Current Question Element:', currentQuestion);

        if (currentQuestion) {
            currentQuestion.classList.add('fade-out');

            setTimeout(() => {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    showQuestion(currentQuestionIndex);
                }
            }, animationDuration);
        } else {
            console.error('Current question element not found.');
        }
    }

    // Initialize the form when the DOM content is loaded
    initializeForm();
});
