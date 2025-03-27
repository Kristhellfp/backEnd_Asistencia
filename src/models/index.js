
const obtenerAlumnos = async () => {
    try {
        // Hacer una solicitud GET al backend
        const response = await fetch('http://localhost:5000/api/alumnos');
        
      
        const data = await response.json();
        
    
        console.log('Alumnos:', data);
    } catch (error) {

        console.error('Error obteniendo los alumnos:', error);
    }
};

obtenerAlumnos();