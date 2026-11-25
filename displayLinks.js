const branchLinksWrapper = document.getElementById("branch-links-wrapper");

async function loadLinkData(){
    try {
        const response = await fetch("./published-branches.json");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        createLinks(result.branches);
    } catch (error) {
        console.error(error.message);
    }
}

function createLinks(branchNames){
    branchNames.forEach((name) => {
        const newBranchLink = document.createElement("a");
        newBranchLink.textContent = name;
        newBranchLink.href = `/${name}`;
        branchLinksWrapper.appendChild(newBranchLink);
        const newHistoryLink = document.createElement("a");
        newHistoryLink.textContent = `${name} commit history`;
        newHistoryLink.href = `${name}-commit-history-page.html`;
        branchLinksWrapper.appendChild(newHistoryLink);
    });
}

loadLinkData();