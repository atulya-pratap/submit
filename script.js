const SUPABASE_URL = "https://pzplzdgdlnjfwbklxbfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_N3pli21Nl9PtLXeFkiuizg_W5Aw5MpM";

document.getElementById('profile-form').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const btn = document.getElementById('submit-btn');
    const statusMsg = document.getElementById('status-message');
    
    // Reset states
    btn.textContent = "Saving to Database...";
    btn.disabled = true;
    statusMsg.textContent = "";
    statusMsg.className = "";

    try {
        const studentName = document.getElementById('student-name')?.value;
        if (!studentName) throw new Error("Student name is missing");

        // The ? safely checks if the element exists before trying to read its value.
        // It will no longer crash your script if there is a typo!
        const payload = {
            bio: document.getElementById('bio')?.value || null,
            hobbies: document.getElementById('hobbies')?.value || null,
            interests: document.getElementById('interest')?.value || null, // Maps to 'interests' in DB
            favourite_subject: document.getElementById('favourite_subject')?.value || null,
            instagram: document.getElementById('instagram')?.value || null,
            favourite_quote: document.getElementById('favourite_quote')?.value || null,
            photo_url: document.getElementById('photo_url')?.value || null
        };

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/student?name=eq.${encodeURIComponent(studentName)}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            // If Supabase rejects it (like a missing column), it throws the exact error here
            const errorData = await response.text();
            throw new Error(errorData); 
        }

        statusMsg.textContent = "✨ Profile successfully saved to the magazine!";
        statusMsg.className = "success";
        document.getElementById('profile-form').reset();

    } catch (error) {
        console.error("Crash Details:", error);
        
        // This will now print the EXACT error directly on your screen so it never hangs!
        statusMsg.textContent = `❌ Failed: ${error.message}`;
        statusMsg.className = "error";
        
    } finally {
        btn.textContent = "Submit Profile to Database";
        btn.disabled = false;
    }
});
