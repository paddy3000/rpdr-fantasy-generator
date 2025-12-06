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
    // for (let j = weekFrom; j < competitionData.episodes.length; j++) {

    //     // If queen returns then set value of eliminated back to false
    //     if (queen.placements[j].returns===true && !isEliminated(queen.placements[j].placement)) {eliminated = false};

    //     // Logic for if queen is eliminated
    //     if (eliminated===true && queen.placements[j].placement!=="Out") {
    //         // Set all weeks where queen is eliminated to Out
    //         if ((queen.placements[j].returns===false) || !isEliminated(queen.placements[j].placement)) {
    //             queen.placements[j].placement="Out"
    //         };
    //     } 

    //     if (eliminated===false && (isEliminated(queen.placements[j].placement) || queen.placements[j].placement=="Out")) {
    //         // queen.placements[j].placement = j < competitionData.episodes.length-1 ? "Safe" : "Runner Up";
    //         queen.placements[j].placement = "Safe";

    //         // Set returns back to false since in the competition
    //         queen.placements[j].returns=false;
    //     };

    //     if (isEliminated(queen.placements[j].placement)) {eliminated=true};
    // }

    // Apply rules AFTER the chosen week
    for (let j = weekFrom; j < competitionData.episodes.length; j++) {

        const placement = queen.placements[j];

        // If queen returns AND is not Out → bring her back
        if (placement.returns === true && !isEliminated(placement.placement)) {eliminated = false}

        // If she is eliminated → force OUT for all following episodes
        if (eliminated === true) {
            placement.placement = "Out";
            continue;
        }

        // If she is not eliminated AND the current value says eliminated → fix it
        if (placement.placement=="Out") {placement.placement = "Safe"}

        // Update elimination state for the NEXT week based on current placement
        if (isEliminated(placement.placement)) {eliminated = true}
    }

    storage.saveData("queens");
}


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

const updatePlacementsAll = function() {
    console.log("placementControl.updatePlacementsAll: all placements updated")
    fillPlacements();
    for (let i = 0; i < competitionData.queens.length; i++){
        updatePlacements(1, competitionData.queens[i])
    }
}

// Function for resetting all queen results back to original competition placements
const resetResults = function() {
    for (let i = 0; i < competitionData.queens.length; i++) {
        for (let j = 0; j < competitionData.episodes.length; j++) {
            competitionData.queens[i].placements[j].placement = "Safe";
            competitionData.queens[i].placements[j].return = false;
        };
    };
    storage.saveData("queens");
}



export { points, isEliminated, updatePlacements, resetResults, updatePlacementsAll}