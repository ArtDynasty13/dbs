let currentQuestionIndex = 0;
const questions = document.querySelectorAll('.question');
const progress = document.querySelector('.progress-bar');
const animationDuration = 1000; // Duration of the animation in milliseconds

function showQuestion(index) {
    // Ensure index is within valid range
    if (index >= 0 && index < questions.length) {
        questions.forEach((question, i) => {
            if (i === index) {
                question.classList.remove('fade-out');
                question.classList.add('active');
            } else {
                question.classList.remove('active');
                question.classList.add('fade-out');
            }
        });

        // Toggle back button visibility
        const backButton = questions[index].querySelector('.back-button');
        if (backButton) {
            backButton.style.display = index === 0 ? 'none' : 'inline-block';
        } else {
            console.error(`Back button not found for question ${index}`);
        }

        // Update progress bar
        const progressPercent = ((index + 1) / questions.length) * 100;
        progress.style.width = `${progressPercent}%`;

        currentQuestionIndex = index; // Update current question index
    } else {
        console.error(`Invalid index ${index} for questions array`);
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        const currentQuestion = questions[currentQuestionIndex];
        currentQuestion.classList.add('fade-out');
        
        setTimeout(() => {
            currentQuestion.style.display = 'none';
            currentQuestionIndex++;

            const previousQuestion = questions[currentQuestionIndex];
            previousQuestion.style.display = 'block'; // Ensure the previous question is displayed
            previousQuestion.classList.remove('fade-out');

            showQuestion(currentQuestionIndex);
        }, animationDuration);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        const currentQuestion = questions[currentQuestionIndex];
        currentQuestion.classList.add('fade-out');

        setTimeout(() => {
            currentQuestion.style.display = 'none';
            currentQuestionIndex--;

            const previousQuestion = questions[currentQuestionIndex];
            previousQuestion.style.display = 'block'; // Ensure the previous question is displayed
            previousQuestion.classList.remove('fade-out');

            showQuestion(currentQuestionIndex);
        }, animationDuration);
    }
}


// Show the first question initially
showQuestion(currentQuestionIndex);
