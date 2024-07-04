let currentQuestionIndex = 0;
const questions = document.querySelectorAll('.question');
const progressBar = document.getElementById('progress-bar');
const navButtonsContainer = document.getElementById('nav-buttons');

// Initialize the quiz
function initQuiz() {
    questions.forEach((question, index) => {
        const navButton = document.createElement('button');
        navButton.classList.add('nav-button');
        navButton.textContent = `Q${index + 1}`;
        navButton.onclick = () => goToQuestion(index);
        navButtonsContainer.appendChild(navButton);
    });
    updateProgress();
    showQuestion(currentQuestionIndex);
}

// Show a specific question
function showQuestion(index) {
    questions.forEach((question, idx) => {
        question.style.display = idx === index ? 'block' : 'none';
    });
    updateProgress();
}

// Go to the next question
function nextQuestion() {
    fadeOutQuestion(currentQuestionIndex, () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }
    });
}

// Go to a specific question
function goToQuestion(index) {
    if (index < questions.length && index >= 0) {
        fadeOutQuestion(currentQuestionIndex, () => {
            currentQuestionIndex = index;
            showQuestion(currentQuestionIndex);
        });
    }
}

// Update the progress bar and navigation buttons
function updateProgress() {
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    const navButtons = navButtonsContainer.getElementsByClassName('nav-button');
    for (let i = 0; i < navButtons.length; i++) {
        if (i <= currentQuestionIndex) {
            navButtons[i].classList.remove('disabled');
        } else {
            navButtons[i].classList.add('disabled');
        }
    }
}

// Fade out animation
function fadeOutQuestion(index, callback) {
    const question = questions[index];
    question.classList.add('fade-out');
    setTimeout(() => {
        question.classList.remove('fade-out');
        callback();
    }, 500); // Adjust the timeout to match the CSS animation duration
}

// Initialize the quiz on page load
document.addEventListener('DOMContentLoaded', initQuiz);
