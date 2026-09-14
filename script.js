let currentInput = "0";
let justCalculated = false;
let angleMode = "DEG";

const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");
const modeButton = document.getElementById("mode-btn");


// =========================
// DISPLAY
// =========================

function updateDisplay() {
    currentDisplay.textContent = currentInput || "0";
    previousDisplay.textContent = "";
}


// =========================
// FORMAT RESULT
// =========================

function formatResult(value) {
    if (!Number.isFinite(value)) {
        return "Error";
    }

    return Number(value.toPrecision(12)).toString();
}


// =========================
// ERROR
// =========================

function showError() {
    currentInput = "Error";
    justCalculated = true;
    updateDisplay();
}


// =========================
// CLEAR
// =========================

function clearAll() {
    currentInput = "0";
    justCalculated = false;
    updateDisplay();
}


// =========================
// DELETE
// =========================

function deleteNumber() {

    if (currentInput === "Error" || justCalculated) {
        clearAll();
        return;
    }

    if (currentInput.length <= 1) {
        currentInput = "0";
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}


// =========================
// NUMBER INPUT
// =========================

function inputNumber(number) {

    if (currentInput === "Error" || justCalculated) {
        currentInput = "0";
        justCalculated = false;
    }

    // Decimal validation
    if (number === ".") {

        const parts = currentInput.split(/[+\−×÷^()]/);
        const lastPart = parts[parts.length - 1];

        if (lastPart.includes(".")) {
            return;
        }
    }

    if (currentInput === "0" && number !== ".") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}


// =========================
// OPERATORS
// =========================

function chooseOperator(op) {

    if (currentInput === "Error") {
        return;
    }

    if (justCalculated) {
        justCalculated = false;
    }

    // Parentheses
    if (op === "(" || op === ")") {
        handleParenthesis(op);
        return;
    }

    // Do not allow operator immediately after another operator
    if (
        currentInput.endsWith("+") ||
        currentInput.endsWith("−") ||
        currentInput.endsWith("×") ||
        currentInput.endsWith("÷") ||
        currentInput.endsWith("^")
    ) {
        currentInput = currentInput.slice(0, -1) + op;
    } else {
        currentInput += op;
    }

    updateDisplay();
}


// =========================
// PARENTHESES
// =========================

function handleParenthesis(bracket) {

    if (currentInput === "Error" || justCalculated) {
        currentInput = "0";
        justCalculated = false;
    }

    if (bracket === "(") {

        if (currentInput === "0") {
            currentInput = "(";
        } else {
            const lastChar = currentInput.slice(-1);

            if (
                /[0-9)]/.test(lastChar)
            ) {
                currentInput += "×(";
            } else {
                currentInput += "(";
            }
        }

    } else {

        currentInput += ")";
    }

    updateDisplay();
}


// =========================
// CONVERT EXPRESSION
// =========================

function convertExpression(expression) {

    return expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-")
        .replace(/\^/g, "**")
        .replace(/%/g, "/100");
}


// =========================
// CALCULATE EXPRESSION
// =========================

function evaluateExpression() {

    if (
        currentInput === "" ||
        currentInput === "Error"
    ) {
        return;
    }

    try {

        let expression = convertExpression(currentInput);

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            showError();
            return;
        }

        currentInput = formatResult(result);
        justCalculated = true;

        updateDisplay();

    } catch (error) {

        showError();
    }
}


// =========================
// POWER
// =========================

function calculatePower() {

    if (
        currentInput === "Error" ||
        currentInput === ""
    ) {
        return;
    }

    if (justCalculated) {
        justCalculated = false;
    }

    currentInput += "^";

    updateDisplay();
}


// =========================
// SCIENTIFIC FUNCTIONS
// =========================

function scientificFunction(type) {

    if (currentInput === "Error") {
        return;
    }

    let value = parseFloat(currentInput);

    if (isNaN(value)) {
        showError();
        return;
    }

    let result;


    switch (type) {

        // SIN
        case "sin":

            if (angleMode === "DEG") {
                value = value * Math.PI / 180;
            }

            result = Math.sin(value);
            break;


        // COS
        case "cos":

            if (angleMode === "DEG") {
                value = value * Math.PI / 180;
            }

            result = Math.cos(value);
            break;


        // TAN
        case "tan":

            if (angleMode === "DEG") {
                value = value * Math.PI / 180;
            }

            result = Math.tan(value);

            if (Math.abs(result) < 1e-12) {
                result = 0;
            }

            break;


        // SQUARE ROOT
        case "sqrt":

            if (value < 0) {
                showError();
                return;
            }

            result = Math.sqrt(value);
            break;


        // SQUARE
        case "square":

            result = value * value;
            break;


        // LOG
        case "log":

            if (value <= 0) {
                showError();
                return;
            }

            result = Math.log10(value);
            break;


        // NATURAL LOG
        case "ln":

            if (value <= 0) {
                showError();
                return;
            }

            result = Math.log(value);
            break;


        // PI
        case "pi":

            if (currentInput === "0") {
                result = Math.PI;
            } else {
                currentInput += "×" + Math.PI;
                justCalculated = false;
                updateDisplay();
                return;
            }

            break;


        // E
        case "e":

            if (currentInput === "0") {
                result = Math.E;
            } else {
                currentInput += "×" + Math.E;
                justCalculated = false;
                updateDisplay();
                return;
            }

            break;


        // PERCENT
        case "percent":

            result = value / 100;
            break;


        // FACTORIAL
        case "factorial":

            if (
                value < 0 ||
                !Number.isInteger(value) ||
                value > 170
            ) {
                showError();
                return;
            }

            result = 1;

            for (let i = 2; i <= value; i++) {
                result *= i;
            }

            break;


        default:
            return;
    }


    currentInput = formatResult(result);
    justCalculated = true;

    updateDisplay();
}


// =========================
// DEG / RAD
// =========================

function toggleMode() {

    if (angleMode === "DEG") {
        angleMode = "RAD";
    } else {
        angleMode = "DEG";
    }

    modeButton.textContent = angleMode;
}


// =========================
// BUTTON EVENTS
// =========================

document.querySelectorAll("button").forEach(button => {

    button.addEventListener("click", function () {

        const action = this.dataset.action;
        const number = this.dataset.number;
        const functionName = this.dataset.function;


        // NUMBER
        if (number !== undefined) {
            inputNumber(number);
            return;
        }


        // AC
        if (action === "clear") {
            clearAll();
            return;
        }


        // DEL
        if (action === "delete") {
            deleteNumber();
            return;
        }


        // OPERATOR
        if (action === "operator") {

            const text = this.textContent.trim();

            if (
                text === "+" ||
                text === "−" ||
                text === "×" ||
                text === "÷"
            ) {
                chooseOperator(text);
            }

            else if (
                text === "(" ||
                text === ")"
            ) {
                handleParenthesis(text);
            }

            return;
        }


        // POWER
        if (action === "power") {
            calculatePower();
            return;
        }


        // SCIENTIFIC FUNCTION
        if (action === "function") {
            scientificFunction(functionName);
            return;
        }


        // EQUALS
        if (action === "equals") {
            evaluateExpression();
            return;
        }


        // DEG / RAD
        if (this.id === "mode-btn") {
            toggleMode();
            return;
        }

    });

});


// =========================
// KEYBOARD SUPPORT
// =========================

document.addEventListener("keydown", function (event) {

    const key = event.key;


    // NUMBERS
    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
        return;
    }


    // DECIMAL
    if (key === ".") {
        inputNumber(".");
        return;
    }


    // PLUS
    if (key === "+") {
        chooseOperator("+");
        return;
    }


    // MINUS
    if (key === "-") {
        chooseOperator("−");
        return;
    }


    // MULTIPLICATION
    if (key === "*") {
        chooseOperator("×");
        return;
    }


    // DIVISION
    if (key === "/") {
        event.preventDefault();
        chooseOperator("÷");
        return;
    }


    // POWER
    if (key === "^") {
        calculatePower();
        return;
    }


    // PARENTHESES
    if (key === "(" || key === ")") {
        handleParenthesis(key);
        return;
    }


    // ENTER / EQUALS
    if (
        key === "Enter" ||
        key === "="
    ) {

        event.preventDefault();
        evaluateExpression();
        return;
    }


    // BACKSPACE
    if (key === "Backspace") {
        deleteNumber();
        return;
    }


    // ESCAPE
    if (key === "Escape") {
        clearAll();
        return;
    }

});


// =========================
// START
// =========================

updateDisplay();