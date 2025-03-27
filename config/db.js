// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: '2007', 
    database: 'examenfinal_'  
});


connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

