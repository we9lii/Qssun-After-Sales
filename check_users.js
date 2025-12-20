
const apiUrl = 'https://qssun-after-sales.onrender.com/api/users';

const checkUsers = async () => {
    console.log("Fetching users from:", apiUrl);
    try {
        const res = await fetch(apiUrl);
        if (res.ok) {
            const users = await res.json();
            console.log(`Connection Successful! Found ${users.length} users.`);
            users.forEach(u => {
                console.log(`- ${u.name} (${u.username})`);
            });
        } else {
            console.log("Failed to fetch:", res.status, await res.text());
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
};

checkUsers();
