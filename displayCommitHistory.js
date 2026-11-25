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
    const newDateWrapper = document.createElement("a");
    newDateWrapper.classList.add("timelineDateWrapper");
    newDateWrapper.dataset.date = date;
    newDateWrapper.href = `#${date}`;
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
    if(createNewSection === true){
        const newDateSection = document.createElement("div");
        newDateSection.classList.add("dateSection");
        newDateSection.id = commit.date;
        const newDateSectionHeading = document.createElement("h3");
        newDateSectionHeading.classList.add("dateSectionHeading");
        newDateSectionHeading.textContent = commit.date;
        newDateSection.appendChild(newDateSectionHeading);
        const toggleButton = document.createElement("button");
        toggleButton.textContent = "Toggle Section Details";
        toggleButton.dataset.isOpen = "false";
        toggleButton.classList.add("toggleButton");
        toggleButton.addEventListener("click", toggleSection);
        newDateSection.appendChild(toggleButton);
        detailsWrapper.appendChild(newDateSection);
        lastDetailedDateAdded = newDateSection;
    }
    const newCommitDetails = document.createElement("details");
    newCommitDetails.classList.add("commitDetails");
    const newCommitDetailsSummary = document.createElement("summary");
    newCommitDetailsSummary.classList.add("commitDetailsSummary");
    newCommitDetailsSummary.textContent = `${commit.dateTime.split(" ")[4]} ${commit.subject}`;
    newCommitDetails.appendChild(newCommitDetailsSummary);
    const newCommitDetailsInteriorWrapper = document.createElement("div");
    newCommitDetailsInteriorWrapper.classList.add("commitDetailsInteriorWrapper")
    const newCommitDetailsHash = createDetailedLine("Hash", commit.commit);
    newCommitDetailsInteriorWrapper.appendChild(newCommitDetailsHash);
    const newCommitDetailsNameTime = createDetailedLine("Details", commit.name + " " + commit.dateTime);
    newCommitDetailsInteriorWrapper.appendChild(newCommitDetailsNameTime);
    const newCommitDetailsBody = createDetailedLine("Body", commit.body);
    newCommitDetailsInteriorWrapper.appendChild(newCommitDetailsBody);
    const newCommitDetailsDiffs = createDetailedLine("Diffs", commit.diffs);
    newCommitDetailsInteriorWrapper.appendChild(newCommitDetailsDiffs);
    newCommitDetails.appendChild(newCommitDetailsInteriorWrapper);
    lastDetailedDateAdded.appendChild(newCommitDetails);
}

function createDetailedLine(topic, info){
    const newLinePara = document.createElement("p");
    const newLineTopic = document.createElement("span");
    newLineTopic.textContent = topic + ": ";
    newLineTopic.classList.add("topicSpan");
    const newLineInfo = document.createElement("span");
    newLineInfo.textContent = info;
    newLinePara.appendChild(newLineTopic);
    newLinePara.appendChild(newLineInfo);
    return newLinePara;
}

function toggleSection(e) {
    const sectionDetails = Array.from(e.target.parentElement.getElementsByTagName("details"));
    if (e.target.dataset.isOpen === "false"){
        sectionDetails.forEach(details => details.open = true);
        e.target.dataset.isOpen = "true";
    } else {
        sectionDetails.forEach(details => details.open = false);
        e.target.dataset.isOpen = "false";
    }

}