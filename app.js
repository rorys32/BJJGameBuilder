// Version 1.1.001
// Main logic for BJJ Game Builder single-user app

// Load data from localStorage on startup
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

// Initialize UI
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
}

// Save profile data
function saveProfile() {
    data.profile.name = document.getElementById('name').value;
    data.profile.beltRank = document.getElementById('beltRank').value;
    data.profile.competitorMode = document.getElementById('competitorMode').checked;
    saveData();
    toggleCompetitorMode();
}

// Toggle Competitor Mode visibility
function toggleCompetitorMode() {
    document.getElementById('competitions').classList.toggle('hidden', !data.profile.competitorMode);
}

// Add class schedule
function addSchedule() {
    const dojoName = document.getElementById('dojoName').value;
    const days = document.getElementById('days').value.split(',').map(d => d.trim());
    const time = document.getElementById('time').value;
    data.schedules.push({ dojoName, days, time });
    saveData();
    updateScheduleList();
}

// Log attendance
function logAttendance() {
    const date = document.getElementById('attendanceDate').value;
    const attended = document.getElementById('attended').checked;
    data.attendance.push({ date, attended });
    saveData();
    updateAttendanceList();
}

// Log warmup
function logWarmup() {
    const date = document.getElementById('warmupDate').value;
    const intensity = document.getElementById('warmupIntensity').value;
    data.warmup.push({ date, intensity });
    saveData();
    updateWarmupList();
}

// Log technique
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

// Log roll
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

// Log check-in
function logCheckin() {
    const date = document.getElementById('checkinDate').value;
    const feeling = document.getElementById('checkinFeeling').value;
    const notes = document.getElementById('checkinNotes').value;
    data.checkin.push({ date, feeling, notes });
    saveData();
    updateCheckinList();
}

// Log competition
function logCompetition() {
    const date = document.getElementById('compDate').value;
    const eventName = document.getElementById('eventName').value;
    const results = document.getElementById('results').value;
    data.competitions.push({ date, eventName, results });
    saveData();
    updateCompetitionList();
}

// Update UI lists
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

// Save to localStorage
function saveData() {
    localStorage.setItem('bjjData', JSON.stringify(data));
}

// Export data as JSON
function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bjj_data.json';
    a.click();
}

// Import data from JSON file
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

// Initialize app
init();