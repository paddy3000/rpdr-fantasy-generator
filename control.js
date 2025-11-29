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
        // Create divs
        const mainDiv = document.createElement("main");

        const queenFormDiv = document.createElement("div");
        queenFormDiv.id="queen-form-div";

        const queenListDiv = document.createElement("div");
        queenListDiv.id="queen-list-div";

        const episodeFormDiv = document.createElement("div");
        episodeFormDiv.id="episode-form-div";

        const episodeListDiv = document.createElement("div");
        episodeListDiv.id="episode-list-div";

        // Create headers
        const createTextElement = function(type, text) {
            const outputElement = document.createElement(type);
            outputElement.innerText = text;
            return outputElement;
        }

        const queenHeader = createTextElement("h2", "Queens");
        const episodeHeader = createTextElement("h2", "Episodes");
        const queenText = createTextElement("p", "Enter the names of the queens to compete");
        const episodeText = createTextElement("p", "Use the drop down or enter custom text to decide what challenges the queens will face");

        document.body.appendChild(mainDiv);
        mainDiv.appendChild(queenFormDiv)
        queenFormDiv.appendChild(queenHeader);
        queenFormDiv.appendChild(queenText);
        mainDiv.appendChild(queenListDiv);
        mainDiv.appendChild(episodeFormDiv);
        episodeFormDiv.appendChild(episodeHeader);
        episodeFormDiv.appendChild(episodeText);
        mainDiv.appendChild(episodeListDiv);

        addQueenForm();
        addEpisodeForm();

        storage.getData();
        competitionData.queens.forEach(queen => {
            render.displayElement("queen", queen.name, queen.id);
        })
        
        competitionData.episodes.forEach(episode => {
            render.displayElement("episode", episode.name, episode.id);
        })
    }
    
    const addQueenForm = function () {
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

        console.log("render.addQueenForm: Queen input form created");
    }

    const addEpisodeForm = function () {
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

    return {init, addQueenForm, displayElement};
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
                storage.saveData("queens");
                return {queen}
            }
        })
    }

    const listElementRemove = function (type) {
            document.body.addEventListener("click", (e) => {
                if (e.target.classList.contains(`${type}-list-remove`)) {
                  const id = e.target.id;
                  const elementID = Number(id.replace(`${type}-list-remove-`, ""));
                  
                  const listDiv = document.getElementById(`${type}-list-div`)
                  const listElement = document.getElementById(`${type}-list-element-${elementID}`);

                  listDiv.removeChild(listElement);
                  
                  competitionData[`${type}s`] = competitionData[`${type}s`].filter(element => element.id !== elementID)
                  storage.saveData(`${type}s`);
                  console.log(`control.listElementRemove: List of ${type}s is ${competitionData[type+"s"].map(q => q.name).join(", ")}`)
                }
            });
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
                console.log(`control.episodeAdd: List of episodes is ${competitionData.episodes.map(q => q.name).join(", ")}`);
                storage.saveData("episodes");
                return {episode}
            }
        })
    }

    return {queenAdd, listElementRemove, episodeAdd}
})();

const competitionData = (function () {
    let week=1;
    const queens = [];

    const episodeSuggestions = ["Acting", "Ball", "Commerical", "Design", "Girl Group", "Improv", "Makeover", "Roast", "Rusical", "Snatch Game", "Stand-up", "Talent Show"];
    const episodes = [];

    return {queens, episodes, episodeSuggestions}
})()

// Functions for saving and retrieving data
const storage = (function() {
    // Save data
    const saveData = function(varName) {
        localStorage.setItem(`RPDRGenerator.${varName}`, JSON.stringify(competitionData[varName]));  
        console.log(`storage.saveData: ${varName} saved to local storage`);
    }

    // Read in queen data
    const getData = function() {
        const retriever = function (varName) {
            let storedData = JSON.parse(localStorage.getItem(`RPDRGenerator.${varName}`));
            if (storedData){
                console.log(`storage.getData: ${`RPDRGenerator.${varName}`} array retrieved from local storage`);
                competitionData[varName] = storedData;
            }
        }

        retriever("queens");
        retriever("week");
        retriever("episodes");
        // retriever("RPDRGenerator.points", competitionData.points);
    }

    return {saveData, getData };
})();


render.init();
control.queenAdd();
control.listElementRemove("queen");
control.listElementRemove("episode");
control.episodeAdd();