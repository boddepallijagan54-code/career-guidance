document.getElementById('assessment-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    let scores = {
        science: 0,
        humanities: 0,
        commerce: 0
    };

    for (const [name, value] of formData.entries()) {
        if (name.startsWith("q") && scores[value] !== undefined) {
            scores[value]++;
        }
    }

    let resultCluster = "Undecided Pathway";
    let maxScore = 0;

    for (const key in scores) {
        if (scores[key] > maxScore) {
            maxScore = scores[key];
            if (key === "science") resultCluster = "Science & Technology (STEM)";
            if (key === "humanities") resultCluster = "Humanities & Creative Arts";
            if (key === "commerce") resultCluster = "Commerce & Business Studies";
        }
    }

    fetch("/api/complete-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerCluster: resultCluster })
    })
        .then(res => {
            if (res.status === 401) {
                alert("Session expired. Please register again.");
                window.location.href = "/";
                return;
            }
            return res.json();
        })
        .then(data => {
            alert(`Assessment completed! Your pathway: ${data.careerCluster}`);
            window.location.href = "/dashboard";
        })
        .catch(err => {
            console.error(err);
            alert("Server error. Please try again.");
        });
});
