// ================================
// CURRENT YEAR
// ================================

document.getElementById("year").textContent =
    new Date().getFullYear();


// ================================
// AI INSIGHT DEMO
// ================================

const generateInsightButton =
    document.getElementById("generateInsight");

const aiResult =
    document.getElementById("aiResult");


const insights = [
    "Your recent activity shows a stronger level of consistency compared with earlier periods. Maintaining regular contributions may help you build stronger development habits.",

    "Your GitHub activity suggests that you are actively working across multiple repositories. Focusing on fewer projects at a time could make your development efforts more focused.",

    "Your contribution activity has increased recently. Reviewing which projects generated the most activity could help you identify the areas where you are making the most progress."
];


generateInsightButton.addEventListener("click", function () {

    const randomIndex =
        Math.floor(Math.random() * insights.length);

    aiResult.innerHTML = `
        <p>${insights[randomIndex]}</p>
    `;

});


// ================================
// NAVIGATION
// ================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(event) {

        const targetId =
            this.getAttribute("href");

        if (targetId === "#") {
            return;
        }

        const target =
            document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});