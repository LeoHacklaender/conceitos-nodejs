const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid repository ID' });
  }

  return next();
}

//List all repositories
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

//Create a repository
app.post("/repositories", (request, response) => {
  
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);

});

//Update a repository by ID 
app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;  

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if( repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository Not Found'});
  }

  const repository = {
    id: id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

//Delete a repository by ID
app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if( repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository Not Found'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

//Like the repository by repository ID
app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  
  const repository = repositories.find( repository => repository.id === id);  

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
