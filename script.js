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

        // 1. Start with a completely empty package
        const payload = {};

        // 2. Helper function: Only add to the package if they typed something
        function addIfFilled(dbColumn, elementId) {
            const element = document.getElementById(elementId);
            if (element && element.value && element.value.trim() !== "") {
                payload[dbColumn] = element.value.trim();
            }
        }

        // 3. Check every form box one by one
        addIfFilled('roll_no', 'roll_number');
        addIfFilled('house', 'house');
        addIfFilled('bio', 'bio');
        addIfFilled('hobbies', 'hobbies');
        addIfFilled('interests', 'interest');
        addIfFilled('favourite_subject', 'favourite_subject');
        addIfFilled('favourite_book', 'favourite_book');
        addIfFilled('favourite_movie', 'favourite_movie');
        addIfFilled('achievements', 'achievements');
        addIfFilled('instagram', 'instagram');
        addIfFilled('favourite_quote', 'favourite_quote');
        addIfFilled('photo_url', 'photo_url');
        
        // --- NEW MEMORY FIELDS ---
        addIfFilled('favourite_song', 'favourite_song');
        addIfFilled('hidden_talent', 'hidden_talent');
        addIfFilled('navodaya_means', 'navodaya_means');
        addIfFilled('favourite_jnv_memory', 'favourite_jnv_memory');
        addIfFilled('what_i_will_miss', 'what_i_will_miss');
        addIfFilled('how_jnv_changed_me', 'how_jnv_changed_me');
        addIfFilled('future_goal', 'future_goal');
        addIfFilled('favourite_teacher', 'favourite_teacher');
        addIfFilled('favourite_teacher_reason', 'favourite_teacher_reason');
        addIfFilled('anything_else', 'anything_else');
        addIfFilled('anything_else_brief', 'anything_else_brief');

        // Safety check: Did they submit a completely blank form?
        if (Object.keys(payload).length === 0) {
            throw new Error("You didn't fill out any new fields to update!");
        }

        // 4. Send ONLY the filled data to Supabase
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
        
        // This will now print the EXACT error directly on your screen so it never hangs
        statusMsg.textContent = `❌ Failed: ${error.message}`;
        statusMsg.className = "error";
        
    } finally {
        btn.textContent = "Submit Profile to Database";
        btn.disabled = false;
    }
});
