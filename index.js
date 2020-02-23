
const express = require('express');
const server = express();
server.use(express.json());

const projects = [];

server.use((req,res, next)=>{
      console.time('Request');
      console.log(`Metodo: ${req.method}; URL: ${req.url}`);
      next();    
      console.timeEnd('Request');
})

function checkNotEmpaty(req, res, next){
      const project = req.body;
      if(!project.id){
            return res.status(400).json({error: 'Project ID is required! '});
      }
      if(!project.name){
            return res.status(400).json({error: 'Project name is required!'});
      }

      req.project = project;
      return next();
}

function checkProjectExists(req, res, next){
      const {id} = req.params;
      const project = projects.find(p => p.id == id);

      if(!project){
            return res.status(400).json({error: "Project not found!"});
      }
      
      return next();
}

function checkNameNotEmpaty(req, res, next){
      const {name} = req.body;
      if(!name){
            return res.status(400).json({error: "Project name is required!"});
      }

      return next();
}

function checkTaskNotEmpaty(req, res, next){
      const {task} = req.body;
      if(!task){
            return res.status(400).json({error: "Task is required!"});
      }

      return next();
}

server.post('/projects',  checkNotEmpaty, (req, res)=> {
      const project = req.project;
      projects.push(project);
      return res.json({"message": "Project successfully registered!"});
})

server.get('/projects', (req, res) => {
      return res.json(projects);
})

server.put('/projects/:id', checkProjectExists, checkNameNotEmpaty, (req, res) => {
      const {name} = req.body;
      const {id} = req.params;

      projects.find(p => p.id==id).name = name;
      return res.json({"message": "Project name changed!"});
})

server.delete('/projects/:id', checkProjectExists, (req,res) => {
      const projectIndex = projects.findIndex(p => p.id==req.params.id);
      projects.splice(projectIndex, 1);
      return res.json({"message": "Project successfully deleted!"});
})

server.post('/projects/:id/tasks', checkProjectExists, checkTaskNotEmpaty, (req, res) => {
      const {id} = req.params;
      const {task} = req.body;
      projects.find(p => p.id==id).task.push(task);

      return res.json({"message": "Task successfully registered!"});
})
server.listen(3000);