// =============================================
//  SISTEMA DE PORTÃO AUTOMÁTICO - Escola São Cristóvão
//  Arduino Uno + RTC DS3231
// =============================================

const schedule = [
    { open:  6*60 + 40, close:  7*60 + 30 }, // Manhã - Entrada
    { open: 11*60 + 30, close: 12*60 +  0 }, // Intervalo Almoço
    { open: 12*60 + 40, close: 13*60 + 30 }, // Tarde - Retorno
    { open: 17*60 + 15, close: 18*60 +  5 }  // Saída Final (corrigido)
];

// Atualiza relógio e status a cada segundo
function updateClock() {
    const now = new Date();
    
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    
    updateGateStatus(now);
}

// Verifica se o portão deve estar aberto
function isGateOpen(currentMinutes) {
    for (let slot of schedule) {
        if (currentMinutes >= slot.open && currentMinutes < slot.close) {
            return true;
        }
    }
    return false;
}

// Retorna a próxima ação (abrir ou fechar)
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

    // Próximo dia
    if (nextTime === null) {
        nextTime = 6 * 60 + 40;
        isOpening = true;
    }

    const hour = Math.floor(nextTime / 60).toString().padStart(2, '0');
    const min = (nextTime % 60).toString().padStart(2, '0');
    
    return {
        text: `${isOpening ? "Abre" : "Fecha"} às ${hour}:${min}`,
        isOpening: isOpening
    };
}

// Atualiza o visual do status do portão
function updateGateStatus(now) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const gateCard = document.getElementById('gate-card');
    const gateIcon = document.getElementById('gate-icon');
    const statusText = document.getElementById('status-text');
    const nextActionEl = document.getElementById('next-action');

    const next = getNextAction(now);

    if (isGateOpen(currentMinutes)) {
        gateCard.classList.add('open');
        gateCard.classList.remove('closed');
        gateIcon.textContent = '🚪';
        statusText.textContent = 'ABERTO';
        nextActionEl.innerHTML = `Fecha em: <strong>${next.text.replace('Fecha às ', '')}</strong>`;
    } else {
        gateCard.classList.add('closed');
        gateCard.classList.remove('open');
        gateIcon.textContent = '🔒';
        statusText.textContent = 'FECHADO';
        nextActionEl.innerHTML = `Abre em: <strong>${next.text.replace('Abre às ', '')}</strong>`;
    }
}

// Acionamento manual
function toggleManual() {
    if (confirm("⚠️ Deseja acionar o portão manualmente?\n\nIsso simula o envio de comando ao Arduino.")) {
        alert("✅ Comando enviado com sucesso ao Arduino!\nO portão foi acionado manualmente.");

        const gateIcon = document.getElementById('gate-icon');
        const original = gateIcon.textContent;
        
        gateIcon.style.transition = 'all 0.2s';
        gateIcon.textContent = '⚡';
        
        setTimeout(() => {
            gateIcon.textContent = original;
        }, 700);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    setInterval(updateClock, 1000);
    updateClock(); // Execução imediata
    
    console.log("%c✅ Sistema de Portão Automático carregado com sucesso!", "color: #00ff88; font-weight: bold;");
});
