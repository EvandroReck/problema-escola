// script.js - Controle do Portão Automático

// Atualiza o relógio em tempo real
function updateClock() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;

    // Atualiza o status do portão
    updateGateStatus(now);
}

// Horários do cronograma (em minutos desde meia-noite)
const schedule = [
    { open: 6*60 + 40,  close: 7*60 + 30 },   // 06:40 - 07:30
    { open: 11*60 + 30, close: 12*60 + 0 },   // 11:30 - 12:00
    { open: 12*60 + 40, close: 13*60 + 30 },  // 12:40 - 13:30
    { open: 17*60 + 15, close: 18*60 + 0 }    // 17:15 - 18:00
];

// Verifica se o portão deve estar aberto no momento atual
function isGateOpen(currentMinutes) {
    for (let slot of schedule) {
        if (currentMinutes >= slot.open && currentMinutes < slot.close) {
            return true;
        }
    }
    return false;
}

// Retorna o próximo horário de ação (abrir ou fechar)
function getNextAction(now) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    let nextTime = null;
    let isOpening = false;

    for (let slot of schedule) {
        if (currentMinutes < slot.open) {
            nextTime = slot.open;
            isOpening = true;
            break;
        }
        if (currentMinutes < slot.close) {
            nextTime = slot.close;
            isOpening = false;
            break;
        }
    }

    // Se já passou do último horário, próximo é amanhã às 06:40
    if (nextTime === null) {
        nextTime = 6*60 + 40;
        isOpening = true;
    }

    const nextHour = Math.floor(nextTime / 60);
    const nextMin = nextTime % 60;
    const actionText = isOpening ? "Abre" : "Fecha";

    return `${actionText} às ${nextHour.toString().padStart(2, '0')}:${nextMin.toString().padStart(2, '0')}`;
}

// Atualiza visual do status do portão
function updateGateStatus(now) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const gateCard = document.getElementById('gate-card');
    const gateIcon = document.getElementById('gate-icon');
    const statusText = document.getElementById('status-text');
    const nextActionEl = document.getElementById('next-action');

    if (isGateOpen(currentMinutes)) {
        // Portão Aberto
        gateCard.classList.add('open');
        gateCard.classList.remove('closed');
        gateIcon.textContent = '🚪';
        statusText.textContent = 'ABERTO';
        nextActionEl.innerHTML = `Fecha em: <strong>${getNextAction(now).replace('Abre às', '').replace('Fecha às', '')}</strong>`;
    } else {
        // Portão Fechado
        gateCard.classList.add('closed');
        gateCard.classList.remove('open');
        gateIcon.textContent = '🔒';
        statusText.textContent = 'FECHADO';
        nextActionEl.innerHTML = `Abre em: <strong>${getNextAction(now).replace('Abre às', '').replace('Fecha às', '')}</strong>`;
    }
}

// Função do botão de acionamento manual
function toggleManual() {
    const confirmAction = confirm("Deseja acionar o portão manualmente?\n\nIsso simula o comando enviado ao Arduino.");
    
    if (confirmAction) {
        alert("✅ Comando enviado ao Arduino!\n\nO portão foi acionado manualmente.");
        
        // Feedback visual temporário
        const gateIcon = document.getElementById('gate-icon');
        const originalIcon = gateIcon.textContent;
        
        gateIcon.textContent = '⚡';
        setTimeout(() => {
            gateIcon.textContent = originalIcon;
        }, 800);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Atualiza o relógio e status a cada segundo
    setInterval(updateClock, 1000);
    
    // Primeira execução imediata
    updateClock();
    
    console.log("✅ Sistema de Portão Automático carregado com sucesso!");
});
