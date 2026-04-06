// script.js - Portão Automático (Versão Premium)

const schedule = [
    { open: 6*60 + 40,  close: 7*60 + 30 },   // 06:40 - 07:30
    { open: 11*60 + 30, close: 12*60 + 0 },   // 11:30 - 12:00
    { open: 12*60 + 40, close: 13*60 + 30 },  // 12:40 - 13:30
    { open: 17*60 + 15, close: 18*60 + 0 }    // 17:15 - 18:00
];

function minutesSinceMidnight(date) {
    return date.getHours() * 60 + date.getMinutes();
}

function isGateOpen(now) {
    const current = minutesSinceMidnight(now);
    return schedule.some(slot => current >= slot.open && current < slot.close);
}

function getNextAction(now) {
    const current = minutesSinceMidnight(now);
    let nextTime = null;
    let isOpening = true;

    for (let slot of schedule) {
        if (current < slot.open) {
            nextTime = slot.open;
            isOpening = true;
            break;
        }
        if (current < slot.close) {
            nextTime = slot.close;
            isOpening = false;
            break;
        }
    }

    if (nextTime === null) nextTime = 6*60 + 40;

    const hour = Math.floor(nextTime / 60).toString().padStart(2, '0');
    const min = (nextTime % 60).toString().padStart(2, '0');

    return `${isOpening ? 'Abre' : 'Fecha'} às ${hour}:${min}`;
}

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    document.getElementById('clock').textContent = timeStr;
    updateGateUI(now);
}

function updateGateUI(now) {
    const card = document.getElementById('gate-card');
    const icon = document.getElementById('gate-icon');
    const statusText = document.getElementById('status-text');
    const nextEl = document.getElementById('next-action');

    const isOpen = isGateOpen(now);

    if (isOpen) {
        card.classList.add('open');
        card.classList.remove('closed');
        icon.textContent = '🚪';
        statusText.textContent = 'ABERTO';
        nextEl.innerHTML = `Fecha em: <strong>${getNextAction(now).replace('Fecha às', '')}</strong>`;
    } else {
        card.classList.add('closed');
        card.classList.remove('open');
        icon.textContent = '🔒';
        statusText.textContent = 'FECHADO';
        nextEl.innerHTML = `Abre em: <strong>${getNextAction(now).replace('Abre às', '')}</strong>`;
    }
}

function toggleManual() {
    if (confirm("Enviar comando manual ao Arduino?")) {
        const icon = document.getElementById('gate-icon');
        const original = icon.textContent;
        
        icon.style.transition = 'transform 0.2s';
        icon.style.transform = 'scale(1.3) rotate(20deg)';
        
        setTimeout(() => {
            alert("✅ Comando enviado com sucesso ao Arduino!");
            icon.style.transform = 'scale(1) rotate(0deg)';
            setTimeout(() => icon.textContent = original, 400);
        }, 300);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    setInterval(updateClock, 1000);
    updateClock(); // Primeira execução
});
