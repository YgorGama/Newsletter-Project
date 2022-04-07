const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

app.use(bodyParser.urlencoded({extended:true}))

const mailchimp = require("@mailchimp/mailchimp_marketing");

const res = require('express/lib/response');
const { rawListeners } = require('process');

//Comando para configurar o link na nova documentação da API MailChimp
mailchimp.setConfig({
  apiKey: "62a61cdb2e59bde7573437e25caae596-us14",
  server: "us14"
});

//Testar se o comando link está funcionando corretamente
// async function run() {
//   const response = await mailchimp.ping.get();
//   console.log(response);
// }

//Envia o arquivos HTML
app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

//Pegando o CSS contido na pasta public, utilizei assim pois chamar diretamente o diretório da página não funcionou
app.use(express.static(__dirname));


app.post('/', (req,res)=>{
    //Informações
    const email = req.body.emailUser;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const listId = "1732d21810";

    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };


    //Função disponibilizada pela API do MailChimp, somente foi adicionada os metodos try e catch para localizar se houve algum erro
    async function run() {
        try{
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                  FNAME: subscribingUser.firstName,
                  LNAME: subscribingUser.lastName
                }
            });
            
            res.sendFile(__dirname + '/sucess.html');
            console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
        }
        catch(err){
            console.log(err.status);
            res.sendFile(__dirname + '/failure.html');
        }
    }
    run()
      
});


//Try Button
app.post('/failure', (req, res)=>{
    res.redirect('/')
})

//Comando para fazer funcionar o server
app.listen(process.env.PORT||3000, ()=>{
    console.log('Server running');
});