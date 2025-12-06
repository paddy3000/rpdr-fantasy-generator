import {competitionData, storage} from "./control.js";

// Number of points for each placement
const points = (function () {
    const points =  [{id: "win",  placement: "Win", value: 5},
                     {id: "top2", placement: "Top 2", value: 5},
                     {id: "high", placement: "High", value: 4},
                     {id: "safe", placement: "Safe", value: 3},
                     {id: "low",  placement: "Low", value: 2},
                     {id: "btm",  placement: "Bottom", value: 1},
                     {id: "elim", placement: "Eliminated", value: 0}];

    const initialPoints = points.slice();

    return {points, initialPoints};
})();

const isEliminated = function(val) {
    return val==="Eliminated" || val==="Quit"
}

// Function to update placements for each queen based on what has been selected by user
const updatePlacements = function (weekFrom, queen) {     
    console.log(`placementControl.updatePlacements: Placements updated for ${queen.name} from ${weekFrom}`);
    // Initialise eliminated as false, will be updated for each week
    let eliminated = false;
    eliminated = isEliminated(queen.placements[weekFrom-1].placement);  
    // Cycle through the subsequent weeks
    for (let j = weekFrom; j < competitionData.episodes.length; j++) {

        // If queen returns then set value of eliminated back to false
        if (queen.placements[j].returns===true && !isEliminated(queen.placements[j].placement)) {eliminated = false};

        // Logic for if queen is eliminated
        if (eliminated===true && queen.placements[j].placement!=="Out") {
            // Set all weeks where queen is eliminated to Out
            if ((queen.placements[j].returns===false) || !isEliminated(queen.placements[j].placement)) {
                queen.placements[j].placement="Out"
            };
        } 

        if (eliminated===false) {
            // queen.placements[j].placement = j < competitionData.episodes.length-1 ? "Safe" : "Runner Up";
            queen.placements[j].placement = "Safe";

            // Set returns back to false since in the competition
            queen.placements[j].returns=false;
        } 
        console.log({j, eliminated, placement: queen.placements[j].placement});

        if (isEliminated(queen.placements[j].placement)) {eliminated=true};
    }

    storage.saveData("queens");
}

export { points, isEliminated, updatePlacements }