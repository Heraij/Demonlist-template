async function initDemonlist() {
    try {
        const [rankingResponse, levelsResponse] = await Promise.all([
            fetch('./ranking.json'),
            fetch('./levels.json')
        ]);

        const ranking = await rankingResponse.json();
        const levels = await levelsResponse.json();

        // Check if user is looking at a dedicated level page via URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const levelId = urlParams.get('level');

        if (levelId && levels[levelId]) {
            showDedicatedPage(levelId, levels[levelId], ranking);
        } else {
            showMainList(ranking, levels);
        }

    } catch (error) {
        console.error("Error running the demonlist:", error);
    }
}

// RENDER: Main List View
function showMainList(ranking, levels) {
    document.getElementById('main-view').classList.remove('hidden');
    document.getElementById('level-view').classList.add('hidden');
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';

    ranking.forEach((id, index) => {
        const level = levels[id];
        if (!level) return;

        const rank = index + 1;
        
        // Automatic YouTube thumbnail rendering
        const thumbnail = `https://img.youtube.com/vi/${level.ytId}/mqdefault.jpg`;

        const panel = document.createElement('a');
        panel.className = 'panel level-panel';
        panel.href = `?level=${id}`; // Appends ?level=id to URL on click

        panel.innerHTML = `
            <div class="level-info">
                <span class="rank">#${rank}</span>
                <span class="level-name">${level.name}</span>
            </div>
            <div class="thumb-container">
                <img src="${thumbnail}" alt="${level.name} Thumbnail">
            </div>
        `;
        listContainer.appendChild(panel);
    });
}

// RENDER: Dedicated Level Page View
function showDedicatedPage(id, level, ranking) {
    document.getElementById('main-view').classList.add('hidden');
    document.getElementById('level-view').classList.remove('hidden');
    const detailsContainer = document.getElementById('level-details');

    const rank = ranking.indexOf(id) + 1;

    let recordsHTML = '<p style="color:#333333; margin-top:10px;">No records yet.</p>';
    if (level.records && level.records.length > 0) {
        recordsHTML = level.records.map(r => `
            <div class="panel" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span><strong>${r.player}</strong></span>
                <a href="${r.link}" target="_blank" style="color:#eb871c; text-decoration:none;">Watch Proof</a>
            </div>
        `).join('');
    }

    detailsContainer.innerHTML = `
        <h1 style="font-size: 2.5rem; margin-bottom: 5px;">#${rank} - ${level.name}</h1>
        <p style="color: #b3b3b3; margin-bottom: 20px;">Created by <strong>${level.creator}</strong> | Verified by <strong>${level.verifier}</strong></p>
        
        <div class="video-wrapper">
            <iframe src="https://www.youtube.com/embed/${level.ytId}" frameborder="0" allowfullscreen></iframe>
        </div>

        <h3 style="margin-top: 40px; margin-bottom: 15px; border-bottom: 2px solid #333333; padding-bottom: 5px;">100% Victors</h3>
        ${recordsHTML}
    `;
}

window.onload = initDemonlist;
