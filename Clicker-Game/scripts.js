const clickerBtn = document.getElementById('clickerBtn');
const clicksElement = document.getElementById('clicks');

let clicks = 0;

clickerBtn.addEventListener('click', () => {
    clicks++;
    clicksElement.textContent = clicks;
});