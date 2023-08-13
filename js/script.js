class Question {
  constructor(data) {
    this.numb = data.numb;
    this.question = data.question;
    this.answer = data.answer;
    this.options = data.options;
  }
}

class Quiz {
  constructor(questions) {
    const randomQuestions = Math.floor(Math.random() * questions.length);

    this.questions = questions[randomQuestions].map(
      (data) => new Question(data)
    );
    this.currentQuestionIndex = 0;
    this.userScore = 0;
    this.timeValue = 15;
    this.widthValue = 15;
    this.counter = null;
    this.counterLine = null;

    this.startBtn = document.querySelector(".start_btn button");
    this.infoBox = document.querySelector(".info_box");
    this.exitBtn = this.infoBox.querySelector(".buttons .quit");
    this.continueBtn = this.infoBox.querySelector(".buttons .restart");
    this.quizBox = document.querySelector(".quiz_box");
    this.resultBox = document.querySelector(".result_box");
    this.resetQuiz = this.resultBox.querySelector(".buttons .restart");
    this.quitQuiz = this.resultBox.querySelector(".buttons .quit");
    this.optionList = document.querySelector(".option_list");
    this.timeLine = document.querySelector("header .time_line");
    this.timeText = document.querySelector(".timer .time_left_txt");
    this.timeCount = document.querySelector(".timer .timer_sec");
    this.nextBtn = this.quizBox.querySelector(".next_btn");
    this.questionNumber = 1;

    this.startBtn.addEventListener("click", this.handleStartQuiz.bind(this));
    this.exitBtn.addEventListener("click", this.handleExitQuiz.bind(this));
    this.continueBtn.addEventListener("click", this.handleShowQuiz.bind(this));
    this.nextBtn.addEventListener("click", this.handleNextQuestion.bind(this));
    this.quitQuiz.addEventListener("click", () => {
      window.location.reload();
    });
    this.resetQuiz.addEventListener("click", this.handleResetQuiz.bind(this));
  }

  handleStartQuiz() {
    this.infoBox.classList.add("activeInfo");
  }

  handleExitQuiz() {
    this.infoBox.classList.remove("activeInfo");
  }

  handleShowQuiz() {
    this.infoBox.classList.remove("activeInfo");
    this.quizBox.classList.add("activeQuiz");
    this.showCurrentQuestion();
    this.handleQuestionCounter();
    this.startTimer(this.timeValue);
    this.startTimerLine(this.widthValue);
  }

  showCurrentQuestion() {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const questionText = document.querySelector(".que_text");
    const optionList = document.querySelector(".option_list");

    let questionTag = `<span>${currentQuestion.numb}. ${currentQuestion.question}</span>`;
    let optionTag = currentQuestion.options
      .map(
        (option, index) =>
          `<div class="option" data-index="${index}"><span>${option}</span></div>`
      )
      .join("");

    questionText.innerHTML = questionTag;
    optionList.innerHTML = optionTag;

    const options = optionList.querySelectorAll(".option");

    options.forEach((option) => {
      option.addEventListener("click", () => {
        this.handleOptionSelected(option);
      });
    });
  }

  handleOptionSelected(answer) {
    clearInterval(this.counter);
    clearInterval(this.counterLine);
    const userAnswer = answer.textContent;
    const correctAnswer = this.questions[this.currentQuestionIndex].answer;

    if (userAnswer === correctAnswer) {
      this.userScore += 1;
      answer.classList.add("correct");
      answer.insertAdjacentHTML("beforeend", this.getTickIconTag());
    } else {
      answer.classList.add("incorrect");
      answer.insertAdjacentHTML("beforeend", this.getCrossIconTag());
      this.showResultQuestion();
    }

    this.nextBtn.classList.add("show");
  }

  handleNextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.questionNumber++;
      this.showCurrentQuestion();
      this.handleQuestionCounter();
      clearInterval(this.counter);
      this.startTimer(this.timeValue);
      clearInterval(this.counterLine);
      this.startTimerLine(this.widthValue);
      this.timeText.textContent = "Time Left";
      this.nextBtn.classList.remove("show");
    } else {
      clearInterval(this.counter);
      clearInterval(this.counterLine);
      this.showResultBox();
    }
  }

  handleQuestionCounter() {
    const bottomQuestionCounter = this.quizBox.querySelector(".total_que");

    const totalQuestionCountTag = `<span><p>${this.questionNumber}</p> of <p>${this.questions.length}</p> Questions</span>`;
    bottomQuestionCounter.innerHTML = totalQuestionCountTag;
  }

  startTimer(time) {
    const timer = () => {
      this.timeCount.textContent = time < 10 ? `0${time}` : time;
      time--;

      if (time < 0) {
        clearInterval(this.counter);
        this.timeCount.textContent = "00";
        this.timeText.textContent = "Time Off";
        this.showResultQuestion();
      }
    };
    this.counter = setInterval(timer, 1000);
  }

  startTimerLine(time) {
    const startTime = new Date().getTime();
    const widthTimeline = this.quizBox.offsetWidth;
    const timePerPixel = (time * 1000) / widthTimeline;

    const timer = () => {
      const currentTime = new Date().getTime() - startTime;
      const percentage = (currentTime / (time * 1000)) * 100;

      if (percentage <= 100) {
        this.timeLine.style.width = percentage + "%";
      } else {
        clearInterval(this.counterLine);
      }
    };

    this.counterLine = setInterval(timer, timePerPixel);
  }

  showResultQuestion() {
    const correctAnswerIndex = this.questions[this.currentQuestionIndex].answer;
    const options = this.optionList.querySelectorAll(".option");

    options.forEach((option) => {
      if (option.textContent === correctAnswerIndex) {
        option.classList.add("correct");
        option.insertAdjacentHTML("beforeend", this.getTickIconTag());
      }
      option.classList.add("disabled");
    });

    this.nextBtn.classList.add("show");
  }

  showResultBox() {
    this.infoBox.classList.remove("activeInfo");
    this.quizBox.classList.remove("activeQuiz");
    this.resultBox.classList.add("activeResult");

    const scoreText = this.resultBox.querySelector(".score_text");
    let scoreTag = "";

    if (this.userScore > 3) {
      scoreTag = `<span>and congrats! 🎉, You got <p>${this.userScore}</p> out of <p>${this.questions.length}</p></span>`;
    } else if (this.userScore > 1) {
      scoreTag = `<span>and nice 😎, You got <p>${this.userScore}</p> out of <p>${this.questions.length}</p></span>`;
    } else {
      scoreTag = `<span>and sorry 😐, You got only <p>${this.userScore}</p> out of <p>${this.questions.length}</p></span>`;
    }

    scoreText.innerHTML = scoreTag;
  }

  getTickIconTag() {
    return '<div class="icon tick"><i class="fas fa-check"></i></div>';
  }

  getCrossIconTag() {
    return '<div class="icon cross"><i class="fas fa-times"></i></div>';
  }

  handleResetQuiz() {
    this.quizBox.classList.add("activeQuiz");
    this.resultBox.classList.remove("activeResult");
    this.currentQuestionIndex = 0;
    this.userScore = 0;
    this.timeValue = 15;
    this.widthValue = 15;
    this.questionNumber = 1;
    this.showCurrentQuestion();
    this.handleQuestionCounter();
    clearInterval(this.counter);
    this.startTimer(this.timeValue);
    clearInterval(this.counterLine);
    this.startTimerLine(this.widthValue);
  }
}

const quizApp = new Quiz(questions);
