const express = require('express');
const session = require('express-session');
const app = express();
// Configurado para a porta 3007, conforme sua preferência
const PORT = 3008; 

// 1. Configurar o middleware de Sessão
app.use(session({
    secret: 'chave_secreta_disgrassix_2025', // Chave usada para assinar o cookie da sessão
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // Expira em 24 horas
}));

// Configurar o EJS como motor de template
app.set('view engine', 'ejs');
app.set('views', 'views');

// Servir arquivos estáticos (CSS, imagens, etc.)
app.use(express.static('public'));

// 2. Dados de Exemplo (Acessórios e Novidades)
// 'price' é usado para cálculo. 'formattedPrice' é usado para exibição.
const products = [
    { id: 1, name: "Colar Estelar", price: 45.00, formattedPrice: "R$ 45,00", image: "imagem1.jpg", description: "Um colar elegante e minimalista com um pingente de estrela guia." },
    { id: 2, name: "Pulseira Zênite", price: 29.90, formattedPrice: "R$ 29,90", image: "imagem2.jpg", description: "Pulseira de couro sintético marrom com fecho magnético. Moderna, casual e unissex." },
    { id: 3, name: "Óculos Solar X", price: 79.50, formattedPrice: "R$ 79,50", image: "imagem3.jpg", description: "Óculos de sol com armação preta fosca, lentes polarizadas e proteção UV400." },
    { id: 4, name: "Anel Vênus", price: 35.00, formattedPrice: "R$ 35,00", image: "imagem4.jpg", description: "Anel ajustável em aço inoxidável com um delicado detalhe de pedra opala." },
    { id: 5, name: "Lenço Seda Lua", price: 55.00, formattedPrice: "R$ 55,00", image: "imagem5.jpg", description: "Lenço de seda com estampa de fases da lua, ideal para cabelo ou pescoço." },
    { id: 6, name: "Broche Fênix", price: 19.99, formattedPrice: "R$ 19,99", image: "imagem6.jpg", description: "Broche metálico em formato de Fênix, um toque de mistério e estilo." },
    { id: 7, name: "Bolsa Marte", price: 120.00, formattedPrice: "R$ 120,00", image: "imagem7.jpg", description: "Bolsa compacta em couro vegano, alça ajustável, perfeita para o dia a dia." },
    { id: 8, name: "Luvas Táticas", price: 49.00, formattedPrice: "R$ 49,00", image: "imagem8.jpg", description: "Luvas sem dedos, ideal para uso em motos ou para um estilo urbano mais agressivo." }
];

const newsData = [
    { name: "Tiara Galáxia", date: "15/09/2025", description: "Chegou a nova coleção de tiaras com brilho estelar, edição limitada! Disponível em três cores." },
    { name: "Kit de Limpeza Prata", date: "28/09/2025", description: "Kit completo para manter seus acessórios de prata sempre impecáveis." },
    { name: "Cinto Fino Lunar", date: "30/09/2025", description: "Cinto de couro legítimo com detalhes de fivela inspirados na Lua." }
];


// 3. Middleware para Carrinho: Garante que o carrinho exista e o injeta nas views
app.use((req, res, next) => {
    // Inicializa o carrinho na sessão se não existir
    if (!req.session.cart) {
        req.session.cart = [];
    }
    // Adiciona o contador do carrinho (soma das quantidades) para ser usado no header.ejs
    res.locals.cartCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);
    next();
});

// --- Rotas de Navegação (Páginas Estáticas e Dinâmicas) ---

// Rota da Homepage
app.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'DisgrassiX - Acessórios de Destaque',
        products: products
    });
});

// Rota de Detalhe do Produto
app.get('/produto/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.render('product', {
            pageTitle: product.name + ' | DisgrassiX',
            product: product
        });
    } else {
        res.status(404).send('Produto não encontrado');
    }
});

// Rota da Página de Contato
app.get('/contato', (req, res) => {
    res.render('contact', {
        pageTitle: 'Contato | DisgrassiX'
    });
});

// Rota da Página de Novidades
app.get('/novidades', (req, res) => {
    res.render('news', {
        pageTitle: 'Novidades | DisgrassiX',
        newProducts: newsData // Passa os dados de novidades
    });
});

// --- Rotas de Funcionalidade do Carrinho ---

// Rota para Adicionar ao Carrinho
app.get('/adicionar/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productToAdd = products.find(p => p.id === productId);

    if (productToAdd) {
        const existingItem = req.session.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1; // Aumenta a quantidade
        } else {
            // Adiciona o novo item
            req.session.cart.push({
                id: productToAdd.id,
                name: productToAdd.name,
                price: productToAdd.price,
                image: productToAdd.image,
                quantity: 1
            });
        }
    }
    // Redireciona para o carrinho
    res.redirect('/carrinho');
});

// Rota do Carrinho de Compras (Exibe e Calcula)
app.get('/carrinho', (req, res) => {
    let subtotal = 0;
    
    // Calcula o subtotal e o total de cada item
    const cartItems = req.session.cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return {
            ...item,
            // Formata o total do item para exibição
            itemTotal: itemTotal.toFixed(2).replace('.', ','), 
            itemQuantity: item.quantity
        };
    });

    const freteValor = 15.00;
    const totalFinal = (subtotal + freteValor).toFixed(2).replace('.', ',');
    
    res.render('cart', {
        pageTitle: 'Seu Carrinho | DisgrassiX',
        cartItems: cartItems,
        subtotal: subtotal.toFixed(2).replace('.', ','),
        frete: freteValor.toFixed(2).replace('.', ','),
        totalFinal: totalFinal
    });
});

// Rota para Remover Item do Carrinho
app.get('/remover/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    
    // Filtra o array do carrinho, removendo o item com o ID correspondente
    req.session.cart = req.session.cart.filter(item => item.id !== productId);
    
    res.redirect('/carrinho');
});


// Iniciar o Servidor
app.listen(PORT, () => {
    console.log(`DisgrassiX Server rodando em http://localhost:${PORT}`);
});