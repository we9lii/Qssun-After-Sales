
const apiUrl = 'https://qssun-after-sales.onrender.com/api/users'; // Production URL

const users = [
    // Supervisor
    { name: 'Osama', role: 'MANAGER', username: 'Osama', password: '057255KF', phone: '0500000000' }, // Phone placeholder

    // Technicians (Phones from previous list)
    { name: 'Adeel', role: 'TECHNICIAN', username: 'adeel', password: '395787LZ', phone: '0571800657' },
    { name: 'Annas', role: 'TECHNICIAN', username: 'annas', password: '989572LH', phone: '0571065995' },
    { name: 'Avdesh', role: 'TECHNICIAN', username: 'avdesh', password: '441575FQ', phone: '0572380068' },
    { name: 'Dho-alqrneen', role: 'TECHNICIAN', username: 'dhoalqrneen', password: '209449CK', phone: '0571284772' },
    { name: 'Kamal', role: 'TECHNICIAN', username: 'kamal', password: '176362CL', phone: '0573043930' },
    { name: 'Nouman', role: 'TECHNICIAN', username: 'nouman', password: '717357TR', phone: '0598276060' },
    { name: 'Sabber', role: 'TECHNICIAN', username: 'sabber', password: '006370XV', phone: '0573085424' },
    { name: 'Saleh', role: 'TECHNICIAN', username: 'saleh', password: '555252QW', phone: '0552866060' },
    { name: 'Shawkat', role: 'TECHNICIAN', username: 'shawkat', password: '182880KW', phone: '0570376609' }
];

const createSpecificUsers = async () => {
    console.log("Creating specific users on Production DB...");

    for (const user of users) {
        const payload = {
            id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name: user.name,
            role: user.role,
            username: user.username,
            password: user.password,
            phone: user.phone,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
        };

        try {
            // Check if exists first (optional, but good for idempotency if running multiple times)
            // But for now valid POST will handle constraints or we just try to create.

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                console.log(`✅ Created: ${user.name} (${user.role})`);
            } else {
                const txt = await res.text();
                // Ignore "Validation error" if it means duplicate username to avoid noise, 
                // but usually we want to know.
                if (txt.includes('Validation error') || txt.includes('unique')) {
                    console.log(`⚠️  Exists/Skipped: ${user.name}`);
                } else {
                    console.log(`❌ Failed: ${user.name} - ${res.status} ${txt}`);
                }
            }

        } catch (error) {
            console.error(`❌ Network Error for ${user.name}:`, error.message);
        }

        // Small delay to be nice to the server
        await new Promise(r => setTimeout(r, 200));
    }
    console.log("Done.");
};

createSpecificUsers();
