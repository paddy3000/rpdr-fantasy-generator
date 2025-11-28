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


        const episodeFormDiv = document.createElement("div");
        episodeFormDiv.id="episode-form-div";

        const episodeListDiv = document.createElement("div");
        episodeListDiv.id="episode-list-div";

        document.body.appendChild(queenFormDiv)
        document.body.appendChild(queenListDiv);
        document.body.appendChild(episodeFormDiv)
        document.body.appendChild(episodeListDiv);

        addQueen();
        addEpisode();
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

    const addEpisode = function () {
        const episodeForm = document.getElementById("episode-form-div");

        const addEpisodeDiv = document.createElement("div");
        addEpisodeDiv.id = "add-episode-div";

        const episodeDataList = document.createElement("datalist");
        episodeDataList.id = "episode-suggestions";

        const addOption = function (optionName) {
            const optionElement = document.createElement("option");
            optionElement.value = optionName;
            episodeDataList.appendChild(optionElement);
        }

        competitionData.episodeSuggestions.forEach(suggestion => {
            addOption(suggestion)
        });

        const episodeInput = document.createElement("input");
        episodeInput.id = "add-episode-input";
        episodeInput.name = "add-episode-input";
        episodeInput.setAttribute("list", "episode-suggestions");


        const confirmButton = document.createElement("button");
        confirmButton.id = "confirm-episode-button";
        confirmButton.textContent = "Add";

        addEpisodeDiv.appendChild(episodeDataList);
        addEpisodeDiv.appendChild(episodeInput);
        addEpisodeDiv.appendChild(confirmButton);
        episodeForm.appendChild(addEpisodeDiv);
    }

    const displayElement = (function (type, name, id) {
            const elementDiv = document.createElement("div");
            // queenDiv.id = album.id;
            elementDiv.classList = `${type}-list-element`;
            elementDiv.id = `${type}-list-element-${id}`;
            elementDiv.innerText = name;

            const removeButton = document.createElement(`button`);
            removeButton.classList = `${type}-list-remove`;
            removeButton.id = `${type}-list-remove-${id}`;
            removeButton.innerText = `x`;

            elementDiv.appendChild(removeButton);

            const elementListDiv = document.getElementById(`${type}-list-div`);
            elementListDiv.appendChild(elementDiv);
            console.log(`render.displayElements: `, name, ` added to ${type} list`);
    })

    return {init, addQueen, displayElement};
})();

const control=(function() {
    let queenID = 0;
    let episodeID = 0;

    const queenAdd = function() {
        const queenForm = document.getElementById("queen-form");
        const addQueenInput = document.getElementById("add-queen-input");

        queenForm.addEventListener("submit", function(e) {
            e.preventDefault();

            if (addQueenInput.value) {
                const queen = {name: addQueenInput.value, id: queenID++};
                addQueenInput.value = "";
                competitionData.queens.push(queen);
                render.displayElement("queen", queen.name, queen.id);
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

    const episodeAdd = function() {
        const episodeFormDiv = document.getElementById("episode-form-div");
        const addEpisodeInput = document.getElementById("add-episode-input");
        const addEpisodeButton = document.getElementById("confirm-episode-button");
        
        addEpisodeButton.addEventListener("click", () => {
            if (addEpisodeInput.value) {
                const episode = {name: addEpisodeInput.value, id: episodeID++};
                render.displayElement("episode", episode.name, episode.id);
                addEpisodeInput.value = "";
                competitionData.episodes.push(episode);
                console.log(`control.episodeAdd: List of episodes is ${competitionData.episodes.map(q => q.name).join(", ")}`)
                return {episode}
            }
        })
    }

    return {queenAdd, queenListRemove, episodeAdd}
})();

const competitionData = (function () {
    const queens = [];

    const episodeSuggestions = ["Acting", "Ball", "Commerical", "Design", "Girl Group", "Improv", "Makeover", "Roast", "Rusical", "Snatch Game", "Stand-up", "Talent Show"];
    const episodes = [];

    return {queens, episodes, episodeSuggestions}
})()

render.init();
control.queenAdd();
control.queenListRemove();
control.episodeAdd();