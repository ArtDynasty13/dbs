document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    const progress = document.querySelector('.progress-bar');
    const animationDuration = 1000; // Duration of the animation in milliseconds

    // Define your questions data
    const questions = [
        {
            id: 1,
            question: "1. What fraction of a day is 6 hours?",
            options: ["6/24", "6", "1/3", "1/6"]
        },
        {
            id: 2,
            question: "2. Are you a genius?",
            options: ["yes", "no", "maybe", "so"]
        },
        {
            id: 3,
            question: "3. Bornkus?",
            options: ["yes", "no", "maybe", "so"]
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
            optionsHTML += `
                <div class="option-block">
                    <label for="${optionId}" class="option-label">
                        <input type="radio" name="question-${questionData.id}" value="${option}" id="${optionId}" class="option-input" />
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
            <p>Choose 1 answer</p>
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
                } else if (questionElement.classList.contains('active')) {
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
        if (currentQuestionIndex < questions.length - 1) {
            const currentQuestion = document.querySelector(`.question:nth-child(${currentQuestionIndex + 1})`);
            currentQuestion.classList.add('fade-out');

            setTimeout(() => {
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
            }, animationDuration);
        }
    }

    // Move to the previous question
    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            const currentQuestion = document.querySelector(`.question:nth-child(${currentQuestionIndex + 1})`);
            currentQuestion.classList.add('fade-out');

            setTimeout(() => {
                currentQuestionIndex--;
                showQuestion(currentQuestionIndex);
            }, animationDuration);
        }
    }

    // Initialize the form when the DOM content is loaded
    initializeForm();
});
