document.addEventListener('DOMContentLoaded', () => {
  const quizQuestions = [
    {
      id: 1,
      question: "Do you think hours of cardio is beneficial for fat loss?",
      subtitle: "(Many people think doing cardio every day is the answer.)",
      options: [
        { value: "yes", text: "Yes" },
        { value: "no", text: "No" },
        { value: "not-sure", text: "Not Sure" }
      ]
    },
    {
      id: 2,
      question: "If there was a 7-minute routine to get you fit, would you want to add it to your daily routine?",
      subtitle: "(Certain exercise routines can help ignite your metabolism for faster fat burn).",
      options: [
        { value: "definitely", text: "Definitely" },
        { value: "maybe", text: "Maybe" },
        { value: "not-sure", text: "Not Sure" }
      ]
    }
  ];



  const homeScreen = document.getElementById('home-screen');
  const quizContainer = document.getElementById('quiz-container');
  const loadingScreen = document.getElementById('loading-screen');
  const resultsScreen = document.getElementById('results-screen');
  const genderButtons = document.querySelectorAll('.gender-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const questionCounter = document.querySelector('.question-counter');
  const progressBar = document.getElementById('quiz-progress');
  const progressPercentage = document.querySelector('#progress-percentage #progressPercentage');
  const watchBtn = document.getElementById('watch-btn');
  const quizQuestionsContainer = document.getElementById('quiz-questions');

  let currentQuestion = 1;
  const totalQuestions = quizQuestions.length;
  let answers = {};
  let selectedGender = null;

  function generateQuizQuestions() {
    quizQuestionsContainer.innerHTML = '';

    quizQuestions.forEach((q, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = `question ${index === 0 ? 'active' : ''}`;
      questionDiv.dataset.question = q.id;

      let questionHTML = `<h3>${q.question}</h3>`;

      if (q.subtitle) {
        questionHTML += `<p class="question-subtitle">${q.subtitle}</p>`;
      }

      questionHTML += '<div class="options">';

      q.options.forEach(option => {
        questionHTML += `
          <label class="option">
            <input type="radio" name="q${q.id}" value="${option.value}">
            <span class="radio-custom"></span>
            <span class="option-text">${option.text}</span>
          </label>
        `;
      });

      questionHTML += '</div>';

      questionDiv.innerHTML = questionHTML;
      quizQuestionsContainer.appendChild(questionDiv);
    });

    // Add event listeners to all radio inputs
    document.querySelectorAll('.option input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        // Store the answer
        const questionName = radio.name;
        const questionNumber = questionName.substring(1);
        answers[questionNumber] = radio.value;

        // Enable next button when an option is selected
        nextBtn.disabled = false;

        // Add selected class for browsers that don't support :has()
        const optionLabel = radio.closest('.option');
        const allOptions = document.querySelectorAll(`.option input[name="${questionName}"]`);

        allOptions.forEach(input => {
          input.closest('.option').classList.remove('selected');
        });

        optionLabel.classList.add('selected');
      });
    });
  }

  generateQuizQuestions();
  updateProgressBar();
  updateQuestionCounter();

  genderButtons.forEach(button => {
    button.addEventListener('click', () => {
      selectedGender = button.dataset.gender;
      switchScreen(homeScreen, quizContainer);
    });
  });

  prevBtn.addEventListener('click', goToPreviousQuestion);
  nextBtn.addEventListener('click', goToNextQuestion);

  watchBtn.addEventListener('click', () => {
    window.open('https://www.linkedin.com/in/refayet-siddique/', '_blank');
  });

  function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    toScreen.classList.add('active');
    window.scrollTo(0, 0);
  }

  function goToNextQuestion() {
    const currentRadioName = `q${currentQuestion}`;
    const isOptionSelected = document.querySelector(`input[name="${currentRadioName}"]:checked`);

    if (!isOptionSelected) {
      alert('Please select an option to continue.');
      return;
    }

    document.querySelector(`.question[data-question="${currentQuestion}"]`).classList.remove('active');

    if (currentQuestion < totalQuestions) {
      currentQuestion++;
      document.querySelector(`.question[data-question="${currentQuestion}"]`).classList.add('active');
      updateQuestionCounter();
      updateProgressBar();
      updateNavButtons();

      const nextQuestionRadioName = `q${currentQuestion}`;
      const isNextOptionSelected = document.querySelector(`input[name="${nextQuestionRadioName}"]:checked`);
      nextBtn.disabled = !isNextOptionSelected;
    } else {
      switchScreen(quizContainer, loadingScreen);
      simulateLoading();
    }
  }

  function goToPreviousQuestion() {
    if (currentQuestion > 1) {
      document.querySelector(`.question[data-question="${currentQuestion}"]`).classList.remove('active');

      currentQuestion--;
      document.querySelector(`.question[data-question="${currentQuestion}"]`).classList.add('active');

      updateQuestionCounter();
      updateProgressBar();
      updateNavButtons();

      nextBtn.disabled = false;
    }
  }

  function updateQuestionCounter() {
    questionCounter.textContent = `${currentQuestion}/${totalQuestions}`;
  }

  function updateProgressBar() {
    const progress = (currentQuestion / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function updateNavButtons() {
    prevBtn.disabled = currentQuestion === 1;
  }
  function setProgress(percent) {
    const rotation = (percent / 100) * 360;
    console.log(rotation);
    document.getElementById('progressWrapper').style.transform = `rotate(${rotation}deg)`;
  }

  function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setProgress(progress);
      progressPercentage.textContent = `${progress}`;
      document.querySelector('.progress-circle').style.setProperty('--progress', `${progress}%`);

      if (progress >= 100) {
        clearInterval(interval);
        // Wait 1 second after reaching 100%
        setTimeout(() => {
          switchScreen(loadingScreen, resultsScreen);
        }, 1000);
      }
    }, 50);
  }
});