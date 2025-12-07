import {images, universalControl, universalDisplay} from "./script.js";
import {competitionData, storage} from "./control.js";
import {points, isEliminated, updatePlacements, resetResults, updatePlacementsAll} from "./placementControl.js"

const display = (function(){
    // Create div to store episode information
    const createEpisodeHeaders = function () {
        const episodeInfo = document.createElement("div");
        episodeInfo.id = "episode-info";
        episodeInfo.className = "subheading-div";
        document.querySelector("main").appendChild(episodeInfo);
    }


    // Use compeitionData and current week to display relevant information for each epsiode
    const updateEpisodeHeaders = function() {
        // Get information from competitionData object
        
        let title="";
        if (competitionData.week < competitionData.episodes.length+1) {
            title  = `Episode ${competitionData.week}: ${competitionData.episodes[competitionData.week-1].name}`;
        } else {
            title = `Episode ${competitionData.week}: Finale`;
        }

        const episodeInfo = document.getElementById("episode-info");

        // Add all information to the episode-info div
        episodeInfo.innerHTML = `<h2 id="episode-title">${title}</h2>`;
    }

    // Create dropdown used to select queen placement for each week
    const createPlacementDropdown = function(div, id) {
        // Create the select dropdown
        const select = document.createElement("select");
        select.className = "placement-select";
        select.id=id;

        // Select different placements depending on whether or not it is the finale episode
        const placementsArray = competitionData.week <= competitionData.episodes.length ? competitionData.placements.slice() : competitionData.finalePlacements.slice();

        // Add each placement to the dropdown
        for (let i = 0; i <= placementsArray.length-1; i++) {
            if ( placementsArray[i]!=="Out"){
                const option = document.createElement("option");
                option.textContent = placementsArray[i];
                option.value = placementsArray[i];
                select.appendChild(option);
            }
        };

        div.append(select);
    }
        // Display queen images and names
        const displayQueens = function() {
            // Create div for images to go inside
            const queensDiv = document.createElement("div");
            queensDiv.id="queens-div";
            document.querySelector("main").appendChild(queensDiv);
    
            // Cycle through each queen and create display elements
            for (let i = 0; i < competitionData.queens.length; i++) {
                // Create div for each queen
                const queenDiv = document.createElement("div");
                queenDiv.id = `queen${i}`;
                queenDiv.className = "queen-div";
    
                // Add queen name
                const queenNameH3 = document.createElement("h3");
                queenNameH3.class = "queen-name";
                queenNameH3.innerText = competitionData.queens[i].name;
    
                // Set everything together
                queenDiv.appendChild(queenNameH3);
                queensDiv.appendChild(queenDiv);
    
                // Add dropdown for placements
                createPlacementDropdown(queenDiv, `queen-dropdown${i}`);
            }
        }

    
    // Weeks dropdown used to navigate to different weeks in the competition
    const createWeeksDropdown = function() {
        // Create the select dropdown
        const select = document.createElement("select");
        select.id = "week-select";

        // Add options from 1 to numberOfWeeks
        for (let i = 1; i <= competitionData.episodes.length+1; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `Week ${i}`;
            select.appendChild(option);
        }

        return {select}
    }

    // Arrow buttons to navigate between consecutive weeks in the competition
    const createArrows = function() {
        // Create Div for navigation functions to sit inside
        const navDiv = document.getElementById("nav-div");
        const weeksNavDiv = document.createElement("div");
        weeksNavDiv.id = "nav-weeks";
        navDiv.prepend(weeksNavDiv);

        // Create left arrow button and add properties
        const leftArrow = document.createElement("button");
        const leftArrowImage = document.createElement("img");
        leftArrow.id = "left-arrow";
        leftArrow.className = "arrow-button";
        leftArrowImage.alt = "Previous";
        leftArrowImage.src = images.arrowLeft;
        leftArrow.appendChild(leftArrowImage);

        // Create right arrow button and add properties
        const rightArrow = document.createElement("button");
        const rightArrowImage = document.createElement("img");
        rightArrow.id = "right-arrow";
        rightArrow.className = "arrow-button";
        rightArrowImage.alt = "Previous";
        rightArrowImage.src = images.arrowRight;
        rightArrow.appendChild(rightArrowImage);

        // Create weeks dropdown
        const dropdown = createWeeksDropdown ();

        // Put everything together
        weeksNavDiv.appendChild(leftArrow);
        weeksNavDiv.appendChild(dropdown.select);
        weeksNavDiv.appendChild(rightArrow);
    }


    // Replace placement dropdowns with new select items if moving from or to the finale episode where placements are different
    const updatePlacementDropdownWeek = function() {
        if ((competitionData.week===competitionData.episodes.length+1 && control.getPreviousWeek()!==competitionData.episodes.length+1) 
            || (competitionData.week!==competitionData.episodes.length+1 && control.getPreviousWeek()===competitionData.episodes.length+1)) {
            for (let i=0; i < competitionData.queens.length; i++) {
                // Remove existing dropdown
                const queenDropdown = document.getElementById(`queen-dropdown${i}`);
                queenDropdown.remove();

                const innerDiv = document.getElementById(`queen${i}`);
                createPlacementDropdown(innerDiv, `queen-dropdown${i}`);
            };
            // Add event listener back to dropdown
            control.placementUpdateListener();
        }
    }

    // Update placement dropdowns and queen images
    const updatePlacementDropdown = function() {
        for (let i = 0; i < competitionData.queens.length; i++) {
            const queenDropdown = document.getElementById(`queen-dropdown${i}`);
            const queenDiv = document.getElementById(`queen${i}`);

            let placementAtWeek="";

            if (competitionData.week < competitionData.episodes.length+1) {
                placementAtWeek=competitionData.queens[i].placements[competitionData.week-1].placement;
            } else {
                placementAtWeek=competitionData.queens[i].finalePlacement
            };

            // const placementAtWeek = i < competitionData.queens.length ? competitionData.queens[i].placements[competitionData.week-1].placement : competitionData.queens[i].finalePlacement;

            // Update dropdown to show current placement and hide dropdown if queen is no longer in the competition
            queenDropdown.value = placementAtWeek;
            queenDropdown.style.display = placementAtWeek!=="Out" ? "inline-block" : "none";

            // Add class names to queen images so that formatting can be controlled through CSS
            queenDiv.className = "queen-div " + placementAtWeek.toLowerCase().replaceAll(" ", "");

            // Add returning button if queen is out of the competition
            // updateReturningButton();
        }
    }

    const init = function(){
        universalDisplay.init(true, false);
        createEpisodeHeaders();
        updateEpisodeHeaders();
        displayQueens();
        createArrows();
        universalDisplay.createHomeButton();
        universalDisplay.createResultsButton();
        universalDisplay.createResetButton();
        updatePlacementDropdown()
        updatePlacementDropdownWeek();
    }

    // Create weekUpdate function with all of the display functions that need to be run when competitionData.weekis updated
    const weekUpdate = function() {
        console.log(`control.weekUpdate: Display updated for week ${competitionData.week}`);
        document.getElementById("left-arrow").style.display = competitionData.week> 1 ? "inline-block" : "none";
        document.getElementById("right-arrow").style.display = competitionData.week < competitionData.episodes.length+1 ? "inline-block" : "none";

        const weekDropdown = document.getElementById("week-select");
        weekDropdown.value = competitionData.week.toString();

        updateEpisodeHeaders();
        updatePlacementDropdownWeek();
        updatePlacementDropdown();

        storage.saveData("week");
    }

    return {init, weekUpdate, updatePlacementDropdown, updatePlacementDropdownWeek}
})()


// Functions to link DOM elements with controlling the site
const control = (function () {
    let previousWeek=competitionData.week;

    // Link arrow buttons with competitionData.week
    const arrowListeners = function () {
        // Select arrow button elements
        const leftArrow = document.getElementById("left-arrow");
        const rightArrow = document.getElementById("right-arrow");

        // Create function to increment competitionData.weekby one 
        const incrementWeek = function(change) {
            previousWeek=competitionData.week;
            if (change==="decrease" && competitionData.week> 1) {competitionData.week--};
            if (change==="increase" && competitionData.week<=competitionData.episodes.length) {competitionData.week++};

            console.log(`control.arrowListeners: Week updated to ${competitionData.week}`);
            display.weekUpdate(); // Update display
        }

        // Add event listeners to arrow buttons
        leftArrow.addEventListener("click", function () {incrementWeek("decrease")});
        rightArrow.addEventListener("click", function () {incrementWeek("increase")});

        // Add event listener to arrow keys
        document.addEventListener("keyup", function(e) {
            if (e.key==="ArrowLeft" || e.key==="ArrowRight"){
                e.preventDefault();
                if (e.key==="ArrowLeft") {incrementWeek("decrease")};
                if (e.key==="ArrowRight") {incrementWeek("increase")};
            }
          });
    };

    // Add event listener to weeks dropdown
    const weekDropdownListener = function() {
        // Select dropdown
        const weekSelect = document.getElementById("week-select");

        // Update competitionData.weekto match dropdown
        weekSelect.addEventListener("change", function (e) {
            if (e.target.id === "week-select") {
                previousWeek=competitionData.week;
                competitionData.week= parseInt(e.target.value);
                console.log(`control.weekDropdownListener: Week updated to ${competitionData.week}`);
                display.weekUpdate(); // Update display
            }
        });
    }

    // Function to get latest version of previousWeek from outside of the object
    const getPreviousWeek = function() {
        return previousWeek;
    }

    // Function to update placements for each queen based on what has been selected by user
    const placementUpdateListener = function () {
        // Cycle through each queen
        for (let i = 0; i < competitionData.queens.length; i++) {
            // Select dropdown
            const dropdown=document.getElementById(`queen-dropdown${i}`);
    
            // Add event listener to track any changes in queen placement selected in the dropdown
            dropdown.addEventListener("change", function(e) {    
                console.log("control.placementUpdateListener: Dropdown changed");
                // Get selected value and set queen placement equal to this value
                const dropdownValue = e.target.value;
                if (competitionData.week < competitionData.episodes.length+1) {
                    competitionData.queens[i].placements[competitionData.week- 1].placement = dropdownValue;
                } else {
                    competitionData.queens[i].finalePlacement = dropdownValue;
                }
    
                updatePlacements(competitionData.week, competitionData.queens[i]);
    
                display.updatePlacementDropdown(competitionData.week);
            });
        }
    };

    // Event listener for the Reset Results button which sets results back to the original competition placements
    const resetListener = function () {
        const resetButton = document.getElementById("reset-results");
        resetButton.addEventListener("click", () => {
            resetResults();
            display.weekUpdate();
        });
    };

    // Group all event listeners together
    const eventListeners = function () {
        arrowListeners();
        weekDropdownListener();
        placementUpdateListener();
        // returningUpdate();
        resetListener();
    }

    return { getPreviousWeek, eventListeners, placementUpdateListener };
})();

storage.getData();
updatePlacementsAll();
display.init()
control.eventListeners();
display.weekUpdate();