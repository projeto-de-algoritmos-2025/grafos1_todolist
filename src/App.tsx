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

  const toogleDependency = (taskId) => {
    if (selectedDeps.includes(taskId)) {
      setSelectedDeps(selectedDeps.filter(id => id !== taskId));
    } else {
      setSelectedDeps([...selectedDeps, taskId]);
    }
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
        {/* <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <option value="">Tarefa Principal</option>
          {tasks.map(t => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select> */}

        <div>
          <label>Pré-requisitos</label>
          {tasks.map(task => (
            <div key={task.id}>
              <label>
                <input 
                  type="checkbox" 
                  value={task.id}
                  checked={selectedDeps.includes(task.id)}
                  onChange={() => toogleDependency(task.id)}
                />
                {task.name}
              </label>
            </div>
          ))}
        </div>

        <button type="submit">Adicionar Tarefa</button>
      </form>
    </>
  );
}

function Task({ task, onToggle, isBlocked, dependencyNames }) {
  return (
    <div>
      <h3 style={{ textDecoration: task.isComplete ? "line-through" : "none" }}>{task.name}</h3>
      <p>{task.description}</p>
      <p><strong>Dependências:</strong> {dependencyNames.length > 0 ? dependencyNames : 'Nenhuma'}</p>
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
      dependencies,   // agora guardamos a tarefa pai
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
    <>
      <h1>To-Do List</h1>
      <TaskForm onAddTask={handleAddTask} tasks={tasks}/>
      <div>
        {tasks.map(task => {
          const dependencyNames = task.dependencies.map(dependencyId => {
            const dependecyTask = tasks.find(t => t.id === dependencyId);
            return dependecyTask.name;
          }).join(', ');
          
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
    </>
  );
}

export default App;
