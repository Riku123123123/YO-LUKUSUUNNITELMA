// ========== GLOBAALI DATA ==========
let exams = [];
let nextId = 1;

// ========== VIIKKOTAVOITE ==========
let weeklyTarget = 30;
let weeklyStudyLog = [];

// ========== LUKUJÄRJESTYS DATA ==========
const HOURS = [
  "8:00–9:00", "9:00–10:00", "10:00–11:00", "11:00–12:00", 
  "12:00–13:00", "13:00–14:00", "14:00–15:00", "15:00–16:00",
  "16:00–17:00", "17:00–18:00", "18:00–19:00", "19:00–20:00",
  "20:00–21:00", "21:00–22:00"
];

const DAYS = ["Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai", "Sunnuntai"];

// ========== MAALAUSMOODI ==========
let paintingMode = false;
let selectedValue = "";

// Aktiviteettien värikoodaus
const activityColors = {
  "LOUNAS": "#f59e0b",
  "LEPO": "#10b981", 
  "VAPAA": "#6b7280",
  "KERTAUS": "#8b5cf6",
  "TEHTÄVÄT": "#3b82f6",
  "KUUNTELE": "#ec4898"
};

function getActivityColor(text) {
  if (!text) return "#64748b";
  for (const [key, color] of Object.entries(activityColors)) {
    if (text.includes(key)) return color;
  }
  if (text.includes("Matematiikka") || text.includes("matematiikka")) return "#3b82f6";
  if (text.includes("Englanti") || text.includes("englanti")) return "#10b981";
  if (text.includes("Äidinkieli") || text.includes("äidinkieli")) return "#ec4898";
  if (text.includes("Ruotsi") || text.includes("ruotsi")) return "#f59e0b";
  if (text.includes("Kemia") || text.includes("kemia")) return "#8b5cf6";
  if (text.includes("Fysiikka") || text.includes("fysiikka")) return "#06b6d4";
  if (text.includes("Biologia") || text.includes("biologia")) return "#84cc16";
  if (text.includes("Historia") || text.includes("historia")) return "#f97316";
  return "#64748b";
}

// Oletuslukujärjestys
let defaultSchedule = {
  "Maanantai": {
    "8:00–9:00": "", "9:00–10:00": "matematiikka kertaus", "10:00–11:00": "matematiikka", "11:00–12:00": "matematiikka",
    "12:00–13:00": "LOUNAS", "13:00–14:00": "englannin kertaus", "14:00–15:00": "englanti", "15:00–16:00": "LEPO",
    "16:00–17:00": "", "17:00–18:00": "", "18:00–19:00": "", "19:00–20:00": "", "20:00–21:00": "", "21:00–22:00": ""
  },
  "Tiistai": {
    "8:00–9:00": "", "9:00–10:00": "matematiikka", "10:00–11:00": "matematiikka", "11:00–12:00": "matematiikka",
    "12:00–13:00": "LOUNAS", "13:00–14:00": "äidinkieli kertaus", "14:00–15:00": "äidinkieli", "15:00–16:00": "LEPO",
    "16:00–17:00": "", "17:00–18:00": "", "18:00–19:00": "", "19:00–20:00": "", "20:00–21:00": "", "21:00–22:00": ""
  },
  "Keskiviikko": {
    "8:00–9:00": "", "9:00–10:00": "matematiikka kertaus", "10:00–11:00": "matematiikka", "11:00–12:00": "matematiikka",
    "12:00–13:00": "LOUNAS", "13:00–14:00": "englanti", "14:00–15:00": "englanti", "15:00–16:00": "LEPO",
    "16:00–17:00": "", "17:00–18:00": "", "18:00–19:00": "", "19:00–20:00": "", "20:00–21:00": "", "21:00–22:00": ""
  },
  "Torstai": {
    "8:00–9:00": "", "9:00–10:00": "matematiikka", "10:00–11:00": "matematiikka", "11:00–12:00": "matematiikka",
    "12:00–13:00": "LOUNAS", "13:00–14:00": "äidinkieli", "14:00–15:00": "äidinkieli", "15:00–16:00": "LEPO",
    "16:00–17:00": "", "17:00–18:00": "", "18:00–19:00": "", "19:00–20:00": "", "20:00–21:00": "", "21:00–22:00": ""
  },
  "Perjantai": {
    "8:00–9:00": "", "9:00–10:00": "matematiikka kertaus", "10:00–11:00": "matematiikka", "11:00–12:00": "matematiikka",
    "12:00–13:00": "LOUNAS", "13:00–14:00": "englanti", "14:00–15:00": "englanti", "15:00–16:00": "LEPO",
    "16:00–17:00": "", "17:00–18:00": "", "18:00–19:00": "", "19:00–20:00": "", "20:00–21:00": "", "21:00–22:00": ""
  },
  "Lauantai": {
    "8:00–9:00": "VAPAA", "9:00–10:00": "VAPAA", "10:00–11:00": "VAPAA", "11:00–12:00": "VAPAA",
    "12:00–13:00": "VAPAA", "13:00–14:00": "VAPAA", "14:00–15:00": "VAPAA", "15:00–16:00": "VAPAA",
    "16:00–17:00": "VAPAA", "17:00–18:00": "VAPAA", "18:00–19:00": "VAPAA", "19:00–20:00": "VAPAA",
    "20:00–21:00": "VAPAA", "21:00–22:00": "VAPAA"
  },
  "Sunnuntai": {
    "8:00–9:00": "", "9:00–10:00": "Suunnittele seuraava viikko", "10:00–11:00": "VAPAA", "11:00–12:00": "VAPAA",
    "12:00–13:00": "VAPAA", "13:00–14:00": "VAPAA", "14:00–15:00": "VAPAA", "15:00–16:00": "VAPAA",
    "16:00–17:00": "VAPAA", "17:00–18:00": "VAPAA", "18:00–19:00": "VAPAA", "19:00–20:00": "VAPAA",
    "20:00–21:00": "VAPAA", "21:00–22:00": "VAPAA"
  }
};

let currentSchedule = {};

// ========== VIIKKOTAVOITE FUNKTIOT ==========
function loadWeeklyData() {
  const saved = localStorage.getItem("weekly_target");
  if (saved) {
    weeklyTarget = parseInt(saved) || 30;
  }
  
  const savedLog = localStorage.getItem("weekly_study_log");
  if (savedLog) {
    weeklyStudyLog = JSON.parse(savedLog);
  } else {
    initWeeklyLog();
  }
}

function saveWeeklyData() {
  localStorage.setItem("weekly_target", weeklyTarget);
  localStorage.setItem("weekly_study_log", JSON.stringify(weeklyStudyLog));
}

function initWeeklyLog() {
  const today = new Date();
  const startOfWeek = getStartOfWeek(today);
  
  weeklyStudyLog = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weeklyStudyLog.push({
      date: date.toISOString().split('T')[0],
      day: DAYS[i],
      hours: 0
    });
  }
  saveWeeklyData();
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function addStudyToWeeklyLog(hours) {
  const today = new Date().toISOString().split('T')[0];
  let todayLog = weeklyStudyLog.find(log => log.date === today);
  
  const startOfWeek = getStartOfWeek(new Date());
  const logStartOfWeek = weeklyStudyLog.length > 0 ? new Date(weeklyStudyLog[0].date) : null;
  
  if (!logStartOfWeek || startOfWeek.toDateString() !== logStartOfWeek.toDateString()) {
    initWeeklyLog();
    todayLog = weeklyStudyLog.find(log => log.date === today);
    if (todayLog) {
      todayLog.hours = hours;
    }
  } else if (todayLog) {
    todayLog.hours += hours;
  } else {
    weeklyStudyLog.push({
      date: today,
      day: DAYS[new Date().getDay() - 1] || "Maanantai",
      hours: hours
    });
  }
  
  saveWeeklyData();
  updateWeeklySummary();
}

function getWeeklyTotal() {
  return weeklyStudyLog.reduce((sum, day) => sum + day.hours, 0);
}

function getWeeklyProgress() {
  const total = getWeeklyTotal();
  return Math.min(100, (total / weeklyTarget) * 100);
}

function getDailyTarget() {
  return weeklyTarget / 7;
}

function getDaysLeftInWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  if (dayOfWeek === 0) return 0;
  return 7 - dayOfWeek;
}

function editWeeklyTarget() {
  const newTarget = prompt("Aseta viikkotavoite (tuntia/viikko):", weeklyTarget);
  if (newTarget && !isNaN(parseFloat(newTarget)) && parseFloat(newTarget) > 0) {
    weeklyTarget = parseFloat(newTarget);
    saveWeeklyData();
    updateWeeklySummary();
    showToast(`✅ Viikkotavoite asetettu: ${weeklyTarget}h/viikko (${(weeklyTarget/7).toFixed(1)}h/päivä)`);
  }
}

function updateWeeklySummary() {
  const container = document.getElementById("weeklySummary");
  if (!container) return;
  
  const total = getWeeklyTotal();
  const progress = getWeeklyProgress();
  const remaining = Math.max(0, weeklyTarget - total);
  const daysLeft = getDaysLeftInWeek();
  const avgNeeded = daysLeft > 0 ? remaining / daysLeft : 0;
  const dailyTarget = getDailyTarget();
  
  let statusColor = "";
  let statusText = "";
  if (progress >= 100) {
    statusColor = "#4ade80";
    statusText = "🎉 TAVOITE SAATU! Loistavaa!";
  } else if (progress >= 70) {
    statusColor = "#2dd4bf";
    statusText = "💪 Hyvä vauhti! Kohta tavoitteessa!";
  } else if (progress >= 40) {
    statusColor = "#facc15";
    statusText = "⚠️ Puolivälissä, jatka samaan malliin!";
  } else {
    statusColor = "#f87171";
    statusText = "🔥 Hieman jäljessä, naputtele lisää tunteja!";
  }
  
  let daysHtml = "";
  for (let log of weeklyStudyLog) {
    const dayProgress = Math.min(100, (log.hours / dailyTarget) * 100);
    daysHtml += `
      <div class="weekly-day">
        <span class="weekly-day-name">${log.day.substring(0, 2)}</span>
        <div class="weekly-day-bar-bg">
          <div class="weekly-day-bar" style="width: ${dayProgress}%; background: ${dayProgress >= 100 ? '#4ade80' : '#2dd4bf'}"></div>
        </div>
        <span class="weekly-day-hours">${log.hours.toFixed(1)}h</span>
      </div>
    `;
  }
  
  container.innerHTML = `
    <div class="weekly-header">
      <div class="weekly-title">
        <span>📅 VIIKKOTAVOITE</span>
        <span class="weekly-edit" onclick="editWeeklyTarget()">✏️ muokkaa</span>
      </div>
      <div class="weekly-stats">
        <div class="weekly-big-number">${total.toFixed(1)} / ${weeklyTarget} h</div>
        <div class="weekly-progress-bar">
          <div class="weekly-progress-fill" style="width: ${progress}%; background: ${statusColor}"></div>
        </div>
        <div class="weekly-info">
          <span>📊 ${progress.toFixed(0)}% viikkotavoitteesta</span>
          <span>⏰ Jäljellä: ${remaining.toFixed(1)} h</span>
          <span>⚡ Tarvitaan/pv: ${avgNeeded.toFixed(1)} h</span>
        </div>
        <div class="weekly-status" style="color: ${statusColor}">${statusText}</div>
      </div>
    </div>
    <div class="weekly-days">
      ${daysHtml}
    </div>
    <div class="weekly-tip">
      💡 <strong>${weeklyTarget}h/viikko = ${dailyTarget.toFixed(1)}h/päivä</strong><br>
      ${remaining <= 0 ? 'Olet jo saavuttanut viikkotavoitteesi! 🎉' : `Tarvitset vielä ${remaining.toFixed(1)} tuntia.`}
    </div>
  `;
}

// ========== LUKUJÄRJESTYKSEN FUNKTIOT ==========
function loadScheduleFromStorage() {
  const saved = localStorage.getItem("ultra_schedule");
  if (saved) {
    try {
      currentSchedule = JSON.parse(saved);
    } catch(e) {
      currentSchedule = JSON.parse(JSON.stringify(defaultSchedule));
    }
  } else {
    currentSchedule = JSON.parse(JSON.stringify(defaultSchedule));
  }
}

function saveScheduleToStorage() {
  localStorage.setItem("ultra_schedule", JSON.stringify(currentSchedule));
}

function setScheduleCell(day, timeSlot, value) {
  if (!currentSchedule[day]) currentSchedule[day] = {};
  currentSchedule[day][timeSlot] = value;
  saveScheduleToStorage();
  updateSingleCell(day, timeSlot, value);
}

function updateSingleCell(day, timeSlot, value) {
  const cell = document.querySelector(`.schedule-cell[data-day="${day}"][data-time="${timeSlot}"]`);
  if (cell) {
    const contentDiv = cell.querySelector(".cell-content");
    if (contentDiv) {
      contentDiv.innerHTML = escapeHtml(value) || "—";
    }
    const bgColor = getActivityColor(value);
    cell.style.background = `${bgColor}20`;
    cell.style.borderLeft = `3px solid ${bgColor}`;
  }
}

function renderTimetable() {
  const tbody = document.getElementById("timetableBody");
  if (!tbody) return;
  
  let html = "";
  
  for (let i = 0; i < HOURS.length; i++) {
    const timeSlot = HOURS[i];
    html += `<tr>`;
    html += `<td class="time-cell">${timeSlot}</td>`;
    
    for (let j = 0; j < DAYS.length; j++) {
      const day = DAYS[j];
      const content = currentSchedule[day]?.[timeSlot] || "";
      const bgColor = getActivityColor(content);
      html += `
        <td class="schedule-cell" data-day="${day}" data-time="${timeSlot}" style="background: ${bgColor}20; border-left: 3px solid ${bgColor};">
          <div class="cell-content">${escapeHtml(content) || "—"}</div>
          <div class="cell-actions">
            <button class="cell-edit-btn" onclick="event.stopPropagation(); openPicker('${day}', '${timeSlot}')">✏️</button>
            <button class="cell-clear-btn" onclick="event.stopPropagation(); clearScheduleCell('${day}', '${timeSlot}')">🗑️</button>
          </div>
        </td>
      `;
    }
    html += `</tr>`;
  }
  
  tbody.innerHTML = html;
  attachCellClickListeners();
}

function attachCellClickListeners() {
  document.querySelectorAll('.schedule-cell').forEach(cell => {
    const newCell = cell.cloneNode(true);
    cell.parentNode.replaceChild(newCell, cell);
    
    newCell.addEventListener('click', (e) => {
      if (e.target.classList.contains('cell-edit-btn') || 
          e.target.classList.contains('cell-clear-btn')) {
        return;
      }
      
      const day = newCell.getAttribute('data-day');
      const time = newCell.getAttribute('data-time');
      
      if (paintingMode && selectedValue) {
        setScheduleCell(day, time, selectedValue);
        showToast(`🎨 Maalattu: ${selectedValue} → ${day} ${time}`);
      } else {
        openPicker(day, time);
      }
    });
  });
}

function clearScheduleCell(day, timeSlot) {
  if (!currentSchedule[day]) currentSchedule[day] = {};
  currentSchedule[day][timeSlot] = "";
  saveScheduleToStorage();
  updateSingleCell(day, timeSlot, "");
  showToast(`🗑️ ${day} ${timeSlot} tyhjennetty`);
}

function openPicker(day, timeSlot) {
  const currentContent = currentSchedule[day]?.[timeSlot] || "";
  
  const modal = document.createElement("div");
  modal.className = "picker-modal";
  modal.innerHTML = `
    <div class="picker-modal-content">
      <div class="picker-header">
        <h4>✏️ Muokkaa: ${day} ${timeSlot}</h4>
        <button class="picker-close">&times;</button>
      </div>
      <div class="picker-categories">
        <div class="picker-category">
          <div class="picker-category-title">📚 Oppiaineet</div>
          <div class="picker-buttons">
            <button data-value="📐 Matematiikka">📐 Matematiikka</button>
            <button data-value="📐 Matematiikka kertaus">📐 Matematiikka kertaus</button>
            <button data-value="🇬🇧 Englanti">🇬🇧 Englanti</button>
            <button data-value="🇬🇧 Englanti kertaus">🇬🇧 Englanti kertaus</button>
            <button data-value="🇸🇪 Ruotsi">🇸🇪 Ruotsi</button>
            <button data-value="📖 Äidinkieli">📖 Äidinkieli</button>
            <button data-value="📖 Äidinkieli kertaus">📖 Äidinkieli kertaus</button>
            <button data-value="🧪 Kemia">🧪 Kemia</button>
            <button data-value="⚛️ Fysiikka">⚛️ Fysiikka</button>
            <button data-value="🧬 Biologia">🧬 Biologia</button>
            <button data-value="📜 Historia">📜 Historia</button>
            <button data-value="🧠 Psykologia">🧠 Psykologia</button>
            <button data-value="💭 Filosofia">💭 Filosofia</button>
            <button data-value="🏛️ Yhteiskuntaoppi">🏛️ Yhteiskuntaoppi</button>
            <button data-value="✝️ Uskonto">✝️ Uskonto</button>
            <button data-value="🌍 Maantiede">🌍 Maantiede</button>
            <button data-value="💚 Terveystieto">💚 Terveystieto</button>
          </div>
        </div>
        <div class="picker-category">
          <div class="picker-category-title">⚡ Toiminnot</div>
          <div class="picker-buttons">
            <button data-value="🍽️ LOUNAS">🍽️ LOUNAS</button>
            <button data-value="😴 LEPO">😴 LEPO</button>
            <button data-value="✨ VAPAA">✨ VAPAA</button>
            <button data-value="🔄 KERTAUS">🔄 KERTAUS</button>
            <button data-value="📝 TEHTÄVÄT">📝 TEHTÄVÄT</button>
            <button data-value="🎧 KUUNTELE">🎧 KUUNTELE</button>
            <button data-value="📺 KATSO">📺 KATSO</button>
            <button data-value="🏃 LIIKUNTA">🏃 LIIKUNTA</button>
            <button data-value="🧘 MEDITAATIO">🧘 MEDITAATIO</button>
          </div>
        </div>
      </div>
      <div class="picker-custom">
        <input type="text" id="pickerCustomInput" placeholder="Tai kirjoita oma..." value="${escapeHtml(currentContent)}">
        <button id="pickerCustomSave">💾 Tallenna</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = "flex";
  
  modal.querySelector(".picker-close").onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  
  modal.querySelectorAll(".picker-buttons button").forEach(btn => {
    btn.onclick = () => {
      const value = btn.getAttribute("data-value");
      setScheduleCell(day, timeSlot, value);
      modal.remove();
      showToast(`✅ ${day} ${timeSlot}: ${value}`);
    };
  });
  
  modal.querySelector("#pickerCustomSave").onclick = () => {
    const value = modal.querySelector("#pickerCustomInput").value.trim();
    setScheduleCell(day, timeSlot, value);
    modal.remove();
    showToast(`✅ ${day} ${timeSlot}: ${value || "tyhjennetty"}`);
  };
}

function showToast(message, duration = 2000) {
  const oldToast = document.querySelector(".toast-notification");
  if (oldToast) oldToast.remove();
  
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ========== MAALAUSMOODIN TOIMINNOT ==========
function enterPaintingMode(value, buttonElement) {
  paintingMode = true;
  selectedValue = value;
  
  document.querySelectorAll('.paint-btn').forEach(btn => {
    btn.classList.remove('active-paint');
  });
  
  buttonElement.classList.add('active-paint');
  document.body.style.cursor = 'crosshair';
  showToast(`🎨 MAALAUSMOODI: "${value}" → klikkaa soluja`, 3000);
}

function exitPaintingMode() {
  paintingMode = false;
  selectedValue = "";
  document.querySelectorAll('.paint-btn').forEach(btn => {
    btn.classList.remove('active-paint');
  });
  document.body.style.cursor = '';
  showToast(`✅ Maalausmoodi pois päältä`);
}

function initQuickButtons() {
  const container = document.querySelector(".quick-buttons");
  if (!container) return;
  
  container.innerHTML = '';
  
  const items = [
    "📐 Matematiikka", "📐 Matematiikka kertaus", "🇬🇧 Englanti", "🇬🇧 Englanti kertaus",
    "🇸🇪 Ruotsi", "📖 Äidinkieli", "📖 Äidinkieli kertaus", "🧪 Kemia", "⚛️ Fysiikka",
    "🧬 Biologia", "📜 Historia", "🧠 Psykologia", "💭 Filosofia", "🏛️ Yhteiskuntaoppi",
    "✝️ Uskonto", "🌍 Maantiede", "💚 Terveystieto",
    "🍽️ LOUNAS", "😴 LEPO", "✨ VAPAA", "🔄 KERTAUS", "📝 TEHTÄVÄT", "🎧 KUUNTELE"
  ];
  
  items.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "quick-btn paint-btn";
    btn.textContent = item;
    btn.setAttribute("data-value", item);
    btn.onclick = (e) => {
      e.stopPropagation();
      enterPaintingMode(item, btn);
    };
    container.appendChild(btn);
  });
  
  const exitBtn = document.createElement("button");
  exitBtn.className = "quick-btn exit-paint-btn";
  exitBtn.textContent = "🚫 Poistu maalausmoodista";
  exitBtn.onclick = exitPaintingMode;
  container.appendChild(exitBtn);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && paintingMode) {
    exitPaintingMode();
  }
});

function loadAnnaSchedule() {
  if (confirm("Lataa Annan mallilukujärjestys? Nykyinen järjestys korvataan.")) {
    currentSchedule = JSON.parse(JSON.stringify(defaultSchedule));
    saveScheduleToStorage();
    renderTimetable();
    showToast("✅ Annan mallilukujärjestys ladattu!");
  }
}

function clearSchedule() {
  if (confirm("Tyhjennetäänkö koko lukujärjestys?")) {
    for (let day of DAYS) {
      currentSchedule[day] = {};
      for (let time of HOURS) {
        currentSchedule[day][time] = "";
      }
    }
    saveScheduleToStorage();
    renderTimetable();
    showToast("🗑️ Lukujärjestys tyhjennetty");
  }
}

function exportSchedule() {
  const dataStr = JSON.stringify(currentSchedule, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lukujarjestys_${new Date().toISOString().slice(0,19)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("💾 Lukujärjestys viety JSON-tiedostoon");
}

function importSchedule(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (typeof imported === "object" && imported !== null) {
        currentSchedule = imported;
        saveScheduleToStorage();
        renderTimetable();
        showToast("📂 Lukujärjestys tuotu onnistuneesti!");
      } else {
        throw new Error("Virheellinen tiedostomuoto");
      }
    } catch(err) {
      alert("Virhe: Tiedosto ei ole kelvollinen lukujärjestys-JSON.");
    }
  };
  reader.readAsText(file);
}

// Motivaatiolauseet
const motivationQuotes = [
  "Menestys ei ole sattumaa. Se on kovaa työtä, sinnikkyyttä ja oppimista.",
  "Jokainen tunti on askel lähempänä tavoitetta. Pysy vahvana! 💪",
  "Yo-koetta ei pelätä, sitä harjoitellaan. Sinä pystyt tähän!",
  "Pienikin askel eteenpäin on voitto. Jatka samaan malliin!",
  "Tämäkin päivä on mahdollisuus tulla paremmaksi kuin eilen.",
  "Kun tahtoo tarpeeksi, keinoja löytyy. Usko itseesi!",
  "Jokainen opiskeltu asia on siemen tulevaisuuden menestykselle.",
  "Tee tänään jotain, mistä huominen sinut kiittää.",
  "Et voi voittaa, jos et aloita. Olet jo aloittanut - hienoa!",
  "Vaikeimmat hetket erottavat tekijät haaveilijoista. Sinä olet tekijä!"
];

// ========== KOKEIDEN DATA ==========
function loadData() {
  const saved = localStorage.getItem("custom_exams_data");
  if (saved) {
    exams = JSON.parse(saved);
    nextId = Math.max(0, ...exams.map(e => e.id), 0) + 1;
  } else {
    exams = [];
    nextId = 1;
  }
}

function saveData() {
  localStorage.setItem("custom_exams_data", JSON.stringify(exams));
}

// ========== APUFUNKTIOT ==========
function updateStreak(exam, addedDate = new Date()) {
  const todayStr = addedDate.toDateString();
  if (!exam.streak?.lastDate || new Date(exam.streak.lastDate).toDateString() !== todayStr) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (exam.streak?.lastDate && new Date(exam.streak.lastDate).toDateString() === yesterday.toDateString()) {
      exam.streak.count = (exam.streak.count || 0) + 1;
    } else {
      exam.streak = exam.streak || { lastDate: null, count: 0 };
      exam.streak.count = 1;
    }
    exam.streak.lastDate = addedDate.toISOString();
  }
  if (!exam.streak) exam.streak = { lastDate: addedDate.toISOString(), count: 1 };
}

function addStudyToExam(examId, hours) {
  const exam = exams.find(e => e.id === examId);
  if (!exam) return;
  if (isNaN(hours) || hours <= 0) hours = 1;
  const now = new Date();
  exam.studied += hours;
  exam.history = exam.history || [];
  exam.history.unshift({ value: hours, time: now.toLocaleString('fi-FI'), timestamp: now.getTime() });
  if (exam.history.length > 12) exam.history.pop();
  updateStreak(exam, now);
  saveData();
  
  addStudyToWeeklyLog(hours);
  
  renderAllExams();
  updateAISummary();
}

function quickAdd(examId, hours) {
  addStudyToExam(examId, hours);
}

function resetExam(examId) {
  if (!confirm("Nollataanko kaikki tunnit tästä kokeesta?")) return;
  const exam = exams.find(e => e.id === examId);
  if (exam) {
    exam.studied = 0;
    exam.history = [];
    exam.streak = { lastDate: null, count: 0 };
    saveData();
    renderAllExams();
    updateAISummary();
  }
}

function deleteExam(examId) {
  if (!confirm("Poistetaanko tämä koe?")) return;
  exams = exams.filter(e => e.id !== examId);
  saveData();
  renderAllExams();
  updateAISummary();
}

function addExamFromSelect() {
  const select = document.getElementById("examSelect");
  const selectedValue = select.value;
  if (!selectedValue) {
    alert("Valitse aine listasta!");
    return;
  }
  const [name, date, targetHours] = selectedValue.split("|");
  if (exams.some(e => e.name === name)) {
    alert(`"${name}" on jo lisätty!`);
    return;
  }
  const newExam = {
    id: nextId++,
    name: name,
    date: date,
    targetHours: parseFloat(targetHours),
    studied: 0,
    history: [],
    streak: { lastDate: null, count: 0 },
    createdAt: new Date().toISOString()
  };
  exams.push(newExam);
  saveData();
  renderAllExams();
  updateAISummary();
  select.value = "";
  alert(`✅ "${name}" lisätty!`);
}

function addCustomExam() {
  const name = document.getElementById("customExamName").value.trim();
  const date = document.getElementById("customExamDate").value;
  const target = parseFloat(document.getElementById("customExamTarget").value);
  if (!name || !date || isNaN(target) || target <= 0) {
    alert("Täytä kaikki kentät!");
    return;
  }
  if (exams.some(e => e.name === name)) {
    alert(`"${name}" on jo lisätty!`);
    return;
  }
  const newExam = {
    id: nextId++,
    name: name,
    date: date + ":00",
    targetHours: target,
    studied: 0,
    history: [],
    streak: { lastDate: null, count: 0 },
    createdAt: new Date().toISOString()
  };
  exams.push(newExam);
  saveData();
  renderAllExams();
  updateAISummary();
  document.getElementById("customExamName").value = "";
  document.getElementById("customExamDate").value = "2026-09-16T09:00";
  document.getElementById("customExamTarget").value = "40";
  document.getElementById("customExamForm").style.display = "none";
  alert(`✅ "${name}" lisätty!`);
}

// ========== LASKENTAFUNKTIOT ==========
function getDailyNeed(exam) {
  const now = new Date();
  const examDate = new Date(exam.date);
  if (examDate <= now) return 0;
  const daysLeft = Math.max(1, Math.ceil((examDate - now) / (1000 * 3600 * 24)));
  const hoursNeeded = Math.max(0, exam.targetHours - exam.studied);
  return hoursNeeded / daysLeft;
}

function computeProjected(exam) {
  const now = new Date();
  const examDate = new Date(exam.date);
  if (examDate <= now) return exam.studied;
  if (exam.studied === 0) return 0;
  
  const createdAt = exam.createdAt ? new Date(exam.createdAt) : new Date(exam.date);
  const daysSinceStart = Math.max(1, Math.ceil((now - createdAt) / (1000 * 3600 * 24)));
  const studyRate = exam.studied / daysSinceStart;
  const daysRemaining = Math.max(0, Math.ceil((examDate - now) / (1000 * 3600 * 24)));
  const projected = exam.studied + (studyRate * daysRemaining);
  
  return Math.min(projected, exam.targetHours * 2);
}

function getGradePrediction(projected, target) {
  const ratio = projected / target;
  if (ratio >= 0.95) return { grade: "L / E", emoji: "🏆", color: "#4ade80", msg: "Erinomainen vauhti!" };
  if (ratio >= 0.8) return { grade: "E / M", emoji: "💪", color: "#2dd4bf", msg: "Tavoite saavutettavissa" };
  if (ratio >= 0.6) return { grade: "C / M", emoji: "⚠️", color: "#facc15", msg: "Kiristä tahtia" };
  if (ratio >= 0.4) return { grade: "B / C", emoji: "😰", color: "#fb923c", msg: "Tarvitset lisää opiskelua" };
  return { grade: "I (hylätty)", emoji: "💀", color: "#f87171", msg: "Kriittinen vaje - aloita heti!" };
}

// ========== AI YHTEENVETO ==========
function updateAISummary() {
  const container = document.getElementById("aiSummaryContent");
  if (!container) return;
  
  if (exams.length === 0) {
    container.innerHTML = `<p>✨ Lisää kokeita nähdäksesi AI-analyysin edistymisestäsi.</p>`;
    return;
  }
  
  const totalTarget = exams.reduce((sum, e) => sum + e.targetHours, 0);
  const totalStudied = exams.reduce((sum, e) => sum + e.studied, 0);
  const totalProgress = (totalStudied / totalTarget) * 100;
  const avgStreak = exams.length ? Math.floor(exams.reduce((sum, e) => sum + (e.streak?.count || 0), 0) / exams.length) : 0;
  const finishedExams = exams.filter(e => e.studied >= e.targetHours).length;
  const bestExam = exams.reduce((best, e) => (e.studied / e.targetHours) > (best.studied / best.targetHours) ? e : best, exams[0]);
  const worstExam = exams.reduce((worst, e) => (e.studied / e.targetHours) < (worst.studied / worst.targetHours) ? e : worst, exams[0]);
  
  let motivationMessage = "";
  if (totalProgress >= 80) motivationMessage = "🎉 Mahtavaa! Olet erinomaisella tiellä kohti kokeita!";
  else if (totalProgress >= 50) motivationMessage = "💪 Hyvä vauhti! Pysy aikataulussa!";
  else if (totalProgress >= 25) motivationMessage = "🌱 Hyvä alku! Nyt on aika nostaa panoksia!";
  else motivationMessage = "⚡ Nyt on aika aloittaa tosissaan! Sinä pystyt!";
  
  const aiSuggestion = getAISuggestion();
  
  container.innerHTML = `
    <div class="ai-stats-grid">
      <div class="ai-stat-card">📊 Yhteensä: ${totalStudied.toFixed(1)} / ${totalTarget} h</div>
      <div class="ai-stat-card">📈 Kokonaisprogressi: ${totalProgress.toFixed(1)}%</div>
      <div class="ai-stat-card">🔥 Keskimääräinen putki: ${avgStreak} pv</div>
      <div class="ai-stat-card">🏆 Valmiit kokeet: ${finishedExams}/${exams.length}</div>
    </div>
    <div class="ai-stat-card" style="margin-top: 10px;">
      <strong>⭐ Vahvin aine:</strong> ${bestExam?.name || "-"} (${((bestExam?.studied / bestExam?.targetHours)*100 || 0).toFixed(1)}%)<br>
      <strong>⚠️ Kehitettävä:</strong> ${worstExam?.name || "-"} (${((worstExam?.studied / worstExam?.targetHours)*100 || 0).toFixed(1)}%)
    </div>
    <div style="margin-top: 12px; padding: 10px; background: rgba(45,212,191,0.15); border-radius: 1rem;">
      <strong>🤖 AI-suositus:</strong> ${aiSuggestion}
    </div>
    <div style="margin-top: 10px; padding: 8px; background: rgba(139,92,246,0.15); border-radius: 1rem; text-align: center;">
      💡 ${motivationMessage}
    </div>
  `;
}

function getAISuggestion() {
  const now = new Date();
  const upcomingExams = exams.filter(e => new Date(e.date) > now).sort((a,b) => new Date(a.date) - new Date(b.date));
  if (upcomingExams.length === 0) return "Kaikki kokeet ovat ohi! Toivottavasti meni hyvin! 🎓";
  
  const nextExam = upcomingExams[0];
  const daysLeft = Math.max(1, Math.ceil((new Date(nextExam.date) - now) / (1000 * 3600 * 24)));
  const neededDaily = (nextExam.targetHours - nextExam.studied) / daysLeft;
  
  if (neededDaily > 4) {
    return `⚠️ ${nextExam.name} on ${daysLeft} päivän päästä! Tarvitset ${neededDaily.toFixed(1)}h/päivä.`;
  } else if (neededDaily > 2) {
    return `📚 ${nextExam.name} vaatii ${neededDaily.toFixed(1)}h/päivä. Tee päivittäinen rutiini.`;
  } else if (neededDaily > 0.5) {
    return `✅ ${nextExam.name} on hyvällä mallilla! (${neededDaily.toFixed(1)}h/päivä)`;
  } else {
    return `🎉 ${nextExam.name} on hyvin hallinnassa! Kertaa kevyesti.`;
  }
}

// ========== TILASTOT ==========
function showStatsModal() {
  const content = document.getElementById("statsContent");
  if (!content) return;
  
  const totalTarget = exams.reduce((sum, e) => sum + e.targetHours, 0);
  const totalStudied = exams.reduce((sum, e) => sum + e.studied, 0);
  const avgStreak = exams.length ? Math.floor(exams.reduce((sum, e) => sum + (e.streak?.count || 0), 0) / exams.length) : 0;
  const bestStreak = exams.length ? Math.max(...exams.map(e => e.streak?.count || 0)) : 0;
  const studyDays = [...new Set(exams.flatMap(e => e.history?.map(h => new Date(h.timestamp).toDateString()) || []))].length;
  const weeklyTotal = getWeeklyTotal();
  
  content.innerHTML = `
    <div class="ai-stats-grid">
      <div class="ai-stat-card">📚 Opiskeltu yhteensä: ${totalStudied.toFixed(1)} h</div>
      <div class="ai-stat-card">🎯 Tavoite yhteensä: ${totalTarget} h</div>
      <div class="ai-stat-card">📊 Kokonaisprogressi: ${((totalStudied/totalTarget)*100 || 0).toFixed(1)}%</div>
      <div class="ai-stat-card">📅 Opiskelupäiviä: ${studyDays}</div>
      <div class="ai-stat-card">🔥 Keskim. putki: ${avgStreak} pv</div>
      <div class="ai-stat-card">🏆 Paras putki: ${bestStreak} pv</div>
      <div class="ai-stat-card">📅 Tällä viikolla: ${weeklyTotal.toFixed(1)} / ${weeklyTarget} h</div>
    </div>
    <div style="margin-top: 1rem;">
      <h4>📊 Koekohtaiset tilastot:</h4>
      ${exams.map(e => {
        const daily = getDailyNeed(e);
        const projected = computeProjected(e);
        return `
        <div style="margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 0.8rem;">
          <strong>${escapeHtml(e.name)}</strong><br>
          📖 ${e.studied.toFixed(1)} / ${e.targetHours} h (${((e.studied/e.targetHours)*100).toFixed(1)}%)<br>
          📈 Ennuste: ${projected.toFixed(0)} h | 🎯 Päivätahti: ${daily.toFixed(1)} h/pv<br>
          🔥 Putki: ${e.streak?.count || 0} pv | ✏️ ${e.history?.length || 0} lukukertaa
        </div>
      `}).join('')}
    </div>
  `;
}

function showMotivationModal() {
  const randomQuote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
  document.getElementById("motivationText").innerHTML = `"${randomQuote}"`;
}

function formatTimeLeft(ms) {
  if (ms <= 0) return "⌛ KOE ALKANUT!";
  const days = Math.floor(ms / (1000 * 3600 * 24));
  const hours = Math.floor((ms % (1000 * 3600 * 24)) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  
  if (days > 0) {
    return `${days}pv ${hours}h ${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

// ========== RENDERÖINTI ==========
function renderAllExams() {
  const container = document.getElementById("examsContainer");
  if (!container) return;
  
  if (exams.length === 0) {
    container.innerHTML = `<div style="background: var(--card-dark); border-radius: 2rem; padding: 2rem; text-align: center;">
      ✨ Ei vielä kokeita. Valitse aine ylhäältä!
    </div>`;
    return;
  }
  
  const now = new Date();
  let html = "";
  exams.forEach(exam => {
    const examDateObj = new Date(exam.date);
    const timeLeftMs = examDateObj - now;
    const studiedPercent = Math.min(100, (exam.studied / exam.targetHours) * 100);
    const daily = getDailyNeed(exam);
    const projected = computeProjected(exam);
    const pred = getGradePrediction(projected, exam.targetHours);
    
    let statusText = "";
    let statusColor = "";
    if (exam.studied >= exam.targetHours) {
      statusText = "✅ VALMIS!";
      statusColor = "#4ade80";
    } else if (daily <= 1) {
      statusText = "👍 Hyvällä mallilla";
      statusColor = "#2dd4bf";
    } else if (daily <= 2.5) {
      statusText = "⚠️ Kohtuullinen tahti";
      statusColor = "#facc15";
    } else {
      statusText = "🔥 Kiirettä pitää!";
      statusColor = "#f87171";
    }
    
    let historyHtml = "";
    (exam.history || []).slice(0, 6).forEach(h => {
      historyHtml += `<li>➕ +${h.value}h (${h.time})</li>`;
    });
    if (!exam.history?.length) historyHtml = "<li>📘 Ei vielä kirjauksia</li>";
    
    html += `
      <div class="exam-card" id="exam-card-${exam.id}">
        <div class="exam-header">
          <div class="exam-title">${escapeHtml(exam.name)}</div>
          <div class="exam-actions">
            <button class="small-btn" onclick="editExam(${exam.id})">✏️ Muokkaa</button>
            <button class="small-btn danger-btn" onclick="deleteExam(${exam.id})">🗑️ Poista</button>
          </div>
        </div>
        <div class="big-timer" id="timer-${exam.id}">${formatTimeLeft(timeLeftMs)}</div>
        <div class="progress-row"><span>📅 ${examDateObj.toLocaleDateString('fi-FI')} klo ${examDateObj.getHours().toString().padStart(2,'0')}:${examDateObj.getMinutes().toString().padStart(2,'0')}</span></div>
        <div class="progress-row"><span>📖 Opiskeltu: ${exam.studied.toFixed(1)} / ${exam.targetHours} h</span><span style="color: ${statusColor}">${statusText}</span></div>
        <div class="progress-bar-bg"><div class="progress-fill study-fill" style="width: ${studiedPercent}%;"></div></div>
        <div class="input-group">
          <input type="number" id="hoursInput_${exam.id}" step="0.5" placeholder="tunnit" value="1">
          <button onclick="addStudyToExam(${exam.id}, parseFloat(document.getElementById('hoursInput_${exam.id}').value))">➕ Lisää</button>
          <button class="small" onclick="quickAdd(${exam.id}, 1)">+1h</button>
          <button class="small" onclick="quickAdd(${exam.id}, 0.5)">+30min</button>
          <button class="small danger-btn" onclick="resetExam(${exam.id})">Nollaa</button>
        </div>
        <div class="stats-row">
          <span class="stat-badge">🎯 Tarvitaan/pv: ${daily.toFixed(1)} h</span>
          <span class="stat-badge">🔥 Putki: ${exam.streak?.count || 0} pv</span>
          <span class="stat-badge">📈 Ennuste: ${projected.toFixed(0)} h</span>
        </div>
        <ul class="history-list">${historyHtml}</ul>
        <div class="ai-insight">
          <div style="border-left: 4px solid ${pred.color}; padding-left: 8px;">
            <strong>${pred.emoji} ${pred.grade}-arvio</strong> - ${pred.msg}
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function updateTimersOnly() {
  const now = new Date();
  exams.forEach(exam => {
    const timerElement = document.getElementById(`timer-${exam.id}`);
    if (timerElement) {
      const examDateObj = new Date(exam.date);
      const timeLeftMs = examDateObj - now;
      timerElement.textContent = formatTimeLeft(timeLeftMs);
    }
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

window.editExam = function(examId) {
  const exam = exams.find(e => e.id === examId);
  if (!exam) return;
  const newName = prompt("Uusi nimi:", exam.name);
  const newDate = prompt("Uusi päivämäärä (YYYY-MM-DDTHH:MM):", exam.date.slice(0,16));
  const newTarget = prompt("Uusi tavoite (tunteja):", exam.targetHours);
  if (newName?.trim()) exam.name = newName.trim();
  if (newDate && !isNaN(new Date(newDate).getTime())) exam.date = newDate + ":00";
  if (newTarget && !isNaN(parseFloat(newTarget)) && parseFloat(newTarget) > 0) exam.targetHours = parseFloat(newTarget);
  saveData();
  renderAllExams();
  updateAISummary();
};

// ========== TEEMA & MODAALIT ==========
function initTheme() {
  const isLight = localStorage.getItem("ultra_theme") === "light";
  if (isLight) document.body.classList.add("light");
  document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("light");
    localStorage.setItem("ultra_theme", document.body.classList.contains("light") ? "light" : "dark");
  };
}

function initModals() {
  const motivationModal = document.getElementById("motivationModal");
  const statsModal = document.getElementById("statsModal");
  const resourcesModal = document.getElementById("resourcesModal");
  
  document.getElementById("motivationBtn").onclick = () => {
    showMotivationModal();
    motivationModal.style.display = "block";
  };
  document.getElementById("statsModalBtn").onclick = () => {
    showStatsModal();
    statsModal.style.display = "block";
  };
  document.getElementById("resourcesBtn").onclick = () => {
    resourcesModal.style.display = "block";
  };
  
  document.querySelectorAll(".close-modal, .close-modal-stats, .close-modal-resources").forEach(btn => {
    btn.onclick = () => {
      motivationModal.style.display = "none";
      statsModal.style.display = "none";
      resourcesModal.style.display = "none";
    };
  });
  window.onclick = (e) => {
    if (e.target === motivationModal) motivationModal.style.display = "none";
    if (e.target === statsModal) statsModal.style.display = "none";
    if (e.target === resourcesModal) resourcesModal.style.display = "none";
  };
  document.getElementById("newMotivationBtn").onclick = () => {
    showMotivationModal();
  };
}

function initTimetableButtons() {
  const loadBtn = document.getElementById("loadAnnaScheduleBtn");
  const clearBtn = document.getElementById("clearScheduleBtn");
  const exportBtn = document.getElementById("exportScheduleBtn");
  const importBtn = document.getElementById("importScheduleBtn");
  const importFile = document.getElementById("importScheduleFile");
  
  if (loadBtn) loadBtn.onclick = loadAnnaSchedule;
  if (clearBtn) clearBtn.onclick = clearSchedule;
  if (exportBtn) exportBtn.onclick = exportSchedule;
  if (importBtn) {
    importBtn.onclick = () => importFile.click();
  }
  if (importFile) {
    importFile.onchange = (e) => {
      if (e.target.files.length > 0) {
        importSchedule(e.target.files[0]);
        importFile.value = "";
      }
    };
  }
  initQuickButtons();
}

let interval;
function startAutoRefresh() {
  if (interval) clearInterval(interval);
  interval = setInterval(() => {
    updateTimersOnly();
  }, 1000);
}

// ========== GLOBAALIT FUNKTIOT ==========
window.addStudyToExam = addStudyToExam;
window.quickAdd = quickAdd;
window.resetExam = resetExam;
window.deleteExam = deleteExam;
window.editExam = editExam;
window.openPicker = openPicker;
window.clearScheduleCell = clearScheduleCell;
window.editWeeklyTarget = editWeeklyTarget;

// ========== SIVUN LATAUS ==========
document.addEventListener("DOMContentLoaded", function() {
  console.log("Sivu ladattu, alustetaan...");
  loadData();
  loadWeeklyData();
  loadScheduleFromStorage();
  initTheme();
  initModals();
  initTimetableButtons();
  renderAllExams();
  renderTimetable();
  updateAISummary();
  updateWeeklySummary();
  startAutoRefresh();
  
  const addBtn = document.getElementById("addSelectedExamBtn");
  if (addBtn) addBtn.addEventListener("click", addExamFromSelect);
  
  const customBtn = document.getElementById("addCustomExamBtn");
  if (customBtn) customBtn.addEventListener("click", addCustomExam);
  
  const showCustomBtn = document.getElementById("showCustomFormBtn");
  if (showCustomBtn) {
    showCustomBtn.addEventListener("click", function() {
      const form = document.getElementById("customExamForm");
      if (form) form.style.display = form.style.display === "none" ? "flex" : "none";
    });
  }
  
  console.log("Alustus valmis!");
});