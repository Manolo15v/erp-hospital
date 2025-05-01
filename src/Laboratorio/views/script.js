// Configuración de la API
const API_URL = process.env.API_URL; //Obtenemos la URL de la API desde el .env

// Función para mostrar secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar sección seleccionada
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

// Manejar envío del formulario de paciente
async function handlePatientForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        // TODO: Implementar fetch para registrar paciente
        // const response = await fetch(`${API_URL}/pacientes`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         nombre: formData.get('nombre'),
        //         apellido: formData.get('apellido'),
        //         id: formData.get('id'),
        //         genero: formData.get('genero'),
        //         fechaNacimiento: formData.get('fechaNacimiento'),
        //         telefono: formData.get('telefono')
        //     })
        // });

        // Clear form
        form.reset();

        // Update patient list
        await loadPatients();

        alert('Paciente registrado exitosamente');
    } catch (error) {
        console.error('Error al registrar paciente:', error);
        alert('Error al registrar paciente. Por favor, intente nuevamente.');
    }

    return false;
}

// Cargar pacientes desde la API
async function loadPatients() {
    try {
        // TODO: Implementar fetch para obtener pacientes
        // const response = await fetch(`${API_URL}/pacientes`);
        // const data = await response.json();

        const patientCardsContainer = document.getElementById('patient-cards');
        patientCardsContainer.innerHTML = '';

        // TODO: Procesar los datos obtenidos y crear las tarjetas de pacientes
        // data.forEach(patient => {
        //     const card = document.createElement('div');
        //     card.className = 'patient-card';
        //     card.innerHTML = `
        //         <h3>${patient.nombre} ${patient.apellido}</h3>
        //         <p>ID: ${patient.id}</p>
        //         <p>Fecha Nacimiento: ${new Date(patient.fechaNacimiento).toLocaleDateString('es-ES')}</p>
        //     `;
        //     patientCardsContainer.appendChild(card);
        // });
    } catch (error) {
        console.error('Error al cargar pacientes:', error);
        alert('Error al cargar la lista de pacientes.');
    }
}

// Cargar resultados desde la API
async function loadResults() {
    try {
        // TODO: Implementar fetch para obtener resultados
        // const response = await fetch(`${API_URL}/resultados`);
        // const data = await response.json();

        const resultsBody = document.getElementById('results-body');
        resultsBody.innerHTML = '';

        // TODO: Procesar los datos obtenidos y crear las filas de resultados
        // data.forEach(result => {
        //     const row = document.createElement('tr');
        //     const patient = data.find(p => p.id === result.pacienteId);
        //     row.innerHTML = `
        //         <td>${patient?.nombre || 'Paciente no encontrado'}</td>
        //         <td>${result.tipoExamen}</td>
        //         <td>${new Date(result.fecha).toLocaleDateString('es-ES')}</td>
        //         <td class="${result.estado === 'Normal' ? 'status-completed' : 'status-pending'}">${result.estado}</td>
        //     `;
        //     resultsBody.appendChild(row);
        // });
    } catch (error) {
        console.error('Error al cargar resultados:', error);
        alert('Error al cargar los resultados.');
    }
}

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // TODO: Implementar la carga inicial de pacientes y resultados
        // await loadPatients();
        // await loadResults();
    } catch (error) {
        console.error('Error al inicializar:', error);
    }
});