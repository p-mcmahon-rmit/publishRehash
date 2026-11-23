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
        const newLink = document.createElement("a");
        newLink.textContent = name;
        newLink.href = `/${name}`;
        branchLinksWrapper.appendChild(newLink);
    });
}

loadLinkData();