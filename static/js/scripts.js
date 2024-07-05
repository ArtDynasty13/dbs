document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    const progress = document.querySelector('.progress-bar');
    const animationDuration = 1000; // Duration of the animation in milliseconds

    // Define your questions data
    const questions = [
        {
            id: 1,
            question: "1. Have you been diagnosed with any of the following?",
            options: ["Parkinson's", "Essential Tremor", "Dystonia"],
            multiple: true
        },
        {
            id: 2,
            question: "2. Are you a genius?",
            options: ["yes", "no", "maybe", "so"],
            multiple: false
        },
        {
            id: 3,
            question: "3. Which programming languages do you know?",
            options: ["JavaScript", "Python", "Java", "C++"],
            multiple: true
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
            backButton.style.display = index === 0 ? 'none' : 'inline-block';

            // Update progress bar
            const progressPercent = ((index + 1) / questions.length) * 100;
            progress.style.width = `${progressPercent}%`;

            currentQuestionIndex = index;
        } else {
            console.error(`Invalid index ${index} for questions array.`);
        }
    }

    // Move to the next question
    function nextQuestion() {
        const questionElements = document.querySelectorAll('.question');
        const currentQuestion = questionElements[currentQuestionIndex];
        console.log('Current Question Index:', currentQuestionIndex);
        console.log('Current Question Element:', currentQuestion);

        // Check if an option is selected
        const selectedOptions = currentQuestion.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
        if (selectedOptions.length === 0) {
            alert('Please select an answer before proceeding to the next question.');
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
