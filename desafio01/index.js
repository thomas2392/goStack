const express = require('express');

const server = express();

server.use(express.json());

/**
 * A variável `projects` pode ser `const` porque um `array`
 * pode receber adições ou exclusões mesmo sendo uma constante.
 */
const projects = [
  { id: "0", title: 'Novo projeto', tasks: [] },
  { id: "1", title: 'Meu primeiro desafio', tasks: [] }
];

/**
 * Middleware que dá log no número de requisições
 */
server.use((req, res, next) => {
  console.count('Quantidade de requisições');
  return next();
});

/**
 * Middleware que checa se o projeto existe
 */
function checkIfProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  req.id = id;

  return next();
}

/**
 * Request body: id, title
 * Cadastra um novo projeto
 */
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };
  projects.push(project);

  return res.json(projects);
});

/**
 * Retorna todos os projetos
 */
server.get('/projects', (req, res) => {
  return res.json(projects);
});

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */
server.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.id].title = title;

  return res.json(projects);
});

/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */
server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  projects.splice(req.id, 1);

  return res.json(projects);
});

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id; 
 */
server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.id].tasks.push(title);

  return res.json(projects);
})

server.listen(3000);