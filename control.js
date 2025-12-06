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
        const mainDiv = document.querySelector("main");

        storage.getData();

        function buildSection(type, displayText) {
            const typeCapitalised = type.charAt(0).toUpperCase() + type.slice(1) + "s";

            const mainTypeDiv = document.createElement("div");
            mainTypeDiv.id = `main-${type}-div`;

            const formDiv = document.createElement("div");
            formDiv.id = `${type}-form-div`;

            const header = document.createElement("h2");
            header.innerText = `${typeCapitalised}`;

            const text = document.createElement("p");
            text.innerText=displayText;
            
            const listDiv = document.createElement("ul");
            listDiv.id = `${type}-list-div`;
            

            
            mainDiv.appendChild(mainTypeDiv);
            mainTypeDiv.appendChild(header);
            mainTypeDiv.appendChild(text);
            mainTypeDiv.appendChild(listDiv);
            mainTypeDiv.appendChild(formDiv);
            addForm(type);

            competitionData[`${type}s`].forEach(element => {
                render.displayListElement(type, element.name, element.id);
            })
            
        }

        buildSection("queen", "Enter the names of the queens to compete");
        buildSection("episode", "Use the drop down or enter custom text to decide what challenges the queens will face");
        arrowButtonHide();

        const navDiv = document.getElementById("nav-div")


        // Link to feedback page
        const choosePlacementsLink = document.createElement("a");
        choosePlacementsLink.href = "placements.html";

        const choosePlacementsButton = document.createElement("button");
        choosePlacementsButton.id = "choose-placements-button";
        choosePlacementsButton.innerText = "Choose Placements";

        choosePlacementsButton.addEventListener("click", placements.fillPlacements)

        navDiv.appendChild(choosePlacementsLink);
        choosePlacementsLink.appendChild(choosePlacementsButton);
    }
    
    const addForm = function (type) {
        const typeCapitalised = type.charAt(0).toUpperCase() + type.slice(1) + "s";

        const form = document.createElement("form");
        form.id = `${type}-form`;
        
        const inputLabel = document.createElement("label");
        // inputLabel.textContent = "";
        inputLabel.htmlFor = `add-${type}-input`;

        const input = document.createElement("input");
        input.id = `add-${type}-input`;
        input.name = `add-${type}-input`;

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Add";

        form.appendChild(inputLabel);
        form.appendChild(input);
        form.appendChild(submitButton);

        if (type==="episode") {
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

            form.appendChild(episodeDataList);
            input.setAttribute("list", "episode-suggestions");
        }

        const resetButton = document.createElement("button");
        resetButton.id = `${type}-reset-button`;
        resetButton.innerText = `Reset ${typeCapitalised}`

        form.appendChild(resetButton);

        const formDiv = document.getElementById(`${type}-form-div`);
        formDiv.appendChild(form);

        console.log(`render.addForm: ${type} input form created`);
    }

    const arrowButtonHide = function () {
        for (let index = 0; index < competitionData.episodes.length; index++) {
            const id = competitionData.episodes[index].id;

            const upButton = document.getElementById(`episode-up-${id}`);
            const downButton = document.getElementById(`episode-down-${id}`);    

            if (index===0) {upButton.style.display = "none"} 
            else {upButton.style.display = "inline"};

            if (index===competitionData.episodes.length-1) {
                downButton.style.display = "none";
                // upButton.style.marginRight = "2.8rem";
            } 
            else {downButton.style.display = "inline"};
        }

    }

    const displayListElement = function (type, name, id) {
            const elementListItem = document.createElement("li");
            // queenDiv.id = album.id;
            elementListItem.classList = `${type}-list-element`;
            elementListItem.id = `${type}-list-element-${id}`;
            elementListItem.innerText = name;

            const buttonDiv = document.createElement("span");
            buttonDiv.classList="list-buttons";

            if (type === "episode") {

                // Determine the index of this episode in competitionData
                const episodes = competitionData.episodes;
                const index = episodes.findIndex(ep => ep.id === id);
            
                // Create a container for the arrows
                buttonDiv.classList.add("episode-arrows");
            
                // Create UP arrow (▲)
                    const upButton = document.createElement("button");
                    upButton.classList = "episode-up";
                    upButton.id = `episode-up-${id}`;
                    upButton.innerText = "▲";
                    buttonDiv.appendChild(upButton);
            
                // Create DOWN arrow (▼)
                    const downButton = document.createElement("button");
                    downButton.classList = "episode-down";
                    downButton.id = `episode-down-${id}`;
                    downButton.innerText = "▼";
                    buttonDiv.appendChild(downButton);

                
            
                // Append arrow buttons to the list item
            }
            
            const removeButton = document.createElement(`button`);
            removeButton.classList = `${type}-list-remove`;
            removeButton.id = `${type}-list-remove-${id}`;
            removeButton.innerText = `x`;
            buttonDiv.appendChild(removeButton);

            const elementListDiv = document.getElementById(`${type}-list-div`);
            elementListDiv.appendChild(elementListItem);

            elementListItem.appendChild(buttonDiv);

            console.log(`render.displayListElements: ${name} added to ${type} list`);
    }

    return {init, displayListElement, arrowButtonHide};
})();

const control=(function() {
    let counters = {
        queen: 0,
        episode: 0
    }

    const elementAdd = function(type) {
        const form = document.getElementById(`${type}-form`);
        const addInput = document.getElementById(`add-${type}-input`);

        form.addEventListener("submit", function(e) {
            e.preventDefault();

            if (addInput.value) {
                const element = {name: addInput.value, id: control.counters[type]++};
                if (type=="queen") {element.placements = []};
                addInput.value = "";
                competitionData[`${type}s`].push(element);
                render.displayListElement(`${type}`, element.name, element.id);
                render.arrowButtonHide();
                console.log(`control.elementAdd: List of ${type}s is ${competitionData[type+"s"].map(element => element.name).join(", ")}`)
                storage.saveData(`${type}s`);
                storage.saveCounters();
            }
        })
    }

    const elementRemove = function (type) {
            document.querySelector("main").addEventListener("click", (e) => {
                if (e.target.classList.contains(`${type}-list-remove`)) {
                  const id = e.target.id;
                  const elementID = Number(id.replace(`${type}-list-remove-`, ""));
                  
                  const listDiv = document.getElementById(`${type}-list-div`)
                  const listElement = document.getElementById(`${type}-list-element-${elementID}`);

                  listElement.remove();
                  
                  console.log(`control.elementRemove: ${competitionData[`${type}s`].filter(element => element.id === elementID).map(q => q.name)} removed from list of ${type}s`)

                  competitionData[`${type}s`] = competitionData[`${type}s`].filter(element => element.id !== elementID)
                  storage.saveData(`${type}s`);
                  if (type=="episode") {render.arrowButtonHide()};
                  console.log(`control.elementRemove: List of ${type}s is ${competitionData[type+"s"].map(q => q.name).join(", ")}`)
                }
            });
    }

    const arrowListener = function(dir) {
        document.querySelector("main").addEventListener("click", (e) => {
            if (e.target.classList.contains(`episode-${dir}`)) {
                const id = Number(e.target.id.split("-").pop());

                const position = competitionData.episodes.findIndex(ep => ep.id === id);
                const episodeDiv = document.getElementById(`episode-list-element-${id}`);
                
                if (dir==="up"){
                    const previous = episodeDiv.previousElementSibling;
                    episodeDiv.parentNode.insertBefore(episodeDiv, previous);
                    const targetposition = position-1;
                    [competitionData.episodes[position], competitionData.episodes[targetposition]] = [competitionData.episodes[targetposition], competitionData.episodes[position]];
                }
                if (dir==="down"){
                    const next = episodeDiv.nextElementSibling;
                    episodeDiv.parentNode.insertBefore(next, episodeDiv);
                    const targetposition = position+1;
                    [competitionData.episodes[position], competitionData.episodes[targetposition]] = [competitionData.episodes[targetposition], competitionData.episodes[position]];
                }
                render.arrowButtonHide();
                storage.saveData("episodes");
            }
        })
    }

    const resetListener = function(type) {
        const resetButton = document.getElementById(`${type}-reset-button`);

        resetButton.addEventListener("click", () => {
            competitionData[`${type}s`] = [];
            const listDiv = document.getElementById(`${type}-list-div`);
            listDiv.innerHTML = "";
            control.counters[type] = 0;
            storage.saveData(`${type}s`);
            storage.saveCounters();
        })
    }

    // const generateResultsTable = function() {
    //     for (let i = 0; i < competitionData.queens.length; i++) {
    //         // if (!competitionData.queens[i].placements) {
    //             competitionData.queens[i].placement = Array(competitionData.episodes.length).fill("Safe");
    //             competitionData.queens[i].return = Array(competitionData.episodes.length).fill(false);
    //             console.log(`generateResultsTable: Generic result vector created for ${competitionData.queens[i].name}`)
    //         // }
    //     }
    // }

    // const placementsListener = function() {
    //     const resetButton = document.getElementById("choose-placements-button");

    //     resetButton.addEventListener("click", () => {
    //         generateResultsTable();
    //     })
    // }

    const init = function () {

        ["queen", "episode"].forEach(type => {
            elementAdd(type);
            elementRemove(type);
            resetListener(type);
        })

        arrowListener("up");
        arrowListener("down");
        // placementsListener();

    }

    return {init, counters}
})();

const competitionData = (function () {
    let week=1;
    let queens = [];

    const episodeSuggestions = ["Acting", "Ball", "Commerical", "Design", "Girl Group", "Improv", "Makeover", "Roast", "Rusical", "Snatch Game", "Stand-up", "Talent Show"];
    let episodes = [];

    const placements=["Win", "Top 2", "High", "Safe", "Low", "Bottom", "Eliminated", "Quit", "Out"];
    const finalePlacements=["Winner", "Runner up", "Eliminated"]

    return {week, queens, episodes, episodeSuggestions, placements, finalePlacements}
})()


const placements = (function() {
    const fillPlacements = function() {
        competitionData.queens.forEach(queen => {
            if (queen.placements === undefined || queen.placements.length == 0) {
                // create from scratch
                for (let i = 0; i < competitionData.episodes.length; i++) {
                    const newEp = { placement: "Safe", returns: false, episodeID: competitionData.episodes[i].id };
                    queen.placements.push(newEp);
                }
            } else {
                // ensure correct order and fill missing episodes
                const newPlacementArray = [];
                competitionData.episodes.forEach(episode => {
                    let episodePresent = false;

                    queen.placements.forEach(placement => {
                        if (placement.episodeID === episode.id) {
                            newPlacementArray.push(placement);
                            episodePresent = true;
                        }
                    });

                    if (episodePresent === false) {
                        const newEp = { placement: "Safe", returns: false, episodeID: episode.id };
                        newPlacementArray.push(newEp);
                    }
                });

                queen.placements = newPlacementArray;
            };
        });
        storage.saveData("queens");
    };

    return {fillPlacements}
})()

// Functions for saving and retrieving data
const storage = (function() {
    // Save data
    const saveData = function(varName) {
        localStorage.setItem(`RPDRGenerator.${varName}`, JSON.stringify(competitionData[varName]));  
        console.log(`storage.saveData: ${varName} saved to local storage`);
    }

    const saveCounters = function () {
        localStorage.setItem(`RPDRGenerator.control.counters`, JSON.stringify(control.counters));
        console.log("storage.saveCounters: control.counters saved to local storage");
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

        const countersSaved = JSON.parse(localStorage.getItem(`RPDRGenerator.control.counters`));
        if (countersSaved) {
            control.counters = countersSaved;
            console.log("storage.getData: control.counters retrieved from local storage");
        };
        // retriever("RPDRGenerator.points", competitionData.points);
    }

    return {saveData, saveCounters, getData };
})();

const control_script = function(){
    storage.getData();
    
    universalDisplay.init(false, true, false);
    render.init();
    control.init();
}


import {images, universalControl, universalDisplay} from "./script.js";
export {competitionData, control_script, storage}
