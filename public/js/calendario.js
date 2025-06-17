let currentDate = new Date();
let events = {};

async function loadMembrosEPersonais() {
    const [membrosRes, personaisRes] = await Promise.all([
        fetch('http://localhost:3000/api/membros'),
        fetch('http://localhost:3000/api/personais')
    ]);

    const membros = await membrosRes.json();
    const personais = await personaisRes.json();

    const membroSelect = document.getElementById('eventMembro');
    const personalSelect = document.getElementById('eventPersonal');

    membros.forEach(m => {
        membroSelect.innerHTML += `<option value="${m.id}">${m.nome}</option>`;
    });

    personais.forEach(p => {
        personalSelect.innerHTML += `<option value="${p.id}">${p.nome}</option>`;
    });
}

async function loadEvents() {
    const res = await fetch('http://localhost:3000/api/eventos');
    const data = await res.json();
    events = {};

    data.forEach(ev => {
        const dateStr = ev.data;
        if (!events[dateStr]) events[dateStr] = [];
        events[dateStr].push(ev);
    });

    renderCalendar();
}

function renderCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const monthYear = document.getElementById('monthYear');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = (firstDay === 0) ? 6 : firstDay - 1;

    const lastDate = new Date(year, month + 1, 0).getDate();

    monthYear.innerText = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    calendarDays.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0); // remove horas para comparação justa

    // Dias em branco antes do início do mês
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'day';
        calendarDays.appendChild(empty);
    }

    for (let day = 1; day <= lastDate; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';

        // Verifica se é o dia de hoje
        const thisDate = new Date(year, month, day);
        thisDate.setHours(0, 0, 0, 0);
        if (thisDate.getTime() === today.getTime()) {
            dayDiv.classList.add('today');
        }

        dayDiv.innerHTML = `<div class="day-number">${day}</div>`;

        if (events[dateStr]) {
            events[dateStr].forEach(ev => {
                const evDiv = document.createElement('div');
                evDiv.className = 'event';

                // Verifica se o evento está no passado
                const eventDateTime = new Date(`${ev.data}T${ev.horario || "00:00"}`);
                const now = new Date();

                if (eventDateTime < now) {
                    evDiv.classList.add('past');
                }

                evDiv.innerHTML = `
          ${ev.horario || ''} - ${ev.titulo}<br>
          Membro: ${ev.membro_nome || 'N/A'}<br>
          Personal: ${ev.personal_nome || 'N/A'}
          <button onclick="deleteEvent(${ev.id})" title="Excluir evento">&times;</button>
        `;
                dayDiv.appendChild(evDiv);
            });
        }

        dayDiv.onclick = () => openEventModal(dateStr);
        calendarDays.appendChild(dayDiv);
    }
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function openEventModal(date) {
    document.getElementById('eventDate').value = date;
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventMembro').value = '';
    document.getElementById('eventPersonal').value = '';

    loadEventsOfDay(date);

    // Abrir a aba "Adicionar Evento" por padrão
    const tabTriggerEl = document.querySelector('#add-event-tab');
    const tab = new bootstrap.Tab(tabTriggerEl);
    tab.show();

    new bootstrap.Modal(document.getElementById('eventModal')).show();
}

function loadEventsOfDay(date) {
    const eventsListDiv = document.getElementById('eventsOfDayList');
    eventsListDiv.innerHTML = '';

    if (!events[date] || events[date].length === 0) {
        eventsListDiv.innerHTML = '<p>Não há eventos para este dia.</p>';
        return;
    }

    // Listar eventos daquele dia
    events[date].forEach(ev => {
        const evDiv = document.createElement('div');
        evDiv.className = 'mb-2 p-2 border rounded';

        evDiv.innerHTML = `
      <strong>${ev.horario || ''} - ${ev.titulo}</strong><br>
      Membro: ${ev.membro_nome || 'N/A'}<br>
      Personal: ${ev.personal_nome || 'N/A'}
      <button class="btn btn-sm btn-danger float-end" onclick="deleteEvent(${ev.id})" title="Excluir evento">&times;</button>
    `;

        eventsListDiv.appendChild(evDiv);
    });
}

async function saveEvent() {
    const date = document.getElementById('eventDate').value;
    const title = document.getElementById('eventTitle').value.trim();
    const time = document.getElementById('eventTime').value;
    const membro_id = document.getElementById('eventMembro').value;
    const personal_id = document.getElementById('eventPersonal').value;

    if (!title) {
        alert('Por favor, preencha o título do evento.');
        return;
    }

    const evento = {
        data: date,
        titulo: title,
        horario: time,
        membro_id,
        personal_id
    };

    const res = await fetch('http://localhost:3000/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evento)
    });

    if (res.ok) {
        document.getElementById('successAlert').classList.remove('d-none');
        setTimeout(() => {
            document.getElementById('successAlert').classList.add('d-none');
        }, 3000);
        await loadEvents();
        bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
    } else {
        alert('Erro ao salvar evento.');
    }
}

async function deleteEvent(id) {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;
    const res = await fetch(`http://localhost:3000/api/eventos/${id}`, { method: 'DELETE' });
    if (res.ok) {
        await loadEvents();
        const date = document.getElementById('eventDate').value;
        loadEventsOfDay(date);
    } else {
        alert('Erro ao excluir evento.');
    }
}

// Inicialização
loadMembrosEPersonais();
loadEvents(); 