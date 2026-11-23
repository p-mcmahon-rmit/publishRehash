let timelineWrapper;
let lastDateAdded = null;
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
}

function updateNames(branchName){
    // update page title
    document.title = `${branchName} branch commit history`;
    document.getElementById("page-h1").textContent = `${branchName} branch commit history`;
}

function createDisplayHistory(commitHistoryObjectArray){
    commitHistoryObjectArray.forEach(commit => {
       addCommitToTimeline(commit);
    });
}

function addCommitToTimeline(commit){
    if(lastDateAdded && lastDateAdded.dataset.date === commit.date){
        dailyCommits += 1;
        lastDateAdded.querySelector(".commitDetailsSummary").textContent = `${dailyCommits} commits`;
    } else {
        const newDateWrapper = document.createElement("div");
        newDateWrapper.classList.add("dateWrapper");
        newDateWrapper.dataset.date = commit.date;
        const newDateLabel = document.createElement("label");
        newDateLabel.classList.add("dateLabel");
        newDateLabel.textContent = commit.date;
        const newCommitDetails = document.createElement("details");
        newCommitDetails.classList.add("commitDetails");
        const newCommitDetailsSummary = document.createElement("summary");
        newCommitDetailsSummary.classList.add("commitDetailsSummary");
        dailyCommits = 1;
        newCommitDetailsSummary.textContent = "1 commit";
        newCommitDetails.appendChild(newCommitDetailsSummary);
        newDateWrapper.appendChild(newDateLabel);
        newDateWrapper.appendChild(newCommitDetails);
        timelineWrapper.appendChild(newDateWrapper);
        lastDateAdded = newDateWrapper;
    }
}