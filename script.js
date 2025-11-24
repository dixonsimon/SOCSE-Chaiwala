// --- Background Music Control ---
        const audio = document.getElementById("bg-music");
        const musicBtn = document.getElementById("music-btn");
        const musicBtnMain = document.getElementById("music-btn-main");
        
        // Optimistic UI: We assume it plays by default because of 'autoplay' attribute
        let isPlaying = true;

        // Try to confirm autoplay on load
        window.addEventListener('load', () => {
            audio.volume = 0.4;
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    isPlaying = true;
                    showToast("Vibes loaded automatically 🎧");
                })
                .catch(error => {
                    console.log("Autoplay prevented. Reverting UI.");
                    isPlaying = false;
                    updateMusicUI(false); 
                    showToast("Tap 'Vibe Check' to start music!");
                });
            }
        });

        function updateMusicUI(playing) {
            if (playing) {
                musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
                musicBtnMain.innerHTML = '<i class="fas fa-pause"></i> Pause Vibe';
            } else {
                musicBtn.innerHTML = '<i class="fas fa-play"></i>';
                musicBtnMain.innerHTML = '<i class="fas fa-music"></i> Vibe Check';
            }
        }

        function toggleMusic() {
            if (isPlaying) {
                audio.pause();
                updateMusicUI(false);
                showToast("Music Paused (Lame)");
            } else {
                audio.volume = 0.4;
                audio.play().then(() => {
                    updateMusicUI(true);
                    showToast("Vibes: Immaculate ✨");
                }).catch(err => {
                    console.log("Playback failed", err);
                    showToast("Browser blocked audio :(");
                });
            }
            isPlaying = !isPlaying;
        }

        // --- Aura Clicker ---
        let aura = 0;
        const auraDisplay = document.getElementById("aura-counter");
        
        function addAura() {
            aura += 100;
            auraDisplay.innerText = `Aura: +${aura}`;
            auraDisplay.style.opacity = "1";
            
            const texts = ["SHEESH", "W", "BASED", "CHAD", "SIGMA"];
            const text = texts[Math.floor(Math.random() * texts.length)];
            showToast(`+100 Aura (${text})`);
            
            if(aura === 1000) showToast("Achievement: Chai Addict 🏆");
        }

        // --- Slang Generator ---
        const slangs = [
            "Fanum Tax deducted from your GPA.",
            "Skibidi code requires sigma debugging.",
            "Don't ghost your assignments.",
            "Rizz up the invigilator?",
            "Academic comeback starts tomorrow (real).",
            "POV: You forgot the semicolon.",
            "It's giving... distinction.",
            "Lowkey cooked, highkey stressed."
        ];
        document.getElementById("slang-footer").innerText = `"${slangs[Math.floor(Math.random() * slangs.length)]}"`;

        // --- Toast Notification System ---
        function showToast(msg) {
            const toast = document.getElementById("toast");
            document.getElementById("toast-msg").innerText = msg;
            toast.classList.remove("translate-y-20");
            setTimeout(() => {
                toast.classList.add("translate-y-20");
            }, 3000);
        }

        // --- Easter Egg: Konami Code ---
        let keys = [];
        const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        
        window.addEventListener('keydown', (e) => {
            keys.push(e.key);
            keys.splice(-konami.length - 1, keys.length - konami.length);
            if (keys.join('').includes(konami.join(''))) {
                document.body.style.transform = "rotate(180deg)";
                showToast("🙃 AUSTRALIA MODE ACTIVATED");
                setTimeout(() => {
                     document.body.style.transform = "rotate(0deg)";
                }, 3000);
            }
        });

        console.log("%c STOP! ", "color: red; font-size: 50px; font-weight: bold;");
        console.log("%c Trying to hack the chai recipe? Nice try. ", "color: orange; font-size: 16px;");

        // --- NEW: GEMINI CHAT BOT LOGIC ---
        const chatWindow = document.getElementById("chat-window");
        const chatTrigger = document.getElementById("chat-trigger");
        const chatInput = document.getElementById("chat-input");
        const chatMessages = document.getElementById("chat-messages");
        const apiKey = "AIzaSyB-yMfQQERIBlKy7KD_A6jOUIevkHnT8Yg"; // Environment will provide this

        function toggleChat() {
            chatWindow.classList.toggle("open");
            if (chatWindow.classList.contains("open")) {
                chatTrigger.style.transform = "scale(0)";
                setTimeout(() => chatInput.focus(), 300);
            } else {
                chatTrigger.style.transform = "scale(1)";
            }
        }

        function sendQuickMessage(msg) {
            chatInput.value = msg;
            handleChatSubmit();
        }

        async function handleChatSubmit() {
            const text = chatInput.value.trim();
            if (!text) return;

            // 1. Add User Message
            addMessage(text, 'user');
            chatInput.value = "";
            
            // 2. Show Typing Indicator
            const loadingId = addTypingIndicator();
            
            // 3. Call Gemini API
            try {
                const responseText = await callGeminiAPI(text);
                removeMessage(loadingId);
                addMessage(responseText, 'bot');
            } catch (error) {
                console.error(error);
                removeMessage(loadingId);
                addMessage("My brain is buffering... (API Error) 💀", 'bot');
            }
        }

        function addMessage(text, sender) {
            const div = document.createElement("div");
            div.className = `message ${sender}`;
            // Simple markdown-ish parsing for bold text
            div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return div.id = "msg-" + Date.now();
        }

        function removeMessage(id) {
            const el = document.getElementById(id);
            if (el) el.remove();
        }

        function addTypingIndicator() {
            const div = document.createElement("div");
            div.className = `message bot typing-indicator`;
            div.innerHTML = `<span></span><span></span><span></span>`;
            div.id = "loading-" + Date.now();
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return div.id;
        }

        async function callGeminiAPI(userPrompt) {
            // Updated Persona Prompt: Cool, slang-heavy, but not obsessed with tea.
            const systemPrompt = `You are the 'SOCSE Chaiwala', a cool, slightly sarcastic, but helpful AI senior for Computer Science students. 
            Your personality:
            - You use Gen Z/Alpha slang (cooked, bet, cap, rizz, skibidi, sigma, lock in).
            - You are an expert in coding, engineering struggles, and surviving university.
            - You are helpful but funny. 
            - Do NOT bring up tea/chai in every response. Only if it's relevant.
            - If asked to draft an email, make it professional but slightly witty.
            - If asked about code, roast the bad code but explain the fix.
            - Keep responses SHORT (under 40 words) unless drafting an email.
            - Use emojis ✨💀.
            
            User says: "${userPrompt}"`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
            
            // Retry logic for exponential backoff
            const retries = 5;
            const delays = [1000, 2000, 4000, 8000, 16000];

            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: userPrompt }]
                            }],
                            systemInstruction: {
                                parts: [{ text: systemPrompt }]
                            }
                        })
                    });

                    if (!response.ok) {
                        if (response.status === 429) {
                           // If it's a rate limit error, throw to trigger retry
                           throw new Error("Rate Limited");
                        }
                        throw new Error("API Failed");
                    }
                    const data = await response.json();
                    return data.candidates[0].content.parts[0].text;

                } catch (err) {
                    if (i === retries - 1) throw err; // If last retry, fail
                    await new Promise(r => setTimeout(r, delays[i])); // Wait before retrying
                }
            }
        }

        // Handle Enter key in chat
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleChatSubmit();
        });