const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('views')); // Servir archivos estáticos como CSS

// Función para leer usuarios del archivo
const getUsers = () => {
    if (!fs.existsSync('users.txt')) {
        return [];
    }
    const data = fs.readFileSync('users.txt', 'utf-8').trim();
    return data.split('\n').map(line => {
        const [username, password] = line.split(',');
        return { username, password };
    });
};

// Función para guardar un nuevo usuario
const saveUser = (username, password) => {
    fs.appendFileSync('users.txt', `${username},${password}\n`);
};

// Ruta de inicio
app.get('/', (req, res) => {
    res.send(`
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
            body {
                background-color: #121212;
                color: white;
                font-family: 'Arial', sans-serif;
            }
            h1 {
                color: #b8c1ec;
            }
            .btn-primary, .btn-success {
                background-color: #5a67d8;
                border-color: #5a67d8;
            }
            .btn-primary:hover, .btn-success:hover {
                background-color: #434190;
                border-color: #434190;
            }
            a {
                color: #5a67d8;
            }
            a:hover {
                color: #434190;
            }
            .container {
                margin-top: 100px;
            }
        </style>
        <div class="container text-center">
            <h1 class="my-4">Bienvenido a mi página web</h1>
            <a href="/login" class="btn btn-primary mx-2">Iniciar sesión</a>
            <a href="/register" class="btn btn-success mx-2">Registrarse</a>
        </div>
    `);
});

// Ruta de inicio de sesión
app.get('/login', (req, res) => {
    res.send(`
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
            body {
                background-color: #121212;
                color: white;
            }
            h1 {
                color: #b8c1ec;
            }
            .form-control {
                background-color: #333;
                color: white;
                border-color: #5a67d8;
            }
            .form-control:focus {
                background-color: #444;
                color: white;
                border-color: #434190;
            }
            .btn-primary {
                background-color: #5a67d8;
                border-color: #5a67d8;
            }
            .btn-primary:hover {
                background-color: #434190;
                border-color: #434190;
            }
            a {
                color: #5a67d8;
            }
            a:hover {
                color: #434190;
            }
            .container {
                margin-top: 100px;
            }
        </style>
        <div class="container">
            <h1 class="text-center my-4">Iniciar sesión</h1>
            <form action="/login" method="POST" class="w-50 mx-auto">
                <div class="form-group">
                    <input type="text" name="username" class="form-control" placeholder="Usuario" required>
                </div>
                <div class="form-group">
                    <input type="password" name="password" class="form-control" placeholder="Contraseña" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Entrar</button>
            </form>
            <p class="text-center my-3"><a href="/register">¿No tienes una cuenta? Regístrate aquí</a></p>
        </div>
    `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();

    const user = users.find(user => user.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        return res.redirect('/aaa/index.html'); // Redirige a index.html
    }

    res.send('Credenciales incorrectas');
});

// Ruta para el dashboard (opcional)
app.get('/aaa/index', (req, res) => {
    res.send(`
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
            body {
                background-color: #121212;
                color: white;
            }
            .container {
                margin-top: 100px;
            }
        </style>
        <div class="container text-center">
            <h1 class="my-4">Bienvenido a la Página Principal</h1>
            <p>Has iniciado sesión correctamente.</p>
            <a href="/" class="btn btn-primary">Volver a la página principal</a>
        </div>
    `);
});

// Ruta de registro
app.get('/register', (req, res) => {
    res.send(`
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
            body {
                background-color: #121212;
                color: white;
            }
            h1 {
                color: #b8c1ec;
            }
            .form-control {
                background-color: #333;
                color: white;
                border-color: #5a67d8;
            }
            .form-control:focus {
                background-color: #444;
                color: white;
                border-color: #434190;
            }
            .btn-success {
                background-color: #4c51bf;
                border-color: #4c51bf;
            }
            .btn-success:hover {
                background-color: #434190;
                border-color: #434190;
            }
            a {
                color: #5a67d8;
            }
            a:hover {
                color: #434190;
            }
            .container {
                margin-top: 100px;
            }
        </style>
        <div class="container">
            <h1 class="text-center my-4">Registrarse</h1>
            <form action="/register" method="POST" class="w-50 mx-auto">
                <div class="form-group">
                    <input type="text" name="username" class="form-control" placeholder="Usuario" required>
                </div>
                <div class="form-group">
                    <input type="password" name="password" class="form-control" placeholder="Contraseña" required>
                </div>
                <button type="submit" class="btn btn-success btn-block">Registrar</button>
            </form>
            <p class="text-center my-3"><a href="/login">¿Ya tienes una cuenta? Inicia sesión aquí</a></p>
        </div>
    `);
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    saveUser(username, hashedPassword);
    res.send('Usuario registrado con éxito! Puedes <a href="/login">iniciar sesión</a>.');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});