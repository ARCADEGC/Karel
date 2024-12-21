// cSpell:disable

let input = "";
const textarea = document.getElementById("textarea-input");
const button = document.getElementById("button");
const consoleParagraph = document.getElementById("console");
const board = document.getElementById("field");

let Karel = {
    x: 0,
    y: 0,
    direction: "down",
    symbol: "↓",
};

let field = [];

function setBoard() {
    board.innerHTML = "";

    Karel.x = 0;
    Karel.y = 0;
    Karel.direction = "down";
    Karel.symbol = "↓";

    for (let i = 0; i < 100; i++) {
        board.innerHTML += `<span class="border border-white/20 aspect-square"></span>`;
    }

    board.children[0].innerHTML = Karel.symbol;

    board.children[Karel.x + Karel.y * 10].style.boxShadow =
        "inset 0 0 10px 1px oklch(93% 0.2 0)";
}

function changeDirection() {
    const content = board.children[Karel.x + Karel.y * 10].innerHTML.slice(1);
    if (Karel.direction === "right") {
        Karel.direction = "up";
        Karel.symbol = "↑";
        board.children[Karel.y * 10 + Karel.x].innerHTML = "↑" + content;
    } else if (Karel.direction === "up") {
        Karel.direction = "left";
        Karel.symbol = "←";
        board.children[Karel.y * 10 + Karel.x].innerHTML = "←" + content;
    } else if (Karel.direction === "left") {
        Karel.direction = "down";
        Karel.symbol = "↓";
        board.children[Karel.y * 10 + Karel.x].innerHTML = "↓" + content;
    } else if (Karel.direction === "down") {
        Karel.direction = "right";
        Karel.symbol = "→";
        board.children[Karel.y * 10 + Karel.x].innerHTML = "→" + content;
    }
}

function move() {
    let content = board.children[Karel.x + Karel.y * 10].innerHTML;
    board.children[Karel.x + Karel.y * 10].innerHTML =
        content.length === 1 ? "" : content.split("").slice(1).join("");
    board.children[Karel.x + Karel.y * 10].style.boxShadow = "unset";

    if (Karel.direction === "right") {
        if (Karel.x < 9) Karel.x++;
    }
    if (Karel.direction === "up") {
        if (Karel.y > 0) Karel.y--;
    }
    if (Karel.direction === "left") {
        if (Karel.x > 0) Karel.x--;
    }
    if (Karel.direction === "down") {
        if (Karel.y < 9) Karel.y++;
    }

    let newContent = board.children[Karel.x + Karel.y * 10].innerHTML;
    newContent.length === 0
        ? (board.children[Karel.x + Karel.y * 10].innerHTML = Karel.symbol)
        : (board.children[Karel.x + Karel.y * 10].innerHTML =
              Karel.symbol + newContent);
    board.children[Karel.x + Karel.y * 10].style.boxShadow =
        "inset 0 0 10px 1px oklch(93% 0.2 0)";
}

function parseCommand(command) {
    let errors = [];
    let parsed = command.split(" ");
    let parsedCommand = parsed.shift();
    let args = parsed.join(" ");

    switch (parsedCommand.toUpperCase()) {
        case "KROK": {
            if (args.length === 0) {
                args = 1;
            }
            for (let i = 0; i < parseInt(args); i++) {
                move();
            }
            break;
        }
        case "VLEVOBOK": {
            if (args.length === 0) {
                args = 1;
            }
            for (let i = 0; i < parseInt(args); i++) {
                changeDirection();
            }
            break;
        }
        case "POLOZ": {
            if (args.toUpperCase() === "RESET") {
                board.children[Karel.x + Karel.y * 10].innerHTML = Karel.symbol;
                board.children[Karel.x + Karel.y * 10].style.backgroundColor =
                    "transparent";
                break;
            }
            args = args.split(" ");

            switch (args[0].toUpperCase()) {
                case "TEXT": {
                    board.children[Karel.x + Karel.y * 10].innerHTML += args[1];
                    break;
                }
                case "BARVU": {
                    board.children[
                        Karel.x + Karel.y * 10
                    ].style.backgroundColor = args[1];
                    break;
                }
            }

            break;
        }
        case "RESET": {
            setBoard();
            break;
        }
        case "STYL": {
            args = args.toUpperCase().split(" ");
            console.log(args);

            switch (args.shift()) {
                case "TEXT": {
                    switch (args.shift()) {
                        case "RESET": {
                            board.children[Karel.x + Karel.y * 10].style.color =
                                "inherit";
                            board.children[
                                Karel.x + Karel.y * 10
                            ].style.fontWeight = 400;
                            break;
                        }
                        case "BARVA": {
                            board.children[Karel.x + Karel.y * 10].style.color =
                                args.join(" ");
                            break;
                        }
                        case "VAHA": {
                            board.children[
                                Karel.x + Karel.y * 10
                            ].style.fontWeight = parseInt(args);
                            break;
                        }
                    }
                    break;
                }
            }
            break;
        }

        default: {
            errors.push(command);
            break;
        }
    }

    errors
        .filter((each) => each)
        .forEach((element) => {
            consoleParagraph.innerHTML +=
                "<p>" + "Unknown command: " + element + "</p>";
        });
}

function executeCommands(commands, index = 0) {
    if (index >= commands.length) return;

    parseCommand(commands[index]);
    setTimeout(() => {
        executeCommands(commands, index + 1);
    }, 500);
}

setBoard();

button.addEventListener("click", () => {
    consoleParagraph.innerHTML = "";
    input = textarea.value.split("\n");

    executeCommands(input);
});
