async function loadDemonlist() {
    try {
        // 1. Fetch both JSON files simultaneously
        const [rankingResponse, levelsResponse] = await Promise.all([
            fetch('./ranking.json'),
            fetch('./levels.json')
        ]);

        const ranking = await rankingResponse.json();
        const levels = await levelsResponse.json();
        
        const listContainer = document.getElementById('list-container');

        // 2. Loop through the ranking array (this preserves the correct order)
        ranking.forEach((levelId, index) => {
            const levelData = levels[levelId];
            const rank = index + 1; // Array starts at 0, so Rank 1 is index + 1

            if (!levelData) {
                console.warn(`Warning: Level ID "${levelId}" found in ranking, but missing in levels.json`);
                return; 
            }

            // 3. Create and inject the HTML card
            const levelCard = document.createElement('div');
            levelCard.className = 'level-card';
            
            levelCard.innerHTML = `
                <div class="level-header">
                    <span class="rank">#${rank}</span>
                    <h2 class="level-name">${levelData.name}</h2>
                </div>
                <p class="creator">By ${levelData.creator} | Verified by ${levelData.verifier}</p>
                <iframe src="https://www.youtube.com/embed/${levelData.ytId}" frameborder="0" allowfullscreen></iframe>
            `;
            
            listContainer.appendChild(levelCard);
        });

    } catch (error) {
        console.error("Error loading the demonlist data:", error);
    }
}

window.onload = loadDemonlist;
