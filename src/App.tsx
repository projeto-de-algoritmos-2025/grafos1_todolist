

function TaskForm() {
  return (
    <>
      <form>
        <input 
          type="text"
          placeholder="Nome da tarefa" 
        />
        <input 
          type="text" 
          placeholder="Descrição"
        />
        <button type="submit">Adicionar Tarefa</button>
      </form>
    </>
  )
}

function App() {
  

  return (
    <>
      <h1>Todolist</h1>
      <TaskForm/>
    </>
  )
}

export default App
