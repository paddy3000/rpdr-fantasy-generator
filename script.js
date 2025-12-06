// Links to images
const images = {
    arrowLeft: "images/leftArrow.png",
    arrowRight: "images/rightArrow.png",
    settings: "images/settings.png",
    close: "images/close.png",
    feedback: "images/feedback.png",
    home: "images/home.png"
}

// Display functions that will be used across different pages
const universalDisplay = (function() {
    // Close button that will appear within Settings and Info pop-ups
    const createCloseButton = function(id) {
        const closeButton = document.createElement("button");
        closeButton.id = id;
        closeButton.className = "close-button";
        const closeImage = document.createElement("img");
        closeImage.src = images.close;
        closeImage.className = "close-button-image";
        closeButton.appendChild(closeImage);
    
        return closeButton;
    }
    
    // Function to create Info pop-up
    const createInfoBox = function() {
        // Create divs
        const infoDiv = document.createElement("div");
        infoDiv.id = "info-div";
        const headerDiv = document.createElement("div");
        headerDiv.id = "info-header-div";

        document.body.appendChild(infoDiv);
        infoDiv.appendChild(headerDiv);
    
        // Create header
        const header = document.createElement("h3");
        header.innerText = "Info";
        headerDiv.appendChild(header);
    
        // Close button
        const closeButton = createCloseButton("info-close-button");
        headerDiv.appendChild(closeButton);
    
        // Add <p> elements
        const addParagraph = function(innerText) {
            const paragraph = document.createElement("p");
            paragraph.innerText = innerText;
            infoDiv.appendChild(paragraph);
        };
    
        addParagraph("Welcome to the RuPaul's Drag Race UK Season 7 fantasy generator");
        addParagraph("Use the arrows to move through the weeks and reassign placements for the queens to change the outcome of the competition");
        addParagraph(`To see the results summary press "See Results"`);
        addParagraph(`To reset the results back to the original placements from the competition press "Reset Results"`);
    
        // Set initial display to none and only pop-up when info button is clicked
        infoDiv.style.display = "none";

        // Add listener to close button
        universalControl.infoCloseListener();
    };

    // Create main heading for page
    const createHeading = function() {
        // Main heading div
        const headingDiv = document.createElement("div");
        headingDiv.id = "main-heading";
        document.body.appendChild(headingDiv);

        // Left and right divs to go inside main header div
        const leftDiv = document.createElement("div");
        leftDiv.id = "main-heading-left";
        const rightDiv = document.createElement("div");
        rightDiv.id = "main-heading-right";
        headingDiv.appendChild(leftDiv);
        headingDiv.appendChild(rightDiv);

        // Create main heading
        const heading = document.createElement("h1");
        heading.textContent = "Drag Race Fantasy Simulator";
        leftDiv.appendChild(heading);
    };

    // Create info button
    const createInfoButton = function() {
        // Get div that button will sit inside
        const rightDiv = document.getElementById("main-heading-right");

        // Create info button
        const info = document.createElement("button");
        info.id = "info-button";
        info.innerText = "i";
        rightDiv.appendChild(info);

        // Create info pop-up and add listener to button
        createInfoBox();
        universalControl.infoButtonListener();
    };

    // Create settings button
    const createSettingsButton = function() {
        // Get div that button will sit inside
        const rightDiv = document.getElementById("main-heading-right");

        // Create setting button
        const settings = document.createElement("button");
        settings.id = "settings-button";
        rightDiv.appendChild(settings);

        // Add image
        const settingsImg = document.createElement("img");
        settingsImg.src = images.settings;
        settingsImg.alt = "Settings";
        settings.appendChild(settingsImg);
    };

    // Create feedback button
    const createFeedbackButton = function() {
        // Get div that button will sit inside
        const rightDiv = document.getElementById("main-heading-right");
        
        // Create button
        const feedbackButton = document.createElement("button");
        feedbackButton.id = "feedback-button";

        // Link to feedback page
        const feedbackLink = document.createElement("a");
        feedbackLink.href = "feedback.html";

        // Add image
        const feedbackImg = document.createElement("img");
        feedbackImg.src = images.feedback;
        feedbackImg.alt = "Feedback";

        // Put everything together
        feedbackLink.appendChild(feedbackButton);
        feedbackButton.appendChild(feedbackImg);
        rightDiv.appendChild(feedbackLink);
    };

    // General function for creating buttons that should take boolean inputs
    const createButtons = function(createHome, createInfo, createSettings, createFeedback) {
        if (createInfo) {createInfoButton()};
        if (createSettings) {createSettingsButton()};
        if (createFeedback) {createFeedbackButton()};
    }

    // Create navigation div
    const createNavDiv = function() {
        const navDiv = document.createElement("div");
        navDiv.id = "nav-div";
        document.body.appendChild(navDiv);

        const navButtonsDiv = document.createElement("div");
        navButtonsDiv.id = "nav-buttons-div";
        navDiv.appendChild(navButtonsDiv);
    };

    const createPlacementsButton = function() {
        const navDiv = document.getElementById("nav-buttons-div")

        // Link to placements page
        const choosePlacementsLink = document.createElement("a");
        choosePlacementsLink.href = "placements.html";

        const choosePlacementsButton = document.createElement("button");
        choosePlacementsButton.id = "choose-placements-button";
        choosePlacementsButton.innerText = "Assign Placements";

        navDiv.appendChild(choosePlacementsLink);
        choosePlacementsLink.appendChild(choosePlacementsButton);
    }
    
    // Create button to go to results page
    const createResultsButton = function() {
        const navDiv = document.getElementById("nav-buttons-div");

        // Create link and button and put these together
        const resultsLink = document.createElement("a");
        resultsLink.href = "results.html";
        const resultsButton = document.createElement("button");
        resultsButton.textContent="See Results";
        resultsButton.id="see-results";

        resultsLink.appendChild(resultsButton);
        navDiv.appendChild(resultsLink);

        // Add event listener
        // resultsButton.addEventListener("click", storage.saveData);
    }

    // Option to reset queen progress
    // Event listener added individually to each page
    const createResetButton = function() {
        // Get div that button will sit inside
        const navDiv = document.getElementById("nav-buttons-div");
        
        // Create button
        const resetButton = document.createElement("button");
        resetButton.textContent="Reset Placements";
        resetButton.id="reset-results";
        navDiv.appendChild(resetButton);
    }

    // Create Choose Queens Button
    const createHomeButton = function() {
        // Get div that button will sit inside
        const navDiv = document.getElementById("nav-buttons-div");
        
        // Link to home page
        const homeLink = document.createElement("a");
        homeLink.href = "index.html";

        // Home button
        const homeButton = document.createElement("button");
        homeButton.id = "home-button";
        homeButton.innerText="Choose Queens";

        // Put everything together
        homeLink.appendChild(homeButton);
        navDiv.appendChild(homeLink);
    };

    const init = function(createHome, createInfo, createSettings) {
        createHeading();
        createButtons(createHome, createInfo, createSettings, true);
        const main = document.createElement("main");
        document.body.appendChild(main)
        createNavDiv();
        createInfoBox();
    }

    return {init, createHeading, createButtons, createNavDiv, createInfoBox, createResetButton, createCloseButton, createPlacementsButton, createResultsButton, createHomeButton};
})();

// // Create functions that will be used to control the site
const universalControl = (function () {
    // Object to track which pop-ups are open
    const popUpStatus = {
        infoOpen: false,
        settingsOpen: false
    };

    // Function to close the info pop-up
    const infoClose = function () {
        if (popUpStatus.infoOpen===true) {
            const infoDiv = document.getElementById("info-div");
            infoDiv.style.display = "none";
            popUpStatus.infoOpen = false;
        }
    };

    // Create listener for close button in info pop-up
    const infoCloseListener = function () {
        const infoCloseButton = document.getElementById("info-close-button");
        infoCloseButton.addEventListener("click", infoClose)
    };

    // Create listener for info button in main heading div at top of page
    const infoButtonListener = function () {
        // Select relevant elements
        const infoButton = document.getElementById("info-button");
        const infoDiv = document.getElementById("info-div");

        // If info pop-up is not being displayed then info button will display the pop-up
        // If info pop-up is already open then info button will close the pop-up
        infoButton.addEventListener("click", function() {
            if (popUpStatus.settingsOpen===false && popUpStatus.infoOpen===false) {
                infoDiv.style.display = "block";
                popUpStatus.infoOpen = true;
            } else if (popUpStatus.infoOpen===true) {
                infoClose();
            }
        });
    };

    // Function for resetting all queen results back to original competition placements
    // const resetResults = function() {
    //     for (let i = 0; i < queens.numberOfQueens; i++) {
    //             queens.queens[i].placement = queens.queens[i].initialPlacement.slice();
    //             queens.queens[i].return = queens.queens[i].initialReturn.slice();
    //         };

    //         storage.saveData();
    // }

    return {infoCloseListener, infoButtonListener, popUpStatus}; //resetResults
})()

// export {queens, competitionData, storage, currentStatus, universalDisplay, universalControl, images, points};
export {images, universalControl, universalDisplay}