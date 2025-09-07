import { useState } from "react";

function TaskForm({ onAddTask }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onAddTask(name, description);
    setName('');
    setDescription('');
  };

  return (
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
  );
}

function Task({ task, onToggle }) {
  return (
    <div>
      <h3 style={{ textDecoration: task.isComplete ? "line-through" : "none" }}>{task.name}</h3>
      <p>{task.description}</p>
      <button onClick={() => onToggle(task.id)}>
        {task.isComplete ? "Reabrir" : "Concluir"}
      </button>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (name, description) => {
    const newTask = {
      id: Date.now(),
      name,
      description,
      isComplete: false,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleToggleTask = (id) => {
    setTasks(prev => 
      prev.map(task => 
        task.id == id ? { ...task, isComplete: !task.isComplete } : task
      )
    )
  }

  return (
    <div>
      <h1>To-Do List</h1>
      <TaskForm onAddTask={handleAddTask}/>
      <div>
        {tasks.map(task => (
          <Task key={task.id} task={task} onToggle={handleToggleTask}/>
        ))}
      </div>
    </div>
  );
}

export default App;