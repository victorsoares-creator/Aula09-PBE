const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');//importa a conexão com supabase
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware  essenciais
app.use(cors());// Permite que o frontend acesse este backend sem erros no CORS
app.use(express.json());//Permite que o Express entenda requisições com corpo em JSON

//Passo 1 memoria ram do servidor
let produtosEmMemoria = [
    {id:1, nome: 'Teclado Mecânico RGB', preco: 150.00},
    {id:2, nome: 'Mouse Gamer 3200 DPI', preco: 150.00}
];

//Rota Get
app.get('/produtos', async (req, res) => {
    // console.log('[GET /produtos] Enviando produtos em mémoria...')
    // res.json(produtosEmMemoria);
    const {data, error} = await supabase
    .from('produtos')
    .select('*')
    .order('id', {ascending: true});
    if (error){
        return res.status(500).json({ erro: error.message});
    }
    res.json(data);
});
//Rota Post
app.post('/produtos', (req, res) =>{
    const {nome, preco} = req.body;

    if(!nome || !preco){
        return res.status(400).json({erro:'Nome e preço são obrigatório'})
    }
    const novoProduto = {
        id:Date.now(),
        nome,
        preco: parseFloat(preco)
    };

    produtosEmMemoria.push(novoProduto);
    console.log(`[POST /produtos] Produto adicionado na RAM: ${novoProduto.nome}`);

    res.status(201).json(novoProduto);
});

//Rota PUT: alterar um produto
app.put('/produtos/:id', (req, res) => {
    const id = Number(req.params.id);
    const {nome, preco} = req.body
    const produto = produtosEmMemoria.find((item) => item.id === id);

    if(!produto){
        return res.status(404).json({mensagem: 'Produto não encontrado'});
    }
    if(typeof nome !== 'string' || nome.trim() === '' || Number.isFinite(Number(preco))) {
        return res.status(400).json({mensagem: 'Informe um nome e um preço valido'});
    }

    produto.nome = nome.trim();
    produto.preco = Number(preco)
});
//Rota DELETE: remove um produto
app.delete('/produtos/:id', (req, res) => {
    const id = Number(req.params.id);
    const indice = produtosEmMemoria.findIndex((produto) => produto.id === id);

    if (indice === -1) {
        return res.status(404).json({ mensagem: 'Produto não encontrado'});
    }

    const [produtoRemovido] = produtosEmMemoria.splice(indice,1);
    res.json(produtoRemovido)
});
//listen iniciar o servidor
app.listen(PORT, () => {
        console.log('====================================================');
        console.log(`Servidor Back-End rodando na nuvem`);
        console.log('Rota de produtos ativa em http://localhost:3000/produtos')
        console.log('Status: MODO MÉMORIA RAM ATIVO');
        console.log('====================================================');
});

