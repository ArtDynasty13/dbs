let currentQuestionIndex = 0;
const questions = document.querySelectorAll('.question');
const progress = document.getElementById('progress-bar');
const animationDuration = 1000; // Duration of the animation in milliseconds

function showQuestion(index) {
    questions.forEach((question, i) => {
        if (i === index) {
            question.classList.remove('fade-out');
            question.classList.add('active');
        } else {
            question.classList.remove('active');
            if (i === currentQuestionIndex) {
                question.classList.add('fade-out');
            }
        }
    });

    // Update progress bar
    const progressPercent = ((index + 1) / questions.length) * 100;
    progress.style.width = `${progressPercent}%`;
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        const currentQuestion = questions[currentQuestionIndex];
        currentQuestion.classList.add('fade-out');

        setTimeout(() => {
            currentQuestion.classList.remove('fade-out');
            currentQuestion.style.display = 'none';
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }, animationDuration);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        const currentQuestion = questions[currentQuestionIndex];
        currentQuestion.classList.add('fade-out');

        setTimeout(() => {
            currentQuestion.classList.remove('fade-out');
            currentQuestion.style.display = 'none';
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }, animationDuration);
    }
}

// Show the first question initially
showQuestion(currentQuestionIndex);
