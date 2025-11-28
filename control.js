// const queens=(function () {
//     // Create div to store episode information
//     const addQueen = function () {
//         const addQueen = document.createElement("div");
//         episodeInfo.id = "episode-info";
//         episodeInfo.className = "subheading-div";
//         document.body.appendChild(episodeInfo);
//     }

//     return {};
// })();

const render=(function () {
    const init = function () {
        const queenFormDiv = document.createElement("div");
        queenFormDiv.id="queen-form-div";

        const queenListDiv = document.createElement("div");
        queenListDiv.id="queen-list-div";

        document.body.appendChild(queenFormDiv)
        document.body.appendChild(queenListDiv);

    }
    const addQueen = function () {
        const queenForm = document.createElement("form");
        queenForm.id = "queen-form";
        
        const addQueenLabel = document.createElement("label");
        addQueenLabel.textContent = "Add Queen";
        addQueenLabel.htmlFor = "add-queen-input";

        const addQueenInput = document.createElement("input");
        addQueenInput.type = "text";
        addQueenInput.id = "add-queen-input";
        addQueenInput.name = "add-queen-input";

        const addQueenButton = document.createElement("button");
        addQueenButton.type = "submit";
        addQueenButton.textContent = "Add";

        queenForm.appendChild(addQueenLabel);
        queenForm.appendChild(addQueenInput);
        queenForm.appendChild(addQueenButton);

        const queenFormDiv = document.getElementById("queen-form-div");
        queenFormDiv.appendChild(queenForm);

        console.log("render.addQueen: Queen input form created");
    }

    const displayQueens = (function (queen, id) {
            const queenDiv = document.createElement("div");
            // queenDiv.id = album.id;
            queenDiv.classList = "queen-list-element";
            queenDiv.id = `queen-list-element-${id}`;
            queenDiv.innerText = queen;

            const removeButton = document.createElement("button");
            removeButton.classList = "queen-list-remove";
            removeButton.id = `queen-list-remove-${id}`;
            removeButton.innerText = "x";

            queenDiv.appendChild(removeButton);

            const queenListDiv = document.getElementById("queen-list-div");
            queenListDiv.appendChild(queenDiv);
            console.log("render.displayQueens: ", queen, " added");
    })

    return {init, addQueen, displayQueens};
})();

const control=(function() {
    let queenID = 0;

    const queenEnter = function() {
        const queenForm = document.getElementById("queen-form");
        const addQueenInput = document.getElementById("add-queen-input");

        queenForm.addEventListener("submit", function(e) {
            e.preventDefault();

            if (addQueenInput.value) {
                const queen = {name: addQueenInput.value, id: queenID++};
                addQueenInput.value = "";
                competitionData.queens.push(queen);
                render.displayQueens(queen.name, queen.id);
                console.log(`control.queenForm: List of queens is ${competitionData.queens.map(q => q.name).join(", ")}`)
                return {queen}
            }
        })
    }

    const queenListRemove = function () {
        // const removeButtons = document.querySelectorAll(".queen-list-remove");

        // removeButtons.forEach(button => {
            document.body.addEventListener("click", (e) => {
                if (e.target.classList.contains("queen-list-remove")) {
                  const id = e.target.id;
                  const queenId = Number(id.replace("queen-list-remove-", ""));
                  
                  const queenListDiv = document.getElementById("queen-list-div")
                  const queenListElement = document.getElementById(`queen-list-element-${queenId}`);

                  queenListDiv.removeChild(queenListElement);
                  
                  competitionData.queens = competitionData.queens.filter(queen => queen.id !== queenId)
                  console.log(`control.queenListRemove: List of queens is ${competitionData.queens.map(q => q.name).join(", ")}`)
                }
            });
        // });
    }

    return {queenEnter, queenListRemove}
})();

const competitionData = (function () {
    const queens = [];

    return {queens}
})()

render.init();
render.addQueen();
control.queenEnter();
control.queenListRemove();