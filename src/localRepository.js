export const localRepository = {
    addTodo(val, state) {
        const { todos } = state
        const id = todos.length + 1
        const todo = { id, title: val, completed: false }
        todos.push(todo)
        return { todos: todos }
    },

    toggleAllTodosTo(value, state) {
        const { todos } = state
        const toggleTodos = todos.map((todo) => ({ ...todo, completed: value }))
        return { todos: toggleTodos }
    },

    deleteCompletedTodos(state) {
        const { todos } = state
        const notCompleted = (todo) => !todo.completed
        const activeTodos = todos.filter(notCompleted)
        return { todos: activeTodos }
    },

    updateTodo(todoToUpdate, state) {
        const { todos } = state
        const todo = todos.find((todo) => todo.id === todoToUpdate.id)
        todo.completed = todoToUpdate.completed
        todo.title = todoToUpdate.title
        return { todos: todos }
    },

    deleteTodo(todoToDelete, state) {
        const todos = state.todos.filter((t) => todoToDelete.id !== t.id)
        return { todos: todos }
    },
}