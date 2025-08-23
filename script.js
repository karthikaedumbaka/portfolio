const terminalOutput = document.getElementById('terminal-output');
const terminalWindow = document.getElementById('terminal-window');

const commands = {
    help: `\nAvailable Commands:\n  about         - About Me\n  skills        - Technical Skills\n  experience    - View My Work History & Roles\n  projects      - View My Personal & Professional Projects\n  achievements  - Achievements\n  education     - Education Details\n  contact       - Contact Info\n  links         - Social Links\n  resume        - View/Download My Resume\n  clear         - Clear Terminal (clears output, just like Unix terminals)\n  help          - Show This Help\n`,
    about: `\n👋 Hi, I'm KARTHIK AEDUMBAKA, a Software Engineer passionate about Automations, Machine Learning, and the potential of Generative AI.\n1. 🛠️ CURRENTLY BUILDING AUTOMATION TOOLS and internal systems at COGNIZANT, with 2+ years of experience.\n2. 🧰 Skilled in Python automation and developing efficient data processing workflows using Pandas, NumPy, and other libraries.\n3. 🤖 Experienced in LLM INTEGRATION and GenAI-BASED AUTOMATION to reduce manual effort and boost efficiency.\n4. 🧠 Strong focus on DATA VALIDATION, TRANSFORMATION, and ensuring system reliability across large datasets.\n5. 🚀 Driven by solving meaningful problems and exploring how AI can reshape software systems and develop workflows.\nFeel free to explore more using the 'projects', 'skills', or 'contact' commands!\n`,
    skill: null, // alias
    skills: `\nLanguages: Python, SQL, Solidity\nLibraries & Frameworks: Pandas, NumPy, Scikit-Learn, TensorFlow, Keras, Matplotlib, Seaborn, Plotly\nAI & NLP Tools: Hugging Face Transformers, LangChain, Generative AI (GenAI) and many more...\n`,
    experience: `\nSoftware Engineer – Cognizant (Feb 2022 – Present)\n- Automated Talend job execution via TMC APIs, removing 100% of manual TMC access and reducing cluster risks by 90%.\n- Enabled dynamic parameter injection directly through Python.\n- Implemented Excel log generation, smart job chaining, and environment-wise promotion flow.\n- Cut manual transition time by 95%.\nTechnologies: Python, Talend TMC REST API, Excel (openpyxl, pandas), Shell Scripting\n`,
    project: null, // alias
    projects: `\n<span class="project-heading">1. Talend TMC External Automation using Python  -- (COGNIZANT)</span>\n- Automated Talend job execution via TMC APIs, eliminating manual TMC access and reducing cluster risks by 90%.\n- Enabled dynamic parameter injection (task ID, table lists, para files) directly through Python.\n- Implemented Excel log generation, smart job chaining, and environment-wise promotion flow (Dev → Pre-Prod → Prod), cutting manual transition time by 95%.\n- Technologies: Python, Talend TMC REST API, Excel (openpyxl, pandas), Shell Scripting\n\n<span class="project-heading">2. Data Validation & Reporting / Data Scraping & Database Comparison  -- (COGNIZANT)</span>\n- Automated daily validation of 100,000+ records, cutting manual effort by 90%.\n- Created and deployed 10+ reusable scripts for efficiency and compliance.\n- Automated comparison of 50,000+ records/month, improving accuracy by 95%.\n- Built alert system for missing data, reducing follow-ups by 80%.\n- Optimized workflows, reducing data processing time by 1 month per quarter and manual work by 75%.\n- Technologies: Python, SQL, Email Automation, Database Scripting\n`,
    achievement: null, // alias
    achievements: `\nTop 5 Finalist – Cognizant Blue Bolt Innovation Challenge (Feb 2025)\n- Designed and developed a Generative AI-powered SQL Optimization System.\n- Improved query performance by auto-rewriting complex SQL based on data patterns.\n`,
    education: `\nB.Tech – Electronics and Communication Engineering (2018 – 2022)\nVel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology, Chennai, India\nCGPA: 7.5 / 10\n`,
    contact: `\nEmail: <a href="mailto:karthikaedumbaka01@gmail.com" class="terminal-link">karthikaedumbaka01@gmail.com</a>\nPhone: <a href="tel:8142881817" class="terminal-link">8142881817</a>\nLocation: Andhra Pradesh\n`,
    link: null, // alias
    links: `\nLeetcode: <a href="https://leetcode.com/u/AEDUMBAKA_KARTHIK/" target="_blank" rel="noopener" class="terminal-link">https://leetcode.com/u/AEDUMBAKA_KARTHIK/</a>\nLinkedIn: <a href="https://www.linkedin.com/in/aedumbaka-karthik/" target="_blank" rel="noopener" class="terminal-link">https://www.linkedin.com/in/aedumbaka-karthik/</a>\nGithub: <a href="https://github.com/karthikaedumbaka" target="_blank" rel="noopener" class="terminal-link">https://github.com/karthikaedumbaka</a>\n`,
    resume: null, // handled in logic
    resumes: null, // alias
    sudo: `\nPermission denied: You are not in the sudoers file. This incident will be reported.\n`,
    hack: `\nInitiating hack...\nJust kidding! Stay ethical :)\n`,
    clear: '',
};

// Map aliases to canonical commands
const commandAliases = {
    skill: 'skills',
    project: 'projects',
    achievement: 'achievements',
    link: 'links',
    resumes: 'resume',
};

// Command history
let commandHistory = JSON.parse(localStorage.getItem('cmdHistory') || '[]');
let historyIndex = commandHistory.length;

function saveHistory(cmd) {
    if (cmd && (commandHistory.length === 0 || commandHistory[commandHistory.length-1] !== cmd)) {
        commandHistory.push(cmd);
        if (commandHistory.length > 50) commandHistory.shift();
        localStorage.setItem('cmdHistory', JSON.stringify(commandHistory));
    }
    historyIndex = commandHistory.length;
}

function typeOutput(text, parent, callback) {
    let i = 0;
    function type() {
        if (i < text.length) {
            parent.innerHTML += text.charAt(i);
            i++;
            // Ensure the latest text is always visible
            parent.scrollIntoView({ behavior: "smooth", block: "end" });
            scrollToBottom();
            setTimeout(type, 7);
        } else if (callback) {
            callback();
        }
    }
    type();
}

let awaitingResumeDownload = false;

function handleCommand(cmd, outputLine, afterCallback) {
    let command = cmd.trim().toLowerCase();
    // Handle resume download prompt
    if (awaitingResumeDownload) {
        awaitingResumeDownload = false;
        if (command === 'yes' || command === 'y') {
            // Download the PDF
            const link = document.createElement('a');
            link.href = 'https://github.com/karthikaedumbaka/resume_download/blob/main/Karthik_Resume.pdf';
            link.download = 'karthik_Resume_new.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            outputLine.innerHTML = 'Downloading resume...<br>';
            if (afterCallback) afterCallback();
        } else {
            outputLine.innerHTML = 'Resume: <a href="https://github.com/karthikaedumbaka/resume_download/raw/main/karthik_Resume_new.pdf" target="_blank" rel="noopener" class="terminal-link">To Veiw Resume</a><br>';
            if (afterCallback) afterCallback();
        }
        return;
    }
    // Resolve aliases
    if (commandAliases[command]) {
        command = commandAliases[command];
    }
    if (command === 'resume') {
        typeOutput('Do you want to download the resume locally? (yes/no)\n', outputLine, () => {
            awaitingResumeDownload = true;
            if (afterCallback) afterCallback();
        });
        return;
    }
    if (command === 'clear') {
        terminalOutput.innerHTML = '';
        addPrompt();
        return;
    }
    if (commands[command]) {
        // If the output contains an anchor tag, render as HTML (no typing animation)
        if (command === 'projects') {
            // Letter-by-letter typewriter animation across all lines, with immediate styling
            const plain = commands[command]
                .replace(/<span class="project-heading">/g, '')
                .replace(/<\/span>/g, '');
            const lines = plain.trim().split(/\r?\n/);
            outputLine.innerHTML = '';
            // Prepare spans for each line
            const spans = lines.map(line => {
                const span = document.createElement('span');
                if (/^\d+\. /.test(line)) {
                    span.className = 'project-heading';
                } else if (/^- /.test(line)) {
                    span.className = 'project-detail';
                } else {
                    span.className = '';
                }
                return span;
            });
            // Append all spans and <br> to outputLine
            spans.forEach(span => {
                outputLine.appendChild(span);
                outputLine.appendChild(document.createElement('br'));
            });
            // Animate letter by letter across all spans
            let lineIdx = 0, charIdx = 0;
            function typeNextChar() {
                if (lineIdx >= lines.length) {
                    if (afterCallback) afterCallback();
                    return;
                }
                const line = lines[lineIdx];
                const span = spans[lineIdx];
                if (charIdx < line.length) {
                    span.innerHTML += line.charAt(charIdx);
                    span.scrollIntoView({ behavior: "smooth", block: "end" });
                    scrollToBottom();
                    charIdx++;
                    setTimeout(typeNextChar, 7);
                } else {
                    lineIdx++;
                    charIdx = 0;
                    setTimeout(typeNextChar, 7);
                }
            }
            typeNextChar();
        } else if (
            commands[command] && 
            (commands[command].includes('<a '))
        ) {
            outputLine.innerHTML = commands[command] + '<br>';
            if (afterCallback) afterCallback();
        } else if (command === 'skills') {
            // Letter-by-letter typewriter animation for skills with only the heading in yellow
            const plain = commands[command].trim().split(/\r?\n/);
            outputLine.innerHTML = '';
            const headings = [
                'Languages:',
                'Libraries & Frameworks:',
                'AI & NLP Tools:'
            ];
            // Prepare for each line: [headingSpan, detailSpan]
            const lineParts = plain.map(line => {
                for (const h of headings) {
                    if (line.startsWith(h)) {
                        const headingSpan = document.createElement('span');
                        headingSpan.className = 'skill-heading';
                        const detailSpan = document.createElement('span');
                        detailSpan.className = '';
                        return [headingSpan, detailSpan, h, line.slice(h.length)];
                    }
                }
                // Not a heading line
                const normalSpan = document.createElement('span');
                return [normalSpan, null, '', line];
            });
            // Append all spans and <br> to outputLine
            lineParts.forEach(([headingSpan, detailSpan]) => {
                outputLine.appendChild(headingSpan);
                if (detailSpan) outputLine.appendChild(detailSpan);
                outputLine.appendChild(document.createElement('br'));
            });
            let lineIdx = 0, charIdx = 0, part = 0;
            function typeNextChar() {
                if (lineIdx >= lineParts.length) {
                    if (afterCallback) afterCallback();
                    return;
                }
                const [headingSpan, detailSpan, h, rest] = lineParts[lineIdx];
                if (h) {
                    // Heading line: type heading, then details
                    if (part === 0 && charIdx < h.length) {
                        headingSpan.innerHTML += h.charAt(charIdx);
                        headingSpan.scrollIntoView({ behavior: "smooth", block: "end" });
                        scrollToBottom();
                        charIdx++;
                        setTimeout(typeNextChar, 7);
                    } else if (part === 0 && charIdx === h.length) {
                        part = 1;
                        charIdx = 0;
                        setTimeout(typeNextChar, 7);
                    } else if (part === 1 && charIdx < rest.length) {
                        detailSpan.innerHTML += rest.charAt(charIdx);
                        detailSpan.scrollIntoView({ behavior: "smooth", block: "end" });
                        scrollToBottom();
                        charIdx++;
                        setTimeout(typeNextChar, 7);
                    } else {
                        lineIdx++;
                        charIdx = 0;
                        part = 0;
                        setTimeout(typeNextChar, 7);
                    }
                } else {
                    // Not a heading line
                    if (charIdx < rest.length) {
                        headingSpan.innerHTML += rest.charAt(charIdx);
                        headingSpan.scrollIntoView({ behavior: "smooth", block: "end" });
                        scrollToBottom();
                        charIdx++;
                        setTimeout(typeNextChar, 7);
                    } else {
                        lineIdx++;
                        charIdx = 0;
                        setTimeout(typeNextChar, 7);
                    }
                }
            }
            typeNextChar();
        } else {
            // Always use typing animation for 'about' command
            if (command === 'about') {
                typeOutput(commands[command] + '\n', outputLine, afterCallback);
            } else {
                typeOutput(commands[command] + '\n', outputLine, afterCallback);
            }
        }
    } else if (command) {
        typeOutput(`\nCommand not found: ${command}\nType 'help' to see available commands.\n`, outputLine, afterCallback);
    }
}

function scrollToBottom() {
    terminalWindow.scrollTo({
        top: terminalWindow.scrollHeight,
        behavior: 'smooth'
    });
}

function addPrompt() {
    // Remove any old input fields
    const oldInputs = terminalOutput.querySelectorAll('input');
    oldInputs.forEach(input => input.setAttribute('disabled', 'disabled'));
    // Remove any old suggestion boxes
    const oldSuggestions = terminalOutput.querySelectorAll('.suggestion-box');
    oldSuggestions.forEach(s => s.remove());

    // Create prompt line
    const promptLine = document.createElement('div');
    promptLine.className = 'prompt-line';
    promptLine.innerHTML = `<span class="prompt">karthik@portfolio:~$</span>`;

    // Create input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'command-input';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.autofocus = true;
    promptLine.appendChild(input);
    terminalOutput.appendChild(promptLine);
    input.focus();
    scrollToBottom();

    // Suggestion box
    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'suggestion-box';
    suggestionBox.style.display = 'none';
    promptLine.appendChild(suggestionBox);

    // Blinking cursor effect
    input.style.caretColor = '#4fc3f7';

    // Command history navigation and suggestion/autocomplete
    let matches = [];
    let matchIndex = 0;

    function updateSuggestions() {
        const val = input.value.trim();
        const valLower = val.toLowerCase();
        if (!val) {
            suggestionBox.style.display = 'none';
            suggestionBox.innerHTML = '';
            matches = [];
            matchIndex = 0;
            return;
        }
        matches = Object.keys(commands).filter(cmd => cmd.toLowerCase().startsWith(valLower));
        if (matches.length > 0) {
            suggestionBox.style.display = 'block';
            suggestionBox.innerHTML = matches.map((cmd, idx) => `<div class="suggestion${idx === matchIndex ? ' selected' : ''}">${cmd}</div>`).join('');
        } else {
            suggestionBox.style.display = 'none';
            suggestionBox.innerHTML = '';
        }
    }

    input.addEventListener('input', updateSuggestions);

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            suggestionBox.style.display = 'none';
            const value = input.value;
            input.setAttribute('disabled', 'disabled');
            saveHistory(value);
            // Output the command as entered
            // Create a new output line for the result
            const outputLine = document.createElement('div');
            outputLine.className = 'output-line';
            terminalOutput.appendChild(outputLine);
            handleCommand(value, outputLine, addPrompt);
            scrollToBottom();
        } else if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex] || '';
                setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
                updateSuggestions();
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (matches.length > 0) {
                // Cycle through suggestions
                matchIndex = (matchIndex + 1) % matches.length;
                updateSuggestions();
            } else if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex] || '';
                setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
                updateSuggestions();
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
                updateSuggestions();
            }
            e.preventDefault();
        } else if (e.key === 'Tab') {
            if (matches.length > 0) {
                // Replace input with canonical command
                input.value = matches[matchIndex];
                updateSuggestions();
            }
            e.preventDefault();
        } else {
            matchIndex = 0;
        }
    });
}

// Initial welcome message
// Live date/time update
function updateDateTime() {
    const dt = document.getElementById('datetime');
    if (!dt) return;
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    dt.textContent = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
setInterval(updateDateTime, 1000);
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    const welcome = document.createElement('div');
    welcome.className = 'output-line';
    welcome.innerHTML = "Welcome to <span class='welcome-highlight'>AEDUMBAKA KARTHIK'S</span> Portfolio Terminal!<br>Type 'help' to see available commands.<br><br>";
    terminalOutput.appendChild(welcome);
    addPrompt();
    scrollToBottom();
});
