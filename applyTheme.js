document.addEventListener("DOMContentLoaded", async () => {
    const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrsNO__MOTAFOlMKcNcPIlFuxUejUVB8hKWn5zWimVNLdjMVuFV6pmOf1LiPHzFmTKoNpDZM-Fd1G1/pub?output=csv";

    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();

        const rows = text.split("\n").slice(1); // remove header
        const today = new Date();
        today.setHours(0,0,0,0);

        let activeOccasion = null;

        for (let row of rows) {
            const [occasion, start, end] = row.split(",");

            if (!occasion || !start || !end) continue;

            const startDate = new Date(start.trim());
            const endDate = new Date(end.trim());

            startDate.setHours(0,0,0,0);
            endDate.setHours(0,0,0,0);

            if (today >= startDate && today <= endDate) {
                activeOccasion = occasion.trim().toLowerCase();
                break;
            }
        }

        if (!activeOccasion) return; // No active festival

        const body = document.body;

        // Clean previous festival classes
        body.classList.forEach(cls => {
            if (cls.startsWith("festival-")) body.classList.remove(cls);
            if (cls === "festive") body.classList.remove(cls);
            if (cls === activeOccasion) body.classList.remove(cls);
        });

        let path = window.location.pathname;
        if (path === "/") path = "/index.html";

        if (path === "/index.html") {
            body.classList.add(`festival-${activeOccasion}`);
        } else {
            body.classList.add("festive", activeOccasion);
        }

    } catch (error) {
        console.error("Theme fetch failed:", error);
    }
});
