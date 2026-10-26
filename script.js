const goalInput = document.querySelector("#goal");
const goalType = document.querySelector("#goalType");
const goalForm = document.querySelector("#goalForm");
const useTime = document.querySelector("#useTime");
const goalTime = document.querySelector("#goalTime");
const timeArea = document.querySelector("#timeArea");
const timeMessage = document.querySelector("#timeMessage");
const submitMessage = document.querySelector("#submitMessage");
const confirmTime = document.querySelector("#confirmTime");
const completeTime = document.querySelector("#completeTime");

const goalMessage = document.querySelector("#goalMessage");
const typeMessage = document.querySelector("#typeMessage");

const startButton = document.querySelector("#startButton");
const confirmButton = document.querySelector("#confirmButton");
const backButton = document.querySelector("#backButton");
const completeButton = document.querySelector("#completeButton");
const restartButton = document.querySelector("#restartButton");
const saveButton = document.querySelector("#saveButton");
const saveMessage = document.querySelector("#saveMessage");
const historyMessage = document.querySelector("#historyMessage");
const historyList = document.querySelector("#historyList");

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
let saved = false;
let history = [];

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

  return goal.length >= 3 && type !== "" && (!useTime.checked || goalTime.value !== "");
}

// 입력 상태 검사
function validateForm() {
  const goal = goalInput.value.trim();

  // 목표 입력 확인
  if (goal.length < 3) {
    goalMessage.textContent = goal.length === 0 ? "목표를 입력해주세요." : "목표는 3자 이상 입력해주세요. 현재 " + goal.length + "자입니다.";
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

  if (useTime.checked && goalTime.value === "") {
    timeMessage.textContent = "목표 시간을 선택해주세요. 또는 체크를 해제해주세요.";
  } else {
    timeMessage.textContent = "";
  }
  submitMessage.textContent = "";
}

// 확인 화면 내용 갱신
function updateConfirm() {
  confirmGoal.textContent = goalInput.value.trim();

  confirmType.textContent = goalType.value;
  confirmTime.textContent = useTime.checked ? "목표 시간 : " + goalTime.value : "목표 시간 : 설정 안 함";
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

// 목표 시간 선택
useTime.addEventListener("change", function () {
  timeArea.classList.toggle("hidden", !useTime.checked);
  goalTime.disabled = !useTime.checked;
  if (!useTime.checked) goalTime.value = "";
  validateForm();
});
goalTime.addEventListener("change", validateForm);

// 목표 작성 폼 제출
let submitting = false;
goalForm.addEventListener("submit", function (event) {
  event.preventDefault();
  validateForm();
  if (submitting) return;
  if (!isFormValid()) {
    submitMessage.textContent = "입력 내용을 확인해주세요. 목표는 3자 이상, 종류는 필수이며 시간 선택 시 시간도 입력해야 합니다.";
    submitMessage.className = "error";
    return;
  }
  submitting = true;
  confirmButton.disabled = true;
  submitMessage.textContent = "목표를 등록하는 중입니다...";
  submitMessage.className = "info";

  // 브라우저 저장 공간 사용이 막히면 입력값을 유지하고 재시도 안내
  try {
    sessionStorage.setItem("haruGoalDraft", JSON.stringify({
      goal: goalInput.value.trim(), type: goalType.value,
      time: useTime.checked ? goalTime.value : ""
    }));
    updateConfirm();
    flowNotice.textContent = "";
    submitMessage.textContent = "목표가 등록되었습니다.";
    openTab("check");
  } catch (error) {
    submitMessage.textContent = "등록에 실패했습니다. 브라우저 저장 기능을 확인하고 다시 시도해주세요. 입력한 내용은 유지됩니다.";
    submitMessage.className = "error";
  } finally {
    submitting = false;
    confirmButton.disabled = false;
  }
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
  saved = false;
  saveButton.disabled = false;
  saveMessage.textContent = "";

  completeGoal.textContent = `완료한 목표 : ${goalInput.value.trim()}`;

  completeType.textContent = `목표 종류 : ${goalType.value}`;
  completeTime.textContent = confirmTime.textContent;

  completeMessage.textContent = "오늘의 목표를 완료했습니다!";

  flowNotice.textContent = "";

  openTab("progress");
});

// 저장한 목표 목록 표시
function showHistory() {
  historyList.textContent = "";

  if (history.length === 0) {
    historyMessage.textContent = "아직 저장한 목표가 없습니다. 목표를 완료한 후 저장해보세요.";
    return;
  }

  historyMessage.textContent = `저장한 목표 ${history.length}개`;

  history.forEach(function (item) {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";

    const historyText = document.createElement("p");
    historyText.textContent = `${item.goal} (${item.type})` + (item.time ? " / " + item.time : "");

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";

    deleteButton.addEventListener("click", function () {
      history = history.filter(function (savedItem) {
        return savedItem.id !== item.id;
      });

      showHistory();
      historyMessage.textContent = "목표를 삭제했습니다. 남은 목표: " + history.length + "개";
    });

    historyItem.appendChild(historyText);
    historyItem.appendChild(deleteButton);
    historyList.appendChild(historyItem);
  });
}

// 완료한 목표 저장하기
saveButton.addEventListener("click", function () {
  if (!completed) {
    saveMessage.textContent = "먼저 목표를 완료해주세요.";
    return;
  }

  if (saved) {
    saveMessage.textContent = "이미 저장한 목표입니다. 나의 목표 기록에서 확인해주세요.";
    return;
  }

  history.push({
    id: Date.now(),
    goal: goalInput.value.trim(),
    type: goalType.value,
    time: useTime.checked ? goalTime.value : "",
  });

  saved = true;
  saveButton.disabled = true;
  saveMessage.textContent = "목표를 저장했습니다. 아래 나의 목표 기록에서 확인할 수 있습니다.";
  showHistory();
});

// 다시 시작
restartButton.addEventListener("click", function () {
  // 입력값 초기화
  goalInput.value = "";
  goalType.value = "";
  useTime.checked = false;
  goalTime.value = "";
  goalTime.disabled = true;
  timeArea.classList.add("hidden");
  timeMessage.textContent = "";
  submitMessage.textContent = "";
  submitMessage.className = "info";
  try { sessionStorage.removeItem("haruGoalDraft"); } catch (error) {}

  // 상태 초기화
  started = false;
  completed = false;
  saved = false;
  saveButton.disabled = false;
  saveMessage.textContent = "";

  // 오류 / 안내 문구 초기화
  goalMessage.textContent = "목표를 입력해주세요.";

  goalMessage.className = "error";

  typeMessage.textContent = "목표 종류를 선택해주세요.";

  typeMessage.className = "error";

  flowNotice.textContent = "";
  flowNotice.className = "";

  // 버튼 초기화
  confirmButton.disabled = false;

  // 확인 화면 초기화
  confirmGoal.textContent = "";
  confirmType.textContent = "";

  // 완료 화면 초기화
  completeGoal.textContent = "";
  completeType.textContent = "";
  completeTime.textContent = "";
  confirmTime.textContent = "";

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
      if (!started || !completed && !isFormValid()) {
        openTab("write");

        if (!started) {
          flowNotice.textContent = "먼저 목표 작성을 시작해주세요.";
        } else {
          flowNotice.textContent = "목표와 목표 종류를 모두 입력해주세요.";
        }

        flowNotice.className = "error";

        return;
      }

      if (!completed) updateConfirm();

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

// 처음 목록 표시
showHistory();
