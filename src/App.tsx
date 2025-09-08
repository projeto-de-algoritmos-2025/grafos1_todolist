import { useState } from "react";

function TaskForm({ onAddTask, tasks }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDeps, setSelectedDeps] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    onAddTask(name, description, selectedDeps);
    setName('');
    setDescription('');
    setSelectedDeps([]);
  };

  const toggleDependency = (taskId) => {
    setSelectedDeps((prev) =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
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

      <div style={{ marginTop: "10px" }}>
        <label><strong>Pré-requisitos:</strong></label>
        {tasks.length === 0 && <p style={{ fontSize: "12px" }}>Nenhuma tarefa disponível</p>}
        {tasks.map(task => (
          <div key={task.id}>
            <label>
              <input 
                type="checkbox" 
                value={task.id}
                checked={selectedDeps.includes(task.id)}
                onChange={() => toggleDependency(task.id)}
              />
              {task.name}
            </label>
          </div>
        ))}
      </div>

      <button type="submit" style={{ marginTop: "10px" }}>
        Adicionar Tarefa
      </button>
    </form>
  );
}

function Task({ task, onToggle, isBlocked, dependencyNames }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
      <h3 style={{ textDecoration: task.isComplete ? "line-through" : "none" }}>
        {task.name}
      </h3>
      <p>{task.description}</p>
      <p>
        <strong>Dependências:</strong>{" "}
        {dependencyNames.length > 0 ? dependencyNames : "Nenhuma"}
      </p>
      <button 
        onClick={() => onToggle(task.id)} 
        disabled={isBlocked}
      >
        {task.isComplete ? "Reabrir" : "Concluir"}
      </button>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (name, description, dependencies) => {
    const newTask = {
      id: Date.now(),
      name,
      description,
      dependencies, // lista de ids
      isComplete: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleToggleTask = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, isComplete: !task.isComplete }
          : task
      )
    );
  };

  const isBlocked = (task) => {
    return task.dependencies.some(depId => {
      const depTask = tasks.find(t => t.id === depId);
      return !depTask || !depTask.isComplete;
    });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>To-Do List</h1>

      <TaskForm onAddTask={handleAddTask} tasks={tasks} />

      <div>
        {tasks.map(task => {
          const dependencyNames = task.dependencies
            .map(depId => {
              const depTask = tasks.find(t => t.id === depId);
              return depTask?.name || "Desconhecida";
            })
            .join(", ");

          return (
            <Task 
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              isBlocked={isBlocked(task)}
              dependencyNames={dependencyNames}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;