
import { competitionData, storage} from "./control.js";
import {images, universalControl, universalDisplay} from "./script.js";
import {points, isEliminated, updatePlacements, resetResults, updatePlacementsAll, getPoints, savePoints} from "./placementControl.js"

// Functions for generic display items
const displayGeneric = (function() {
    // Create heading and div that it sits inside
    const createHeaders = function() {
        const subheadingDiv = document.createElement("div");
        subheadingDiv.id = "results-subheading";
        subheadingDiv.className = "subheading-div";

        const subheading = document.createElement("h2");
        subheading.textContent = "Contestant Progress"

        subheadingDiv.appendChild(subheading);
        document.querySelector("main").appendChild(subheadingDiv);
    };
    
    // Create div for results chart and table, including inner divs for each
    const createResultsDiv = function () {
        const resultsDiv = document.createElement("div");
        resultsDiv.id = "results-div";

        const resultsTable = document.createElement("div");
        resultsTable.id = "results-table-div";

        const resultsChart = document.createElement("div");
        resultsChart.id = "results-chart-div";
        
        resultsDiv.appendChild(resultsTable);
        resultsDiv.appendChild(resultsChart);

        document.querySelector("main").appendChild(resultsDiv);
    };

    // Put together all functions required on opening the page including some from script.js
    const init = function () {
        universalDisplay.init(true, true);
        universalDisplay.createHomeButton();
        universalDisplay.createPlacementsButton();
        universalDisplay.createResetButton();
        
        createHeaders();
        createResultsDiv();
        graph.createGraph();
    }


    return { init };
})();

// Functions that control the display of progress items
const displayProgress = (function () {
    // Format to change full typed out results to what appears in the results table
    const formatResult = function(result) {
        if (result==="Bottom") {return "BTM"}
        else if (result==="Eliminated") {return "ELIM"}
        else if (result==="Out") {return ""}
        else {return result.toUpperCase()}
    };

    // Points per episode function
    const resultPoints = function(result) {
        // Get value from the points object where points.points.placement is equal to the placement for the queen
        const value = result!=="Quit" ? points.points.find(a => a.placement === result).value : 0;
        return Number(value);
    }

    // Function to create object with elimination order for the queens
    const eliminationOrder = function () {
        // Create array to store the number of weeks in the competition for each queen
        const weeksInCompetition = new Array(competitionData.queens.length);

        for (let i=0; i < competitionData.queens.length; i++) {
            // Initialise lastWeekIn and finaleResult, these will be updated in the next step
            let lastWeekIn=1;
            let finaleResult = 0;

            // Get last week where queen is not "Out"
            for (let j=0; j < competitionData.episodes.length; j++){
                if (competitionData.queens[i].placements[j].placement!=="Out") {
                    lastWeekIn=j+1;
                };
            }                    
            
            // Add value for finaleResult so that queens who all make it to the end can be sorted
            if (competitionData.queens[i].finalePlacement==="Winner") {finaleResult=1};
            if (competitionData.queens[i].finalePlacement==="Runner Up") {finaleResult=2};
            if (competitionData.queens[i].finalePlacement==="Eliminated") {finaleResult=3};

            // Create an object for each queen with the information needed for creating the table
            weeksInCompetition[i]={index: i,
                                   queen: competitionData.queens[i].name,
                                   weeks: lastWeekIn,
                                   finaleResult: finaleResult
                                };

        }

        // Sort by number of points in the last week so that finale winner is shown first
        weeksInCompetition.sort((a,b) => a.finaleResult - b.finaleResult);
        weeksInCompetition.sort((a,b) => b.weeks - a.weeks);
        return weeksInCompetition;        
    }

    // Function to calculate totalPoints and points per episode for each queen
    const calculatePPE = function () {
        // Create array to store objects for each queen
        const ppeScores = new Array(competitionData.queens.length);

        for (let i = 0; i < competitionData.queens.length; i++) {
            // Initialise weeksInCompetition and totalPoints variables
            let weeksInCompetition=0;
            let totalPoints=0;
            const totalPointsArray = new Array(competitionData.episodes.length); // totalPointsArray will track a running total of points to use in the chart

            for (let j = 0; j < competitionData.episodes.length; j++) {
                // If queen is still in the competition then increase weeksInCompetition and keep track of total points up to that point
                if (competitionData.queens[i].placements[j].placement!=="Out" && competitionData.queens[i].placements[j].placement!=="Quit") {
                    weeksInCompetition++;
                    totalPoints += resultPoints(competitionData.queens[i].placements[j].placement);
                }

                if (competitionData.queens[i].placements[j].placement!=="Out") {totalPointsArray[j] = totalPoints};
            }

            // Calculate points per episode
            const ppe = totalPoints / weeksInCompetition;
            const ppeRounded = Math.round(ppe*100)/100;

            // Create an object for each queen with the information needed for the display elements
            ppeScores[i] = {index: i,
                            queen: competitionData.queens[i].name,
                            ppe: ppeRounded,
                            totalPoints: totalPointsArray
            }
        }

        return ppeScores;
    }

    // Create results table
    const createTable = function () {
        const resultsTable = document.getElementById("results-table-div");

        // Create empty table elements
        const tbl = document.createElement("table");
        tbl.id = "results-table";
        const tblBody = document.createElement("tbody");
        const tblHeader=document.createElement("thead");

        const headerRow1=document.createElement("tr");
        const headerRow2=document.createElement("tr");
        const headerRow3=document.createElement("tr");

        // Create blank cell which will appear above the queen names
        const queensHeader=document.createElement("th");
        queensHeader.textContent="";
        queensHeader.className="queen-name"
        queensHeader.rowSpan=3;

        // Create weeks header that says "Epsiodes"
        const weeksHeader=document.createElement("th");
        weeksHeader.textContent="Epsiode";
        weeksHeader.className="weeks-header";
        weeksHeader.colSpan=competitionData.episodes.length+1;

        // Create blank cell with "PPE"
        const ppeHeader=document.createElement("th");
        ppeHeader.textContent="PPE";
        ppeHeader.className="ppe-header";
        ppeHeader.rowSpan=3;

        // Put together the two cells to create the first row of the header
        headerRow1.appendChild(queensHeader);
        headerRow1.appendChild(weeksHeader);
        headerRow1.appendChild(ppeHeader);

        // Loop through each week to create headers and short episode summary
        for (let i=0; i < competitionData.episodes.length+1; i++) {
            const weekNum = document.createElement("th");
            weekNum.textContent=`${i+1}`;
            headerRow2.appendChild(weekNum);

            const episodeType = document.createElement("th");
            episodeType.textContent = i < competitionData.episodes.length ? `${competitionData.episodes[i].name}` : "Finale";
            episodeType.className="episode-type";
            headerRow3.appendChild(episodeType);
        };

        // Put header rows all together
        tblHeader.appendChild(headerRow1);
        tblHeader.appendChild(headerRow2);
        tblHeader.appendChild(headerRow3);

        // Get elimination order of queens
        const sortedQueens = eliminationOrder();

        // Get content for table body
        for (let k = 0; k < competitionData.queens.length; k++) {
            // Replace index k with index i which selects the queens in order of elimination
            const i = sortedQueens[k].index;

            // Get queen name
            const row = document.createElement("tr");
            const queenNameCell = document.createElement("th");
            const queenName = document.createTextNode(competitionData.queens[i].name);
      
            // Append queen name to row
            queenNameCell.appendChild(queenName);
            queenNameCell.className="queen-name"
            row.appendChild(queenNameCell);

            // Get results for each week and add to row
            for (let j = 0; j < competitionData.episodes.length+1; j++) {
                // Formatted result for table
                const formattedResult = j < competitionData.episodes.length ? 
                    formatResult(competitionData.queens[i].placements[j].placement) : 
                    formatResult(competitionData.queens[i].finalePlacement);
                const weekCell = document.createElement("td");
                const weekResult = document.createTextNode(formattedResult);
                weekCell.className="result " + formattedResult.toLowerCase().replaceAll(" ", "");
                if (j === competitionData.episodes.length) {
                    weekCell.className += " finale-cell";
                };

                if (j < competitionData.episodes.length && competitionData.queens[i].placements[j].returns) {
                    weekCell.className += " returning";
                }
                weekCell.appendChild(weekResult);
                row.appendChild(weekCell);
            }

            // Add PPE scores to last column
            const ppeScores = calculatePPE();
            const ppe = document.createElement("td");
            ppe.innerText = `${ppeScores[i].ppe}`;
            ppe.className = "ppe-cell";
            ppe.id = `ppe-cell-queen${i}`;
            row.appendChild(ppe);

            row.className="queen-result-row";
            row.id=`queen${i}-result-row`; // Initial index of queen, not row number in the table
            tblBody.appendChild(row);
        }

        // Add caption
        const tfoot = document.createElement("tfoot");
        const tfootTr = document.createElement("tr");
        const tfootTrTd = document.createElement("td");
        tfootTrTd.colSpan=competitionData.queens.length+2;
        tfootTrTd.innerText = "To see points used in PPE calculation, open Settings in the top right corner of the page";
        tfootTr.appendChild(tfootTrTd);
        tfoot.appendChild(tfootTr);

        // Put everything together
        tbl.appendChild(tblHeader);
        tbl.appendChild(tblBody);
        tbl.appendChild(tfoot);
        resultsTable.innerHTML = "";
        resultsTable.appendChild(tbl);
    };

    // Function to update PPE scores in table if number of points per placement is changed
    const refreshPPE = function () {
        const ppeScores = calculatePPE();

        if (settingsControl.updateDisplay[0] === true) {
            // Update innerText of PPE column in table
            for (let i = 0; i < competitionData.queens.length; i++) {
                const PPECell = document.getElementById(`ppe-cell-queen${i}`);
                PPECell.innerText=`${ppeScores[i].ppe}`;
            }
    
            // Update graph to use the new scores
            graph.createGraph();
            settingsControl.updateDisplay[0] = false;
            console.log("displayProgress.refreshPPE: Chart and table updated");
        } else {
            console.log("displayProgress.refreshPPE: No update to chart or table");
        }
        
        }

    return {createTable, refreshPPE, calculatePPE};
})();

const control = (function () {
    // Reset Results button listener
    const resetListener = function () {
        const resetButton = document.getElementById("reset-results");
        resetButton.addEventListener("click", function () {
            // Check if there are any queens where their current placement is not equal to their initial placement
            for (let i=0; i < competitionData.queens.length; i++) {
                if (JSON.stringify(queens.queens[i].placement)!==JSON.stringify(queens.queens[i].initialPlacement) || JSON.stringify(queens.queens[i].return)!==JSON.stringify(queens.queens[i].initialReturn)) {
                    console.log(`control.resetListener: results for ${competitionData.queens[i].name} to be reset`);
                    
                    settingsControl.updateDisplay[0]=true;
                }
            };

            // If any queens have had placement updates then update the results table and chart
            if (settingsControl.updateDisplay[0]===true) {
                universalControl.resetResults();
                displayProgress.createTable();
                graph.createGraph();
                settingsControl.updateDisplay[0]=false;
                console.log("control.resetListener: All results reset and table and chart updated");
            } else {
                console.log("control.resetListener: Results already equal to original results");
            }
        });
    };

     const eventListeners = function () {
        resetListener();
    };

    return {eventListeners};
})();

const settingsControl = (function() {
    const updateDisplay = [false];

    // Create the settings box
    // Initial display set to none
    const createSettingsBox = function() {
        // Overall container
        const settingsDiv = document.createElement("div");
        settingsDiv.id = "settings-div";
    
        // Header for settings box
        const headerDiv = document.createElement("div");
        headerDiv.id = "settings-header-div";

        const header = document.createElement("h3");
        header.innerText = "Settings";
        headerDiv.appendChild(header);
    
        // Create close button
        const closeButton = universalDisplay.createCloseButton("settings-close-button");
        headerDiv.appendChild(closeButton);
    
        // Set up for form inputs
        const settingsForm = document.createElement("form");
        settingsForm.id = "settings-form";
    
        const fieldSet = document.createElement("fieldset");
        fieldSet.id = "points-fieldset";
    
        const legend = document.createElement("legend");
        legend.innerText = "Points per placement";
    
        fieldSet.appendChild(legend);
    
        // Create inputs for each of the objects in the points array
        const addInput = function(text) {
            const div = document.createElement("div");
            const id = points.points.find(a => a.placement === text).id;
            div.className = "settings-input";
    
            const label = document.createElement("label");
            label.for = `points-settings-${id}`;
            label.innerText = text;
    
            const input = document.createElement("input");
            input.type = "number";
            input.label = id;
            input.id = `points-settings-${id}`; 
            input.value = points.points.find(a => a.placement === text).value;
    
            div.appendChild(label);
            div.appendChild(input);
            fieldSet.appendChild(div);
        };    
        
        for (let i = 0; i < competitionData.placements.length; i++) {
            if (competitionData.placements[i]!=="Out" && competitionData.placements[i]!=="Quit") {
                addInput(competitionData.placements[i]);
            }
        }
    
        // Create save button
        const saveButton = document.createElement("button");
        saveButton.type = "submit";
        saveButton.innerText = "Save";
        saveButton.id = "settings-save-button";
    
        // Create reset button
        const resetButton = document.createElement("button");
        resetButton.innerText = "Reset Points";
        resetButton.id = "settings-reset-button";
        
        // Put everything together
        settingsDiv.appendChild(headerDiv);
        settingsForm.appendChild(fieldSet);
        settingsForm.appendChild(resetButton);
        settingsForm.appendChild(saveButton);
        settingsDiv.appendChild(settingsForm);
        document.querySelector("main").appendChild(settingsDiv);
    
        // Hide on startup
        settingsDiv.style.display = "none";
    
        // Add event listeners
        settingsCloseListener();
        settingsResetListener();
        settingsSaveListener();
    }

    // Close option required for multiple buttons so set up as separate function
    const settingsClose = function () {
        const settingsDiv = document.getElementById("settings-div");
        settingsDiv.style.display = "none";
        universalControl.popUpStatus.settingsOpen = false;
        displayProgress.refreshPPE(); 
    }

    // Add listener to main settings button to open and close the form
    const settingsButtonListener = function () {
        const settingsButton = document.getElementById("settings-button");
        const settingsDiv = document.getElementById("settings-div");

        settingsButton.addEventListener("click", function() {
            if (universalControl.popUpStatus.infoOpen===false  && universalControl.popUpStatus.settingsOpen===false) {
                settingsDiv.style.display = "block";
                universalControl.popUpStatus.settingsOpen = true;
                updateSettingsDisplay(points.points);
            } else if (universalControl.popUpStatus.settingsOpen===true) {
                settingsClose();
            }
        });
    };

    // Add functionality to close button
    const settingsCloseListener = function () {
        const settingsCloseButton = document.getElementById("settings-close-button");

        settingsCloseButton.addEventListener("click", settingsClose);
    };

    const savePointsFromForm = function () {
        getPoints();

        // Check each placement against the form and update if necessary
        for (let i = 0; i < points.points.length; i++) {
            const id = points.points[i].id;
            const pointsValue = Number(document.getElementById(`points-settings-${id}`).value);
            if (Number(points.points[i].value) !== Number(pointsValue)) {
                console.log(`settingsControl.savePointsFromForm: Points for ${id} have been updated from ${points.points[i].value} to ${pointsValue}`);
                points.points[i].value = pointsValue;
            }
        }

        // If change to points then save new array
        const storedPoints = JSON.parse(localStorage.getItem(`RPDRGenerator.points`));
        if (JSON.stringify(points.points)!==JSON.stringify(storedPoints)) { 
            updateDisplay[0] = true;
            savePoints();
        } else {
            console.log("settingsControl.savePointsFromForm: No update made to points");
        }
    }

    const settingsSaveListener = function () {
        const settingsSaveButton = document.getElementById("settings-save-button");
        settingsSaveButton.addEventListener("click", function(e) {
            e.preventDefault();
            savePointsFromForm();
            settingsClose();
        })
    }

    // Set values in form to points array
    const updateSettingsDisplay = function (pointsArray) {
        for (let i = 0; i < pointsArray.length; i++){
            const id = pointsArray[i].id;
            const input = document.getElementById(`points-settings-${id}`);
            input.value = pointsArray.find(a => a.id === id).value;
        }
    };

    // Reset points to initial values
    const settingsResetListener = function () {
        const settingsResetButton = document.getElementById("settings-reset-button");

        settingsResetButton.addEventListener("click", function(e) {
            e.preventDefault();
            // Get latest values of points
            savePointsFromForm();
            
            if (JSON.stringify(points.points)!==JSON.stringify(points.initialPoints)) {
                // Set back to initial values
                console.log("settingsControl.settingsResetButton: Points being reset to initialPoints");
                points.points = JSON.parse(JSON.stringify(points.initialPoints));
                savePoints();
                // Update numbers that appear in the form
                updateSettingsDisplay(points.points);
                // Update needed for visual displays
                updateDisplay[0] = true;
            } else {
                console.log("settingsControl.settingsResetButton: points already equal to initialPoints");
            }
        })
    };

    const init = function() {
        createSettingsBox();
        settingsButtonListener();
    }

    return {init, updateDisplay};
})()

// Code to create the graph
const graph = (function () {
    // Select colours to match overall scheme
    const colours = ["#66c5cc", "#dcb0f2", "#f6cf71", "#f89c74", "#87c55f", "#9eb9f3", "#fe88b1", "#c9db74", "#8be0a4", "#b497e7", "#b3b3b3"];

    // Use queens object to create datasets objects that will work with Chart.js formatting
    const createDatasets = function() {
        const datasets = new Array(competitionData.queens.length);
        const ppeScores = displayProgress.calculatePPE();

        for (let i = 0; i < competitionData.queens.length; i++) {
            datasets[i] = {label: competitionData.queens[i].name,
                           data: ppeScores[i].totalPoints,
                           fill: false,
                           borderColor: colours[i],
                           borderWidth: 3
            }
        }

        return datasets;
    };

    // Create the graph
    const createGraph = function() {
        // Create div and add header and footnote
        const chartDiv = document.getElementById("results-chart-div");

        const h3 = document.createElement("h3");
        h3.innerText = "Total Points by Episode";

        const footnote = document.createElement ("p");
        footnote.innerText = "For easier comparison, click on a queen's name to remove them from the chart";
        footnote.className = "results-chart-footnote";
        
        // Create datasets and labels objects
        const datasets = createDatasets();
        const labels = new Array(competitionData.episodes.length);
        for (let i = 0; i < competitionData.episodes.length; i++) {
            labels[i] = i + 1;
        };

        const canvas = document.createElement("canvas");
        canvas.id = "results-chart";

        // Select font characteristics that will be reused for a few different chart elements
        const fontFamily = "Rubik";
        const textColour = "black";

        // Create the chart
        const chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels, 
                datasets: datasets
            },
            options: {
                plugins: {
                    // Plot legend attributes
                    legend: { 
                        labels: {
                            font: {
                                family: fontFamily,
                                size: 16
                            },
                            color: textColour,
                            usePointStyle: true,
                            pointStyle: "line"
                        },
                        position: "bottom",
                        padding: 20
                    }
                },
            responsive: true,
            maintainAspectRatio: false,
            // x and y axes attributes
            scales: {
                x: {
                    // Axis title
                    title: {
                        text: "Episode",
                        display: true,
                        font: {
                            size: 18,
                            weight: 'bold',
                            family: fontFamily
                        },
                        color: textColour,
                        padding: {bottom: 20, top: 10}
                    },
                    // Axis tick marks
                    ticks: {
                        color: textColour,
                        font: {
                            size: 14,
                            family: fontFamily
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    // Axis title
                    title: {
                        text: "Total Points",
                        display: true,
                        font: {
                            size: 18,
                            weight: 'bold',
                            family: fontFamily
                        },
                        color: textColour,
                        padding: { bottom: 7}
                    },
                    // Axis tick marks
                    ticks: {
                        color: textColour,
                        font: {
                            size: 14,
                            family: fontFamily
                        }
                    }
                }
            }
        }
    });

    // Put everything together
    chartDiv.innerHTML = "";
    chartDiv.appendChild(h3);
    chartDiv.appendChild(canvas);
    chartDiv.appendChild(footnote);
    }

    return {createGraph}
})();



// Run everything
storage.getData();
getPoints();
updatePlacementsAll();
displayGeneric.init();
displayProgress.createTable();
control.eventListeners();
settingsControl.init();