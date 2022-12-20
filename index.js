const express = require('express');
const path    = require('path');
const fs      = require('fs/promises');

const app = express();

app.use(express.json());

const jsonPath = path.resolve('./files/tasks.json');

//GET
app.get('/tasks', async (req, res) =>{
  const jsonFile = await fs.readFile(jsonPath, 'utf-8');
  res.send(jsonFile);
});

//POST
app.post('/tasks', async (req, res) =>{
  const toDo      = req.body;
  const toDoArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

  const index = toDoArray.length - 1;
  const newId = toDoArray[index].id + 1;

  toDoArray.push({...toDo, id: newId});
  await fs.writeFile(jsonPath, JSON.stringify(toDoArray));
  res.end();
});

//PUT
app.put('/tasks', async (req, res) =>{
  const toDoArray   = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
//descomposicion del body;
  const {id, title, description, status}  = req.body;

  const toDoIndex = toDoArray.findIndex(toDo => toDo.id === id);
  toDoArray[toDoIndex].title       = title;
  toDoArray[toDoIndex].description = description;
  toDoArray[toDoIndex].status      = status;
  
  await fs.writeFile(jsonPath, JSON.stringify(toDoArray));

  res.send("Tarea actualizada");
  res.end();
})
;

//DELETE  
app.delete('/tasks', async (req, res) => {
  const toDo      = req.body;
  const toDoArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

  for(let i = 0; i < toDoArray.length; i ++){
    if(toDo.id === toDoArray[i].id){
      toDoArray.splice(i, 1);
      await fs.writeFile(jsonPath, JSON.stringify(toDoArray));
    }
  }
  res.end();
});

const PORT = 8000;

app.listen(PORT, () =>{
  console.log(`Servidor escuchando por el puerto ${PORT}`)
});