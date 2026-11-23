let timelineWrapper;
let detailsWrapper;
let lastOverviewDateAdded = null;
let lastDetailedDateAdded = null;
let dailyCommits = 1;

async function loadCommitData(branchName){
    try {
        const response = await fetch(`./${branchName}/${branchName}-commit-history.json`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        assignElements();
        updateNames(branchName);
        createDisplayHistory(result);
    } catch (error) {
        console.error(error.message);
    }
}

function assignElements(){
    timelineWrapper = document.getElementById("timeline-wrapper");
    detailsWrapper = document.getElementById("details-wrapper");
}

function updateNames(branchName){
    // update page title
    document.title = `${branchName} branch commit history`;
    document.getElementById("page-h1").textContent = `${branchName} branch commit history`;
}

function createDisplayHistory(commitHistoryObjectArray){
    commitHistoryObjectArray.forEach(commit => {
       addCommitToTimelines(commit);
    });
}

function addCommitToTimelines(commit){
    if(lastOverviewDateAdded && lastOverviewDateAdded.dataset.date === commit.date){
        dailyCommits += 1;
        lastOverviewDateAdded.querySelector(".commitCount").textContent = `${dailyCommits} commits`;
        createDetailedEntry(commit, false);
    } else {
        createOverviewEntry(commit.date);
        createDetailedEntry(commit, true);
    }
}

function createOverviewEntry(date){
    // should this be an a linked to #
    const newDateWrapper = document.createElement("button");
    newDateWrapper.classList.add("dateWrapper");
    newDateWrapper.dataset.date = date;
    const newDateLabel = document.createElement("label");
    newDateLabel.classList.add("dateLabel");
    newDateLabel.textContent = date;
    const newCommitCount = document.createElement("span");
    newCommitCount.classList.add("commitCount");
    dailyCommits = 1;
    newCommitCount.textContent = "1 commit";
    newDateWrapper.appendChild(newDateLabel);
    newDateWrapper.appendChild(newCommitCount);
    timelineWrapper.appendChild(newDateWrapper);
    lastOverviewDateAdded = newDateWrapper;
}

function createDetailedEntry(commit, createNewSection){
    console.log(createNewSection);
    if(createNewSection === true){
        const newDateSection = document.createElement("div");
        newDateSection.classList.add("dateSection");
        const newDateSectionHeading = document.createElement("h3");
        newDateSectionHeading.classList.add("dateSectionHeading");
        newDateSectionHeading.textContent = commit.date;
        newDateSection.appendChild(newDateSectionHeading);
        detailsWrapper.appendChild(newDateSection);
        lastDetailedDateAdded = newDateSection;
    }
    const newCommitDetails = document.createElement("details");
    newCommitDetails.classList.add("commitDetails");
    const newCommitDetailsSummary = document.createElement("summary");
    newCommitDetailsSummary.classList.add("commitDetailsSummary");
    newCommitDetailsSummary.textContent = `${commit.dateTime.split(" ")[4]} ${commit.subject}`;
    newCommitDetails.appendChild(newCommitDetailsSummary)
    lastDetailedDateAdded.appendChild(newCommitDetails);
}