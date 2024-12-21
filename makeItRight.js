// cSpell:disable

/*
    Vřelé poděkování Claude za zformátování tohoto kódu :)
*/

const GRID_SIZE = 10;
const MOVE_DELAY = 500;

const textarea = document.getElementById("textarea-input");
const button = document.getElementById("button");
const consoleParagraph = document.getElementById("console");
const board = document.getElementById("field");

const Karel = {
    x: 0,
    y: 0,
    direction: "down",
    symbol: "↓",
    directions: {
        right: { next: "up", symbol: "↑" },
        up: { next: "left", symbol: "←" },
        left: { next: "down", symbol: "↓" },
        down: { next: "right", symbol: "→" },
    },
};

function initializeBoard() {
    board.innerHTML = "";
    resetKarel();

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        board.innerHTML += `<span class="border border-white/20 aspect-square"></span>`;
    }

    const startCell = board.children[0];
    startCell.innerHTML = Karel.symbol;
    highlightCell(startCell);
}

function resetKarel() {
    Karel.x = 0;
    Karel.y = 0;
    Karel.direction = "down";
    Karel.symbol = "↓";
}

/**
 * Highlights the current cell Karel is on
 * @param {HTMLElement} cell - The cell to highlight
 */
function highlightCell(cell) {
    cell.style.boxShadow = "inset 0 0 10px 1px oklch(93% 0.2 0)";
}

/**
 * Removes highlight from a cell
 * @param {HTMLElement} cell - The cell to remove highlight from
 */
function unhighlightCell(cell) {
    cell.style.boxShadow = "unset";
}

function rotateKarel() {
    const currentCell = getCurrentCell();
    const content = currentCell.innerHTML.slice(1);
    const nextDirection = Karel.directions[Karel.direction];

    Karel.direction = nextDirection.next;
    Karel.symbol = nextDirection.symbol;
    currentCell.innerHTML = Karel.symbol + content;
}

function moveKarel() {
    const currentCell = getCurrentCell();
    const content = currentCell.innerHTML;

    currentCell.innerHTML = content.length === 1 ? "" : content.slice(1);
    unhighlightCell(currentCell);

    updatePosition();

    const newCell = getCurrentCell();
    const newContent = newCell.innerHTML;
    newCell.innerHTML =
        newContent.length === 0 ? Karel.symbol : Karel.symbol + newContent;
    highlightCell(newCell);
}

function updatePosition() {
    switch (Karel.direction) {
        case "right":
            if (Karel.x < GRID_SIZE - 1) Karel.x++;
            break;
        case "up":
            if (Karel.y > 0) Karel.y--;
            break;
        case "left":
            if (Karel.x > 0) Karel.x--;
            break;
        case "down":
            if (Karel.y < GRID_SIZE - 1) Karel.y++;
            break;
    }
}

/**
 * Gets the current cell Karel is on
 * @returns {HTMLElement} The current cell
 */
function getCurrentCell() {
    return board.children[Karel.x + Karel.y * GRID_SIZE];
}

/**
 * Handles cell styling commands
 * @param {string[]} args - Style arguments
 */
function handleCellStyle(args) {
    const currentCell = getCurrentCell();
    const [type, ...styleArgs] = args;

    if (type.toUpperCase() === "TEXT") {
        const [action, ...params] = styleArgs;
        switch (action.toUpperCase()) {
            case "RESET":
                currentCell.style.color = "#fff";
                currentCell.style.fontWeight = "400";
                break;
            case "BARVA":
                currentCell.style.color = params.join(" ");
                break;
            case "VAHA":
                currentCell.style.fontWeight = params[0];
                break;
        }
    }
}

/**
 * Places items in the current cell
 * @param {string} type - Type of item to place
 * @param {string} value - Value to place
 */
function placeItem(type, value) {
    const currentCell = getCurrentCell();

    switch (type.toUpperCase()) {
        case "TEXT":
            currentCell.innerHTML += value;
            break;
        case "BARVU":
            currentCell.style.backgroundColor = value;
            break;
        case "RESET":
            currentCell.innerHTML = Karel.symbol;
            currentCell.style.backgroundColor = "transparent";
            break;
    }
}

/**
 * Parses and executes a single command
 * @param {string} command - Command to execute
 * @returns {string|null} Error message if command is invalid
 */
function parseCommand(command) {
    const [cmd, ...args] = command.split(" ");

    switch (cmd.toUpperCase()) {
        case "KROK":
            const steps = args.length ? parseInt(args[0]) : 1;
            for (let i = 0; i < steps; i++) moveKarel();
            break;

        case "VLEVOBOK":
            const rotations = args.length ? parseInt(args[0]) : 1;
            for (let i = 0; i < rotations; i++) rotateKarel();
            break;

        case "POLOZ":
            if (args[0]?.toUpperCase() === "RESET") {
                placeItem("RESET");
            } else {
                placeItem(args[0], args[1]);
            }
            break;

        case "RESET":
            initializeBoard();
            break;

        case "STYL":
            handleCellStyle(args);
            break;

        default:
            return `Unknown command: ${command}`;
    }

    return null;
}

/**
 * Executes a list of commands sequentially
 * @param {string[]} commands - Array of commands to execute
 * @param {number} index - Current command index
 */
function executeCommands(commands, index = 0) {
    if (index >= commands.length) return;

    const error = parseCommand(commands[index]);
    if (error) {
        consoleParagraph.innerHTML += `<p>${error}</p>`;
    }

    setTimeout(() => {
        executeCommands(commands, index + 1);
    }, MOVE_DELAY);
}

initializeBoard();

button.addEventListener("click", () => {
    consoleParagraph.innerHTML = "";
    const commands = textarea.value.split("\n");
    executeCommands(commands);
});
