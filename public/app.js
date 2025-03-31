// Version 1.1.004
let data = JSON.parse(localStorage.getItem('bjjData')) || {
    profile: { name: '', beltRank: 'White', competitorMode: false },
    schedules: [],
    attendance: [],
    warmup: [],
    techniques: [],
    rolls: [],
    checkin: [],
    competitions: []
};

const bjjData = {/* Your JSON data unchanged; omitted for brevity */};

const translations = {
    en: {
        title: "BJJ Game Builder",
        profile: "Profile",
        schedule: "Class Schedule",
        attendance: "Attendance",
        warmup: "Warm Up",
        techniques: "Techniques (Per Class)",
        rolls: "Rolls",
        competitions: "Competitions",
        checkin: "Post-Class Check-In",
        data: "Data Management",
        classSchedule: "Ralph Gracie Class Schedule",
        saveProfile: "Save Profile",
        addSchedule: "Add Schedule",
        logAttendance: "Log Attendance",
        logWarmup: "Log Warm Up",
        logTechniques: "Log Class Techniques",
        logRoll: "Log Roll",
        logCompetition: "Log Competition",
        logCheckin: "Log Check-In",
        exportData: "Export Data",
        suggestion: "Suggested Technique:"
    },
    pt: {
        title: "Construtor de Jogo de BJJ",
        profile: "Perfil",
        schedule: "Horário das Aulas",
        attendance: "Presença",
        warmup: "Aquecimento",
        techniques: "Técnicas (Por Aula)",
        rolls: "Rolagens",
        competitions: "Competições",
        checkin: "Check-In Pós-Aula",
        data: "Gerenciamento de Dados",
        classSchedule: "Horário das Aulas Ralph Gracie",
        saveProfile: "Salvar Perfil",
        addSchedule: "Adicionar Horário",
        logAttendance: "Registrar Presença",
        logWarmup: "Registrar Aquecimento",
        logTechniques: "Registrar Técnicas da Aula",
        logRoll: "Registrar Rolagem",
        logCompetition: "Registrar Competição",
        logCheckin: "Registrar Check-In",
        exportData: "Exportar Dados",
        suggestion: "Técnica Sugerida:"
    }
};

let currentLang = 'en';

function init() {
    document.getElementById('name').value = data.profile.name;
    document.getElementById('beltRank').value = data.profile.beltRank;
    document.getElementById('competitorMode').checked = data.profile.competitorMode;
    toggleCompetitorMode();
    updateScheduleList();
    updateAttendanceList();
    updateWarmupList();
    updateTechniqueList();
    updateRollList();
    updateCheckinList();
    updateCompetitionList();
    updateLanguage();
    renderClassSchedule();
    setupAutocomplete();
    updateBeltStripe();
}

function saveProfile() {
    data.profile.name = document.getElementById('name').value;
    data.profile.beltRank = document.getElementById('beltRank').value;
    data.profile.competitorMode = document.getElementById('competitorMode').checked;
    saveData();
    toggleCompetitorMode();
    updateBeltStripe();
}

function toggleCompetitorMode() {
    document.getElementById('competitions').classList.toggle('hidden', !data.profile.competitorMode);
}

function addSchedule() {
    const dojoName = document.getElementById('dojoName').value;
    const days = document.getElementById('days').value.split(',').map(d => d.trim());
    const time = document.getElementById('time').value;
    data.schedules.push({ dojoName, days, time });
    saveData();
    updateScheduleList();
}

function logAttendance() {
    const date = document.getElementById('attendanceDate').value;
    const attended = document.getElementById('attended').checked;
    data.attendance.push({ date, attended });
    saveData();
    updateAttendanceList();
}

function logWarmup() {
    const date = document.getElementById('attendanceDate').value;
    if (!date || !data.attendance.some(a => a.date === date)) {
        alert("Please log attendance first!");
        return;
    }
    const intensity = document.getElementById('warmupIntensity').value;
    data.warmup.push({ date, intensity });
    saveData();
    updateWarmupList();
}

function logTechnique() {
    const date = document.getElementById('techDate').value;
    const technique = {
        date,
        takedown: {
            description: document.getElementById('takedown').value,
            partner: document.getElementById('takedownPartner').value
        },
        drills: {
            description: document.getElementById('drills').value,
            partner: document.getElementById('drillsPartner').value
        },
        specific: {
            description: document.getElementById('specific').value,
            partner: document.getElementById('specificPartner').value
        }
    };
    data.techniques.push(technique);
    saveData();
    updateTechniqueList();
}

function logRoll() {
    const roll = {
        date: document.getElementById('rollDate').value,
        partner: document.getElementById('rollPartner').value,
        notes: document.getElementById('rollNotes').value,
        intensity: document.getElementById('rollIntensity').value,
        submissions: document.getElementById('rollSubmissions').value,
        duration: document.getElementById('rollDuration').value
    };
    data.rolls.push(roll);
    saveData();
    updateRollList();
}

function logCheckin() {
    const date = document.getElementById('checkinDate').value;
    const feeling = document.getElementById('checkinFeeling').value;
    const notes = document.getElementById('checkinNotes').value;
    data.checkin.push({ date, feeling, notes });
    saveData();
    updateCheckinList();
}

function logCompetition() {
    const date = document.getElementById('compDate').value;
    const eventName = document.getElementById('eventName').value;
    const results = document.getElementById('results').value;
    data.competitions.push({ date, eventName, results });
    saveData();
    updateCompetitionList();
}

function updateScheduleList() {
    const list = document.getElementById('scheduleList');
    list.innerHTML = data.schedules.map(s => `<li>${s.dojoName}: ${s.days.join(', ')} at ${s.time}</li>`).join('');
}

function updateAttendanceList() {
    const list = document.getElementById('attendanceList');
    list.innerHTML = data.attendance.map(a => `<li>${a.date}: ${a.attended ? 'Attended' : 'Missed'}</li>`).join('');
}

function updateWarmupList() {
    const list = document.getElementById('warmupList');
    list.innerHTML = data.warmup.map(w => `<li>${w.date}: Intensity ${w.intensity}</li>`).join('');
}

function updateTechniqueList() {
    const list = document.getElementById('techniqueList');
    list.innerHTML = data.techniques.map(t => `
        <li>${t.date} - 
            Takedown: ${t.takedown.description} (w/ ${t.takedown.partner}), 
            Drills: ${t.drills.description} (w/ ${t.drills.partner}), 
            Specific: ${t.specific.description} (w/ ${t.specific.partner})
        </li>
    `).join('');
}

function updateRollList() {
    const list = document.getElementById('rollList');
    list.innerHTML = data.rolls.map(r => `
        <li>${r.date} - ${r.partner}: ${r.notes}, Intensity: ${r.intensity}, 
            Subs: ${r.submissions}, ${r.duration} min</li>
    `).join('');
}

function updateCheckinList() {
    const list = document.getElementById('checkinList');
    list.innerHTML = data.checkin.map(c => `<li>${c.date}: ${c.feeling}${c.notes ? ' - ' + c.notes : ''}</li>`).join('');
}

function updateCompetitionList() {
    const list = document.getElementById('competitionList');
    list.innerHTML = data.competitions.map(c => `<li>${c.date} - ${c.eventName}: ${c.results}</li>`).join('');
}

function saveData() {
    localStorage.setItem('bjjData', JSON.stringify(data));
}

function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bjj_data.json';
    a.click();
}

function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        data = JSON.parse(reader.result);
        saveData();
        init();
    };
    reader.readAsText(file);
}

function toggleLanguage() {
    currentLang = document.getElementById('langToggle').checked ? 'pt' : 'en';
    updateLanguage();
}

function updateLanguage() {
    document.querySelector('h1').textContent = translations[currentLang].title;
    document.querySelector('#profile h2').textContent = translations[currentLang].profile;
    document.querySelector('#schedule h2').textContent = translations[currentLang].schedule;
    document.querySelector('#attendance h2').textContent = translations[currentLang].attendance;
    document.querySelector('#warmup h2').textContent = translations[currentLang].warmup;
    document.querySelector('#techniques h2').textContent = translations[currentLang].techniques;
    document.querySelector('#rolls h2').textContent = translations[currentLang].rolls;
    document.querySelector('#competitions h2').textContent = translations[currentLang].competitions;
    document.querySelector('#checkin h2').textContent = translations[currentLang].checkin;
    document.querySelector('#data h2').textContent = translations[currentLang].data;
    document.querySelector('#classSchedule h2').textContent = translations[currentLang].classSchedule;
    document.querySelector('#profile button').textContent = translations[currentLang].saveProfile;
    document.querySelector('#schedule button').textContent = translations[currentLang].addSchedule;
    document.querySelector('#attendance button').textContent = translations[currentLang].logAttendance;
    document.querySelector('#warmup button').textContent = translations[currentLang].logWarmup;
    document.querySelector('#techniques button').textContent = translations[currentLang].logTechniques;
    document.querySelector('#rolls button').textContent = translations[currentLang].logRoll;
    document.querySelector('#competitions button').textContent = translations[currentLang].logCompetition;
    document.querySelector('#checkin button').textContent = translations[currentLang].logCheckin;
    document.querySelector('#data button').textContent = translations[currentLang].exportData;
    suggestTechniques();
}

function renderClassSchedule() {
    const calendar = document.getElementById('calendar');
    const schedule = [
        { day: 'Monday', times: ['Kids 5:00 PM - 6:00 PM', 'Adults 6:00 PM - 7:30 PM'] },
        { day: 'Tuesday', times: ['Kids 5:00 PM - 6:00 PM', 'Adults 6:00 PM - 7:30 PM'] },
        { day: 'Wednesday', times: ['Kids 5:00 PM - 6:00 PM', 'Adults 6:00 PM - 7:30 PM'] },
        { day: 'Thursday', times: ['Kids 5:00 PM - 6:00 PM', 'Adults 6:00 PM - 7:30 PM'] },
        { day: 'Friday', times: ['Kids 5:00 PM - 6:00 PM', 'Adults 6:00 PM - 7:30 PM'] },
        { day: 'Saturday', times: [] },
        { day: 'Sunday', times: [] }
    ];
    schedule.forEach((day, i) => {
        day.times.forEach((time, j) => {
            const block = document.createElement('div');
            block.className = 'time-block';
            block.style.gridColumn = i + 1;
            block.style.gridRow = j + 2;
            block.textContent = time;
            calendar.appendChild(block);
        });
    });
}

function suggestTechniques() {
    const date = document.getElementById('techDate').value;
    const suggestion = bjjData.schedule.find(s => s.date === date);
    const suggestionEl = document.getElementById('techSuggestion');
    if (suggestion) {
        suggestionEl.textContent = `${translations[currentLang].suggestion} ${suggestion.technique[currentLang]} (${suggestion.class_type})`;
    } else {
        suggestionEl.textContent = '';
    }
}

function setupAutocomplete() {
    const datalist = document.getElementById('techniqueList');
    bjjData.techniques.forEach(t => {
        const option = document.createElement('option');
        option.value = t.name[currentLang];
        datalist.appendChild(option);
    });
    ['takedown', 'drills', 'specific'].forEach(field => {
        const input = document.getElementById(field);
        input.addEventListener('change', (e) => {
            const selected = bjjData.techniques.find(t => t.name[currentLang] === e.target.value);
            if (selected) e.target.value = selected.notes[currentLang];
        });
    });
}

function updateBeltStripe() {
    const belt = document.getElementById('beltRank').value;
    const colors = { White: '#FFFFFF', Blue: '#0000FF', Purple: '#800080', Brown: '#8B4513', Black: '#000000' };
    document.getElementById('beltStripe').style.background = `linear-gradient(to right, ${colors[belt]} 70%, #000000 30%)`;
}

init();