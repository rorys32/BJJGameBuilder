// Version 1.1.000
// Main logic for BJJ Game Builder single-user app

// Load data from localStorage on startup
let data = JSON.parse(localStorage.getItem('bjjData')) || {
    profile: { name: '', beltRank: 'White', competitorMode: false },
    schedules: [],
    attendance: [],
    techniques: [],
    competitions: []
};

// Initialize UI
function init() {
    // Profile
    document.getElementById('name').value = data.profile.name;
    document.getElementById('beltRank').value = data.profile.beltRank;
    document.getElementById('competitorMode').checked = data.profile.competitorMode;
    toggleCompetitorMode();

    // Load lists
    updateScheduleList();
    updateAttendanceList();
    updateTechniqueList();
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

// Log technique
function logTechnique() {
    const date = document.getElementById('techDate').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    data.techniques.push({ date, category, description });
    saveData();
    updateTechniqueList();
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

function updateTechniqueList() {
    const list = document.getElementById('techniqueList');
    list.innerHTML = data.techniques.map(t => `<li>${t.date} - ${t.category}: ${t.description}</li>`).join('');
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