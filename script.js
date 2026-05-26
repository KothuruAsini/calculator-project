// Calculator state
let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;
let hasError = false;

// Cached DOM elements
const display = document.getElementById('display');
const history = document.getElementById('history');
const buttons = document.querySelector('.buttons');

// Update the calculator screen
function updateDisplay() {
  display.textContent = currentInput;
  history.textContent = previousInput;
}

// Reset everything to the default state
function clearAll() {
  currentInput = '0';
  previousInput = '';
  operator = '';
  shouldResetDisplay = false;
  hasError = false;
  updateDisplay();
}

// Remove the last character from the current input
function deleteLast() {
  if (hasError) {
    clearAll();
    return;
  }

  if (shouldResetDisplay) {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = '0';
  }

  updateDisplay();
}

// Perform the selected math operation
function calculate(firstValue, secondValue, selectedOperator) {
  const firstNumber = parseFloat(firstValue);
  const secondNumber = parseFloat(secondValue);

  if (selectedOperator === '+') {
    return firstNumber + secondNumber;
  } else if (selectedOperator === '-') {
    return firstNumber - secondNumber;
  } else if (selectedOperator === '*') {
    return firstNumber * secondNumber;
  } else if (selectedOperator === '/') {
    if (secondNumber === 0) {
      return 'Error: Division by zero';
    }
    return firstNumber / secondNumber;
  }

  return secondNumber;
}

// Display error state and stop further input until cleared
function showError(message) {
  currentInput = message;
  previousInput = '';
  operator = '';
  shouldResetDisplay = true;
  hasError = true;
  updateDisplay();
}

// Handle number and decimal inputs
function appendValue(value) {
  if (hasError) {
    clearAll();
  }

  if (shouldResetDisplay) {
    currentInput = '0';
    shouldResetDisplay = false;
  }

  if (value === '.') {
    if (currentInput.includes('.')) {
      return;
    }
    currentInput += '.';
    updateDisplay();
    return;
  }

  if (currentInput === '0') {
    currentInput = value;
  } else {
    currentInput += value;
  }

  updateDisplay();
}

// Handle operator input and avoid multiple operators in a row
function handleOperator(nextOperator) {
  if (hasError) {
    return;
  }

  if (currentInput === '0' && previousInput === '') {
    return;
  }

  if (previousInput && operator && !shouldResetDisplay) {
    const result = calculate(previousInput, currentInput, operator);
    if (typeof result === 'string') {
      showError(result);
      return;
    }
    previousInput = String(result);
  } else {
    previousInput = currentInput;
  }

  operator = nextOperator;
  shouldResetDisplay = true;
  history.textContent = `${previousInput} ${operator}`;
}

// Execute the calculation when = is pressed
function handleEquals() {
  if (hasError) {
    return;
  }

  if (!previousInput || !operator) {
    return;
  }

  const result = calculate(previousInput, currentInput, operator);
  if (typeof result === 'string') {
    showError(result);
    return;
  }

  const expression = `${previousInput} ${operator} ${currentInput}`;
  currentInput = String(result);
  previousInput = '';
  operator = '';
  shouldResetDisplay = true;
  display.textContent = currentInput;
  history.textContent = expression;
}

// Prevent duplicate operators by replacing the active operator if needed
function handleButtonClick(button) {
  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === 'clear') {
    clearAll();
  } else if (action === 'delete') {
    deleteLast();
  } else if (action === 'equals') {
    handleEquals();
  } else if (value) {
    if (['+', '-', '*', '/'].includes(value)) {
      handleOperator(value);
    } else {
      appendValue(value);
    }
  }
}

// Button click events
buttons.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) {
    return;
  }
  handleButtonClick(button);
});

// Keyboard support
window.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key >= '0' && key <= '9') {
    appendValue(key);
  } else if (key === '.') {
    appendValue(key);
  } else if (key === '+' || key === '-' || key === '*' || key === '/') {
    handleOperator(key);
  } else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    handleEquals();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key === 'Escape') {
    clearAll();
  }
});

// Initialize the calculator display
updateDisplay();
