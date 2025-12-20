const apiUrl = 'https://qssun-after-sales.onrender.com/api/reports';

const checkReports = async () => {
    console.log("Fetching reports from:", apiUrl);
    try {
        const res = await fetch(apiUrl);
        if (res.ok) {
            const reports = await res.json();
            console.log(`Connection Successful! Found ${reports.length} reports.`);
            if (reports.length > 0) {
                console.log("Latest Report:");
                const latest = reports[reports.length - 1];
                console.log(`- ID: ${latest.id}`);
                console.log(`- Customer: ${latest.customerName}`);
                console.log(`- Technician: ${latest.technicianName}`);
                console.log(`- Created At: ${latest.createdAt}`);
            }
        } else {
            console.log("Failed to fetch:", res.status, await res.text());
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
};

checkReports();
