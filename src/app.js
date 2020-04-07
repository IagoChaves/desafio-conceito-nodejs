const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());


function validateId(request,response,next){
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).send({error: 'ID is not valid'});
  }
  return next();
}

app.use('/repositories/:id', validateId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repositorie = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  }
  repositories.push(repositorie);
  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;

  let RepositorieIndex = repositories.findIndex(repo => repo.id === id);
  if(RepositorieIndex < 0){
    return response.status(400).send({error: 'Can not find id into repositories.'});
  }

  const {title,url,techs} = request.body;
  return response.json(repositories[RepositorieIndex] = {
    id,
    url: url ? url : repositories[RepositorieIndex].url,
    title: title ? title : repositories[RepositorieIndex].title,
    techs: techs ? techs : repositories[RepositorieIndex].techs,
    likes: repositories[RepositorieIndex].likes
  });

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  let RepositorieIndex = repositories.findIndex(repo => repo.id === id);
  
  if(RepositorieIndex < 0){
    return response.status(400).send({error: 'No ID found.'});
  }
  repositories.splice(RepositorieIndex,1);
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  let RepositorieIndex = repositories.findIndex(repo => repo.id === id);
  
  if(RepositorieIndex < 0){
    return response.status(400).json({error: 'No ID found.'});
  }

  repositories[RepositorieIndex].likes += 1;
  return response.json(repositories[RepositorieIndex]);
});

module.exports = app;
