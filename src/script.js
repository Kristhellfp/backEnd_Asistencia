let alumnos = [];
let maestros = [];
let grados = [];

const cargarTodosLosDatos = async () => {
  try {
    mostrarLoadingState();
    
    [grados, alumnos, maestros] = await Promise.all([
      fetchData(API_GRADOS, 'grados'),
      fetchData(API_ALUMNOS, 'alumnos'),
      fetchData(API_MAESTROS, 'maestros')
    ]);

    mostrarDatosEnDOM('grados-container', grados, mostrarGrado);
    mostrarDatosEnDOM('alumnos-container', alumnos, mostrarAlumno);
    mostrarDatosEnDOM('maestros-container', maestros, mostrarMaestro);

    const asistencias = await fetchData(API_ASISTENCIAS, 'asistencias');
    mostrarAsistencias(asistencias);
    
  } catch (error) {
    mostrarErrorGeneral();
  }
};

function mostrarLoadingState() {
  document.querySelectorAll('.container').forEach(container => {
    container.innerHTML = '<div class="loading">Cargando...</div>';
  });
}

function mostrarDatosEnDOM(containerId, datos, mostrarFunc) {
  const contenedor = document.getElementById(containerId);
  contenedor.innerHTML = '';
  
  if (datos.length === 0) {
    contenedor.innerHTML = '<div>No hay registros</div>';
    return;
  }

  datos.forEach(item => {
    contenedor.appendChild(mostrarFunc(item));
  });
}

function mostrarGrado(grado) {
  const elemento = document.createElement('div');
  elemento.className = 'grado-item';
  elemento.textContent = `Grado: ${grado.grado}, Sección: ${grado.seccion}`;
  return elemento;
}

function mostrarAlumno(alumno) {
  const elemento = document.createElement('div');
  elemento.className = 'alumno-item';
  elemento.textContent = `Alumno: ${alumno.nombre} ${alumno.apellido}, Grado: ${alumno.id_grado || 'No asignado'}`;
  return elemento;
}

function mostrarMaestro(maestro) {
  const elemento = document.createElement('div');
  elemento.className = 'maestro-item';
  elemento.textContent = `Maestro: ${maestro.nombre} ${maestro.apellido}, Email: ${maestro.email}`;
  return elemento;
}

function mostrarAsistencias(asistencias) {
  const contenedor = document.getElementById('asistencias-container');
  contenedor.innerHTML = '';
  
  if (asistencias.length === 0) {
    contenedor.innerHTML = '<div>No hay asistencias registradas</div>';
    return;
  }

  asistencias.forEach(asistencia => {
    const elemento = document.createElement('div');
    elemento.className = 'asistencia-item';
    
    const alumno = alumnos.find(a => a.id === asistencia.id_alumno);
    const maestro = maestros.find(m => m.id === asistencia.id_maestro);

    elemento.textContent = `Alumno: ${alumno?.nombre || 'No definido'} ${alumno?.apellido || ''}, ` +
                         `Maestro: ${maestro?.nombre || 'No definido'} ${maestro?.apellido || ''}, ` +
                         `Fecha: ${asistencia.fecha}, Estado: ${asistencia.estado}`;
    
    contenedor.appendChild(elemento);
  });
}

function mostrarErrorGeneral() {
  document.querySelectorAll('.container').forEach(container => {
    container.innerHTML = '<div class="error">Error al cargar datos. Intenta recargar la página.</div>';
  });
}