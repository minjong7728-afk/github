const goalInput = document.querySelector("#goal");
const goalType = document.querySelector("#goalType");

const goalMessage = document.querySelector("#goalMessage");
const typeMessage = document.querySelector("#typeMessage");

const startButton = document.querySelector("#startButton");
const confirmButton = document.querySelector("#confirmButton");
const backButton = document.querySelector("#backButton");
const completeButton = document.querySelector("#completeButton");
const restartButton = document.querySelector("#restartButton");

const startStep = document.querySelector("#startStep");
const inputStep = document.querySelector("#inputStep");

const confirmGoal = document.querySelector("#confirmGoal");
const confirmType = document.querySelector("#confirmType");

const completeGoal = document.querySelector("#completeGoal");
const completeType = document.querySelector("#completeType");

const flowNotice = document.querySelector("#flowNotice");

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

let started = false;
let completed = false;

// 탭 열기
function openTab(tabName) {
  tabButtons.forEach(function (button) {
    button.classList.remove("active");

    if (button.dataset.tab === tabName) {
      button.classList.add("active");
    }
  });

  tabContents.forEach(function (content) {
    content.classList.remove("active");
  });

  document.querySelector("#" + tabName).classList.add("active");
}

// 입력값이 모두 정상인지 확인
function isFormValid() {
  const goal = goalInput.value.trim();
  const type = goalType.value;

  return goal !== "" && type !== "";
}

// 입력 상태 검사
function validateForm() {
  const goal = goalInput.value.trim();

  // 목표 입력 확인
  if (goal === "") {
    goalMessage.textContent = "목표를 입력해주세요.";
    goalMessage.className = "error";
  } else {
    goalMessage.textContent = `현재 ${goal.length}자 입력했습니다.`;

    goalMessage.className = "success";
  }

  // 목표 종류 확인
  if (goalType.value === "") {
    typeMessage.textContent = "목표 종류를 선택해주세요.";

    typeMessage.className = "error";
  } else {
    typeMessage.textContent = `${goalType.value} 목표를 선택했습니다.`;

    typeMessage.className = "success";
  }

  // 두 항목이 모두 입력된 경우에만 활성화
  confirmButton.disabled = !isFormValid();
}

// 확인 화면 내용 갱신
function updateConfirm() {
  confirmGoal.textContent = goalInput.value.trim();

  confirmType.textContent = goalType.value;
}

// 1단계 : 시작하기
startButton.addEventListener("click", function () {
  started = true;

  startStep.classList.add("hidden");
  inputStep.classList.remove("hidden");

  flowNotice.textContent = "";

  goalInput.focus();
});

// input 이벤트
goalInput.addEventListener("input", function () {
  validateForm();
});

// change 이벤트
goalType.addEventListener("change", function () {
  validateForm();
});

// 2단계 → 3단계
confirmButton.addEventListener("click", function () {
  if (!isFormValid()) {
    flowNotice.textContent = "목표와 목표 종류를 모두 입력해주세요.";

    flowNotice.className = "error";

    return;
  }

  flowNotice.textContent = "";

  updateConfirm();

  openTab("check");
});

// 이전 단계
backButton.addEventListener("click", function () {
  openTab("write");

  startStep.classList.add("hidden");
  inputStep.classList.remove("hidden");

  flowNotice.textContent = "내용을 수정한 후 다시 확인해주세요.";

  flowNotice.className = "info";
});

// 3단계 → 완료
completeButton.addEventListener("click", function () {
  completed = true;

  completeGoal.textContent = `완료한 목표 : ${goalInput.value.trim()}`;

  completeType.textContent = `목표 종류 : ${goalType.value}`;

  completeMessage.textContent = "오늘의 목표를 완료했습니다!";

  flowNotice.textContent = "";

  openTab("progress");
});

// 다시 시작
restartButton.addEventListener("click", function () {
  // 입력값 초기화
  goalInput.value = "";
  goalType.value = "";

  // 상태 초기화
  started = false;
  completed = false;

  // 오류 / 안내 문구 초기화
  goalMessage.textContent = "목표를 입력해주세요.";

  goalMessage.className = "error";

  typeMessage.textContent = "목표 종류를 선택해주세요.";

  typeMessage.className = "error";

  flowNotice.textContent = "";
  flowNotice.className = "";

  // 버튼 초기화
  confirmButton.disabled = true;

  // 확인 화면 초기화
  confirmGoal.textContent = "";
  confirmType.textContent = "";

  // 완료 화면 초기화
  completeGoal.textContent = "";
  completeType.textContent = "";

  completeMessage.textContent = "오늘의 목표를 완료했습니다.";

  // 처음 화면으로 이동
  startStep.classList.remove("hidden");
  inputStep.classList.add("hidden");

  openTab("write");
});

// 탭 클릭
tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const target = button.dataset.tab;

    // 목표 작성은 언제든 이동 가능
    if (target === "write") {
      openTab("write");
      flowNotice.textContent = "";
      return;
    }

    // 목표 확인
    if (target === "check") {
      if (!started || !isFormValid()) {
        openTab("write");

        if (!started) {
          flowNotice.textContent = "먼저 목표 작성을 시작해주세요.";
        } else {
          flowNotice.textContent = "목표와 목표 종류를 모두 입력해주세요.";
        }

        flowNotice.className = "error";

        return;
      }

      updateConfirm();

      flowNotice.textContent = "";

      openTab("check");
    }

    // 진행 현황
    if (target === "progress") {
      if (!completed) {
        flowNotice.textContent =
          "목표를 완료한 후 진행 현황을 확인할 수 있습니다.";

        flowNotice.className = "error";

        return;
      }

      flowNotice.textContent = "";

      openTab("progress");
    }
  });
});
