const goalInput = document.querySelector("#goal");
const goalButton = document.querySelector("#goalButton");
const goalMessage = document.querySelector("#goalMessage");

const goalType = document.querySelector("#goalType");
const typeMessage = document.querySelector("#typeMessage");

const savedGoal = document.querySelector("#savedGoal");
const savedType = document.querySelector("#savedType");

const progressMessage = document.querySelector("#progressMessage");
const completeButton = document.querySelector("#completeButton");

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

goalInput.addEventListener("input", function () {
  const goal = goalInput.value.trim();

  if (goal === "") {
    goalMessage.textContent = "목표를 입력해주세요.";
    goalMessage.className = "error";

    goalButton.disabled = true;
    goalButton.textContent = "등록하기";
  } else {
    goalMessage.textContent = `현재 ${goal.length}자 입력했습니다.`;
    goalMessage.className = "success";

    goalButton.disabled = false;
    goalButton.textContent = "등록하기";
  }
});

goalType.addEventListener("change", function () {
  if (goalType.value === "") {
    typeMessage.textContent = "목표 종류를 선택해주세요.";
    typeMessage.className = "error";
  } else {
    typeMessage.textContent = `${goalType.value} 목표를 선택했습니다.`;
    typeMessage.className = "success";
  }
});

function registerGoal() {
  const goal = goalInput.value.trim();

  if (goal === "") {
    goalMessage.textContent = "목표를 입력해주세요.";
    goalMessage.className = "error";
    return;
  }

  if (goalType.value === "") {
    typeMessage.textContent = "목표 종류를 먼저 선택해주세요.";
    typeMessage.className = "error";
    return;
  }

  goalMessage.textContent = `"${goal}" 목표가 등록되었습니다.`;
  goalMessage.className = "success";

  savedGoal.textContent = `오늘의 목표 : ${goal}`;
  savedType.textContent = `목표 종류 : ${goalType.value}`;

  progressMessage.textContent =
    "목표가 등록되었습니다. 오늘의 목표를 실천해 보세요.";

  goalButton.textContent = "등록 완료";
  goalButton.disabled = true;
  goalButton.classList.add("completed-button");

  completeButton.disabled = false;
}

goalButton.addEventListener("click", registerGoal);

completeButton.addEventListener("click", function () {
  progressMessage.textContent = "오늘의 목표를 완료했습니다!";
  progressMessage.className = "complete-message";

  completeButton.textContent = "완료됨";
  completeButton.disabled = true;
});

tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    tabButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    tabContents.forEach(function (content) {
      content.classList.remove("active");
    });

    button.classList.add("active");

    const target = button.dataset.tab;

    document.querySelector("#" + target).classList.add("active");
  });
});
