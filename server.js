// Configs do Server
let express = require("express");
let bodyParser = require("body-parser");
let app = express();
let port = 80;
let mockedDBJSON = __dirname + '/data/cpfs.json';
let fs = require("fs");
let mockedDB = JSON.parse(fs.readFileSync(mockedDBJSON));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/static/'));

// TESTE: Resgatando o banco de dados:
app.get('/api/cpfs', (req, res) => {
   res.sendFile(__dirname + '/data/cpfs.json');
});

// Resgatando as notas de um CPF:
app.get('/api/cpfs/:cpf/notas', (req, res) => {
    let requestedCpf = req.params.cpf;
    let responseJSON = {};
    responseJSON.cpf = requestedCpf;
    for(let i = 0; i < mockedDB.length; i++) {
        let elem = mockedDB[i];
        if (elem.cpf == requestedCpf) {
            responseJSON.notas = elem.notas.slice(0);
            break;
        }
    }
    res.send(responseJSON);
});

// Resgatando a média de um CPF:
app.get('/api/cpfs/:cpf/media', (req, res) => {
    let requestedCpf = req.params.cpf;
    let responseJSON = {};
    responseJSON.cpf = requestedCpf;
    for(let i = 0; i < mockedDB.length; i++) {
        let elem = mockedDB[i];
        if (elem.cpf == requestedCpf) {
            let soma = 0;
            for(let i = 0; i < elem.notas.length; i++) {
                soma += elem.notas[i];
            }
            let media = soma/elem.notas.length;
            responseJSON.media = media;
        }
    }
    res.send(responseJSON);
});

// Cadastrando um novo CPF:
// TODO: Checar se CPF já existe!
// TODO: Checar máscara de CPF.
app.post('/api/cpfs/', (req, res) => {
    let novoCpf = req.body;
    novoCpf.cpf = novoCpf.cpf.toString();
    mockedDB.push(novoCpf);
    mockedDBJSON = JSON.stringify(mockedDB);
    fs.writeFile(__dirname + '/data/cpfs.json', mockedDBJSON, 'utf-8', (err) => {} );
    res.send(novoCpf);
});

// Cadastrando uma nova nota para um CPF:
// TODO: Checar se CPF já esta cadastrado!
// TODO: Checar máscara de CPF e de nota.
app.post('/api/cpfs/:cpf/notas', (req, res) => {
    let requestedCpf = req.params.cpf;
    console.log(requestedCpf);
    let requestedNota = req.body.nota;
    console.log(requestedNota);
    for(let elem in mockedDB) {
        console.log("checking:" + elem);
        if(elem.cpf == requestedCpf) {
            elem.notas.push(requestedNota);
        }
    }
    console.log(mockedDB);
});

// MANTENHA ESSA ROTA EM PENÚLTIMO LUGAR!
// Rota default 404 para api.
app.get('/api*', (req, res) => {
    res.sendFile(__dirname + '/static/404api.html', 404);
});

// MANTENHA ESSA ROTA EM ÚLTIMO LUGAR!
// Rota default 404 para o site.
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/static/404.html', 404);
});
app.listen(port, console.log("Servidor iniciado na porta " + port));