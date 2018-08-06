import React, {Component} from 'react';
import './App.css';
import {TodoListItem} from "./TodoListItem";
import {Footer} from "./Footer";
import {TodoItem} from "./TodoItem";
import {repository} from "./repository";
import {localRepository} from "./localRepository";

class App extends Component {
    ALL_TODOS = 'all';
    ACTIVE_TODOS = 'active';
    COMPLETED_TODOS = 'completed';
    ENTER_KEY = 13;

    state = {
        nowShowing: this.ALL_TODOS,
        editing: null,
        newTodo: '',
        todos: [],
        pending: 0
    }

    async componentDidMount() {
        this.getTodos()
    }

    getTodos = async() => {
        this.setState({ pending: this.state.pending + 1 })
        try {
            const todos = await repository.getTodos()
            this.setState({ pending: this.state.pending - 1 })
            if (this.state.pending === 0) {
                this.setState({ todos })
            }
        } catch(err) {
            this.setState({ pending: this.state.pending - 1 })
        }
    }

    handleChange = (event) => {
        this.setState({newTodo: event.target.value});
    }

    handleNewTodoKeyDown = (event) => {
        if (event.keyCode !== this.ENTER_KEY) {
            return;
        }

        event.preventDefault();

        var val = this.state.newTodo.trim();

        if (val) {
            repository.addTodo(val).then(() => !this.state.gettingTodos && this.getTodos())
            this.setState({newTodo: ''});
            this.setState(localRepository.addTodo(val, this.state))
        }
    }

    toggleAll = (event) => {
        const checked = event.target.checked;
        repository.toggleAllTodosTo(checked).then(() => !this.state.gettingTodos && this.getTodos())
        this.setState(localRepository.toggleAllTodosTo(checked, this.state))
    }

    toggle = (todoToToggle) => {
        repository.updateTodo({
            ...todoToToggle,
            completed: !todoToToggle.completed
        }).then(() => !this.state.gettingTodos && this.getTodos())
        this.setState(localRepository.updateTodo({
            ...todoToToggle,
            completed: !todoToToggle.completed
        }, this.state))
    }

    destroy = (todoToDelete) => {
        repository.deleteTodo(todoToDelete).then(() => !this.state.gettingTodos && this.getTodos())
        this.setState(localRepository.deleteTodo(todoToDelete, this.state))
    }

    edit = (todo) => {
        this.setState({editing: todo.id});
    }

    save = (todoToSave, text) => {
        repository.updateTodo({
            ...todoToSave,
            title: text
        }).then(() => !this.state.gettingTodos && this.getTodos())
        this.setState({editing: null});
        this.setState(localRepository.save({
            ...todoToSave,
            title: text
        }, this.state))
    }

    cancel = () => {
        this.setState({editing: null});
    }

    clearCompleted = () => {
        repository.deleteCompletedTodos().then(() => !this.state.gettingTodos && this.getTodos())
        this.setState(localRepository.deleteCompletedTodos(this.state))
    }

    updateShowing = (showing) => () => {
        this.setState({
            nowShowing: showing
        })
    }

    render = () => {
        const todos = this.state.todos;
        const shownTodos = todos.filter((todo) => {
            switch (this.state.nowShowing) {
                case this.ACTIVE_TODOS:
                    return !todo.completed;
                case this.COMPLETED_TODOS:
                    return todo.completed;
                default:
                    return true;
            }
        }, this);

        const activeTodoCount = todos.reduce((accum, todo) => {
            return todo.completed ? accum : accum + 1;
        }, 0)

        const completedCount = todos.length - activeTodoCount;

        const todoItems = shownTodos.map((todo) => (
            <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={this.toggle.bind(this, todo)}
                onDestroy={this.destroy.bind(this, todo)}
                onEdit={this.edit.bind(this, todo)}
                editing={this.state.editing === todo.id}
                onSave={this.save.bind(this, todo)}
                onCancel={this.cancel}
            />
        ))
        const footer = (activeTodoCount || completedCount) ?
            <Footer
                count={todos.length}
                onClearCompleted={this.clearCompleted}
                completedCount={completedCount}
                nowShowing={this.state.nowShowing}
                updateShowing={this.updateShowing}
            />
            : null
        return (
            <div>
                <header className="header">
                    <h1>todos</h1>
                    <input
                        className="new-todo"
                        placeholder="What needs to be done?"
                        value={this.state.newTodo}
                        onKeyDown={this.handleNewTodoKeyDown}
                        onChange={this.handleChange}
                        autoFocus={true}
                    />
                </header>
                <TodoListItem
                    toggleAll={this.toggleAll}
                    activeTodoCount={activeTodoCount}
                    todoItems={todoItems}
                />
                { footer }
            </div>
        );
    }
}

export default App;
