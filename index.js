const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extend: false}));

app.set("view engine", 'ejs');

app.get("/", (req, res)=>{
    return res.render('home');
});

app.post('/', (req, res)=>{
    let {nome, email, telefone, senha} = req.body;   
    
    let userCadastro = fs.readFileSync("usuarios.json", {encoding:"utf-8"});
    userCadastro = JSON.parse(userCadastro);
    
    if(email != userCadastro.email){
    let senhaC = bcrypt.hashSync(senha, 6)
    let userJson = JSON.stringify({nome, email, telefone, senha:senhaC});
    fs.writeFileSync("usuarios.json", userJson);
        res.redirect('/login');
    }else{
        res.send("Email já cadastrado!")
    }        
});

app.get("/login", (req, res)=>{
    res.render('login')
});

app.post("/login", (req, res)=>{
    let {email, senha} = req.body; 
    let userCadastro = fs.readFileSync("usuarios.json", {encoding:"utf-8"});
    userCadastro = JSON.parse(userCadastro);
    let compareSenha = bcrypt.compareSync(senha, userCadastro.senha);      
   
    try {
        if(email != userCadastro.email){
            res.send("E-mail não cadastrado")        
        } else if(!compareSenha){
            res.send("senha inválida!")
        }else{
            res.send("Seja Bem vindo!")
        };
    } catch (error) {
        res.send("Erro ao requisitar " + error)
    }
});

app.listen(3030, ()=>{
    console.log("Servidor ligado!");    
});



