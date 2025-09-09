"use client"

import type React from "react"

import { useState } from "react"
import "./App.css"

interface Task {
  id: number
  name: string
  description: string
  dependencies: number[]
  isComplete: boolean
}

function TaskForm({
  onAddTask,
  tasks,
}: { onAddTask: (name: string, description: string, dependencies: number[]) => void; tasks: Task[] }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedDeps, setSelectedDeps] = useState<number[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onAddTask(name, description, selectedDeps)
    setName("")
    setDescription("")
    setSelectedDeps([])
  }

  const toggleDependency = (taskId: number) => {
    setSelectedDeps((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <div className="card-header">
        <h2 className="card-title">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nova Tarefa
        </h2>
        <p className="card-description">Adicione uma nova tarefa à sua lista com dependências opcionais</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="task-name" className="label">
              Nome da tarefa
            </label>
            <input
              id="task-name"
              type="text"
              placeholder="Digite o nome da tarefa..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description" className="label">
              Descrição
            </label>
            <textarea
              id="task-description"
              placeholder="Descreva os detalhes da tarefa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea"
            />
          </div>

          {tasks.length > 0 && (
            <div className="form-group">
              <label className="label">Pré-requisitos</label>
              <div className="dependencies">
                {tasks.map((task) => (
                  <div key={task.id} className="dependency-item">
                    <input
                      type="checkbox"
                      id={`dep-${task.id}`}
                      checked={selectedDeps.includes(task.id)}
                      onChange={() => toggleDependency(task.id)}
                      className="checkbox"
                    />
                    <label htmlFor={`dep-${task.id}`} className="dependency-label">
                      {task.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={!name.trim()}>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Adicionar Tarefa
          </button>
        </form>
      </div>
    </div>
  )
}

function TaskCard({
  task,
  onToggle,
  isBlocked,
  dependencyNames,
}: {
  task: Task
  onToggle: (id: number) => void
  isBlocked: boolean
  dependencyNames: string
}) {
  const getStatusIcon = () => {
    if (task.isComplete) {
      return (
        <svg className="task-icon completed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22,4 12,14.01 9,11.01"></polyline>
        </svg>
      )
    }
    if (isBlocked) {
      return (
        <svg className="task-icon blocked" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12,6 12,12 16,14"></polyline>
        </svg>
      )
    }
    return (
      <svg className="task-icon pending" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    )
  }

  const getStatusBadge = () => {
    if (task.isComplete) {
      return <span className="badge badge-success">Concluída</span>
    }
    if (isBlocked) {
      return <span className="badge badge-warning">Bloqueada</span>
    }
    return <span className="badge badge-outline">Pendente</span>
  }

  const cardClasses = `card task-card ${task.isComplete ? "completed" : isBlocked ? "blocked" : ""}`

  return (
    <div className={cardClasses}>
      <div className="card-content">
        <div className="task-content">
          <div className="task-main">
            {getStatusIcon()}
            <div className="task-details">
              <h3 className={`task-name ${task.isComplete ? "completed" : ""}`}>{task.name}</h3>

              {task.description && (
                <p className={`task-description ${task.isComplete ? "completed" : ""}`}>{task.description}</p>
              )}

              {dependencyNames && (
                <div className="task-dependencies">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>
                    <strong>Dependências:</strong> {dependencyNames}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="task-actions">
            {getStatusBadge()}
            <button
              onClick={() => onToggle(task.id)}
              disabled={isBlocked}
              className={`btn btn-sm ${task.isComplete ? "btn-outline" : "btn-primary"}`}
            >
              {task.isComplete ? "Reabrir" : "Concluir"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  const handleAddTask = (name: string, description: string, dependencies: number[]) => {
    const newTask: Task = {
      id: Date.now(),
      name,
      description,
      dependencies,
      isComplete: false,
    }
    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  const handleToggleTask = (id: number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, isComplete: !task.isComplete } : task)))
  }

  const isBlocked = (task: Task) => {
    return task.dependencies.some((depId) => {
      const depTask = tasks.find((t) => t.id === depId)
      return !depTask || !depTask.isComplete
    })
  }

  const completedTasks = tasks.filter((task) => task.isComplete).length
  const totalTasks = tasks.length

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1 className="title">Lista de Tarefas</h1>
          <p className="subtitle">Organize suas tarefas com dependências inteligentes</p>

          {totalTasks > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <span className="progress-badge">
                {completedTasks} de {totalTasks} tarefas concluídas
              </span>
            </div>
          )}
        </div>

        <TaskForm onAddTask={handleAddTask} tasks={tasks} />

        <div>
          {tasks.length === 0 ? (
            <div className="card">
              <div className="card-content empty-state">
                <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <h3 className="empty-title">Nenhuma tarefa ainda</h3>
                <p className="empty-description">Comece adicionando sua primeira tarefa acima</p>
              </div>
            </div>
          ) : (
            tasks.map((task) => {
              const dependencyNames = task.dependencies
                .map((depId) => {
                  const depTask = tasks.find((t) => t.id === depId)
                  return depTask?.name || "Desconhecida"
                })
                .join(", ")

              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  isBlocked={isBlocked(task)}
                  dependencyNames={dependencyNames}
                />
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
