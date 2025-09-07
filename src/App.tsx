import { useState } from "react";

function TaskForm({ onAddTask, tasks }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    
    onAddTask(name, description, parentId || null);
    setName('');
    setDescription('');
    setParentId('');
  };

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

        {/* Escolher se a tarefa é principal ou dependente */}
        <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <option value="">Tarefa Principal</option>
          {tasks.map(t => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <button type="submit">Adicionar Tarefa</button>
      </form>
    </>
  );
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

  const handleAddTask = (name, description, parentId) => {
    const newTask = {
      id: Date.now(),
      name,
      description,
      parentId,   // agora guardamos a tarefa pai
      isComplete: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  return (
    <>
      <h1>To-Do List</h1>
      <TaskForm onAddTask={handleAddTask} tasks={tasks}/>
      <div>
        {tasks.map(task => (
          <Task key={task.id} task={task}/>
        ))}
      </div>
    </>
  );
}

export default App;
