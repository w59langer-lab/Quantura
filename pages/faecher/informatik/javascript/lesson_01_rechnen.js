// Einfache Rechenlogik für Lesson 01 / Простая логика калькулятора / Simple calculator logic
const inputA = document.querySelector("#zahl-a");
const inputB = document.querySelector("#zahl-b");
const resultBox = document.querySelector("#ergebnis");
const buttons = document.querySelectorAll("button[data-op]");

// Liest Eingaben und berechnet / Читает ввод и считает / Reads inputs and calculates
function calculate(op) {
  const a = parseFloat(inputA.value);
  const b = parseFloat(inputB.value);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    resultBox.textContent = "Bitte beide Zahlen ausfüllen.";
    return;
  }

  let result;
  switch (op) {
    case "add":
      result = a + b;
      break;
    case "sub":
      result = a - b;
      break;
    case "mul":
      result = a * b;
      break;
    case "div":
      if (b === 0) {
        resultBox.textContent = "Division durch 0 nicht erlaubt.";
        return;
      }
      result = a / b;
      break;
    default:
      resultBox.textContent = "Unbekannter Operator.";
      return;
  }

  // Zeigt Ergebnis / Показывает результат / Displays the result
  resultBox.textContent = `Ergebnis: ${result}`;
}

// Verknüpft Buttons / Связывает кнопки / Wires up buttons
buttons.forEach((btn) => {
  btn.addEventListener("click", () => calculate(btn.dataset.op));
});
