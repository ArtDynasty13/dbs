document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    let points = 0;
    const progress = document.querySelector('.progress-bar');
    const animationDuration = 1000; // Duration of the animation in milliseconds

    // Define your questions data
    const questions = [
        {
            id: 1,
            question: "1. Are you taking 5 doses or greater of levodopa?",
            options: ["Yes", "No"],
            multiple: false,
            disqualifyingOptions: ["No"]
        },
        {
            id: 2,
            question: "2. Are you experiencing a total of greater than 2 hours of daily “off” time (where Parkinson’s symptoms become more noticeable often after an initial benefit from oral treatment)?",
            options: ["Yes", "No"],
            multiple: false,
            disqualifyingOptions: ["No"]
        },
        {
            id: 3,
            question: "3. Are you experiencing unpredictable fluctuations of motor symptoms (a sudden and unpredictable recurrence of symptoms generally unrelated to next dose timing) with your current oral treatment?",
            options: ["Yes", "No"],
            multiple: false,
            disqualifyingOptions: ["No"]
        },
        {
            id: 4,
            question: "4. Are you experiencing troublesome dyskinesia (involuntary body movements that interfere with your daily living activities) due to your current oral treatment?",
            options: ["Yes", "No"],
            multiple: false,
        },
        {
            id: 5,
            question: "Are you presently limited in performing one or more activities of daily living (eg, writing, walking, bathing, dressing, eating, toileting, etc.)?",
            options: ["Yes", "No"],
            multiple: false,
        },
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

    function createQuestionElement(questionData) {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.id = `question-${questionData.id}`;
    
        // Function to wrap text inside brackets with a span for styling
        function formatQuestionText(questionText) {
            // Match text inside both square brackets [] and round brackets ()
            return questionText.replace(/\[(.*?)\]/g, '<span class="bracket-text">[$1]</span>')
                               .replace(/\((.*?)\)/g, '<span class="bracket-text">($1)</span>');
        }
    
        let formattedQuestion = formatQuestionText(questionData.question);
    
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
            <h3>${formattedQuestion}</h3>
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
            customMessage = "Based on your answers, you may not benefit from DBS at this time. Please consult your physician for any further questions. Thank you for taking the time to complete this questionnaire."
            if(`${questionData.id}` == 2){ //for length of diagnosis
                //customMessage = "Based on how long you have had a Parkinson's diagnosis, you may not benefit from DBS at this time. Please consult your physician for any further questions. Thank you for taking the time to complete this questionnaire.";
            }
            if(`${questionData.id}` == 3){ //for cognitive conditions
                //customMessage = "DBS is not recommended because it can potentially worsen these conditions. Please consult your physician for any further questions. Thank you for taking the time to complete this questionnaire.";
            }
            displayCustomResult(customMessage);
            console.log(`${questionData.id}`);
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

    // Function to display custom result
    function displayCustomResult(message) {
        const questionsContainer = document.getElementById('questions-container');
        questionsContainer.innerHTML = `
            <div class="custom-result">
                <h3>${message}</h3>
            </div>
        `;
    }

    // DEPRECIATED - FUNCTIONED FOR POINT SYSTEM 
    function determineCategory() {
        let dosesAnswer;
        const dosesQuestion = questions.find(question => question.id === 1);
        const dosesSelected = document.querySelector(`input[name="question-${dosesQuestion.id}"]:checked`);

        cat_1 = "Based on your answers, you may not benefit from DBS at this time. Please consult your physician for any further questions. Thank you for taking the time to complete this questionnaire.";
        cat_2 = "Based on your answers, you may not benefit from DBS at this time. Please ask your physician about potentially optimizing current treatment. Thank you for taking the time to complete this questionnaire."
        cat_3 = "Based on your answers, you are a candidate for DBS at this time. Please consult a specialist about device-aided therapy. Thank you for taking the time to complete this questionnaire."
        if (dosesSelected) {
            dosesAnswer = dosesSelected.value;
        }

        let category;
        if (dosesAnswer === "3 doses or less") {
            if (points === 0) {
                category = cat_1;
            } else {
                category = cat_2;
            }
        } else if (dosesAnswer === "4 doses") {
            if (points === 0) {
                category = cat_1;
            } else {
                category = cat_3;
            }
        } else if (dosesAnswer === "5 doses or greater") {
            category = cat_3;
        }

        displayCustomResult(category);
    }

    // Initialize the form when the DOM content is loaded
    initializeForm();
});
