import { useState } from "react";


function TaskForm({ onAddTask }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // adicionar funcao pra salvar as infos da tarefa
    onAddTask(name, description);
    if(!name) return;
    setName('');
    setDescription('');
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="Nome da tarefa" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Adicionar Tarefa</button>
      </form>
    </>
  )
}

function Task({ task }) {
  return (
    <div>
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <button>Concluir</button>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (name, description) => {
    const newTask = {
      id: Date.now(),
      name: name,
      description: description,
      isComplete: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }

  return (
    <>
      <h1>Todolist</h1>
      <TaskForm onAddTask={handleAddTask}/>
      <div>
        {tasks.map(task => (
          <Task key={task.id} task={task}/>
        ))}
      </div>
    </>
  )
}

export default App
