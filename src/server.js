import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

// Rota para cadastro
app.post('/cadastrar', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password, 
                number: req.body.number
            },
        });
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
});

// Rota para login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && user.password === password) { // Verifica se a senha coincide
            res.status(200).json({ message: 'foi caralho' }); // Retorna a mensagem desejada
        } else {
            res.status(401).json({ error: 'Email ou senha incorretos' }); // Mensagem clara em caso de falha
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

app.put('/:email/rec', async (req, res) => {
    const { email } = req.params;
    const { newPassword } = req.body;

    try {
        // Aqui você deve adicionar lógica para verificar se o email existe
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Atualiza a senha do usuário  
        const updatedUser = await prisma.user.update({
            where: { email: email },
            data: { password: newPassword }, // Certifique-se de hash a senha antes de salvar
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao alterar a senha' });
    }
});



app.delete('/:id', async(req, res) => {
    const users = await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({message: 'Usuário deletado com sucesso'})
})


app.listen(7777, () => {
    console.log('Servidor rodando na porta 7777');
});