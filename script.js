const goalInput = document.querySelector("#goal");
const goalButton = document.querySelector("#goalButton");
const goalMessage = document.querySelector("#goalMessage");

function registerGoal() {
  const goal = goalInput.value.trim();

  if (goal === "") {
    goalMessage.textContent = "목표를 입력해주세요.";
    goalMessage.className = "error";
    return;
  }

  goalMessage.textContent = `"${goal}" 목표가 등록되었습니다.`;
  goalMessage.className = "success";

  goalButton.textContent = "등록 완료";
  goalButton.disabled = true;
}

goalButton.addEventListener("click", registerGoal);
