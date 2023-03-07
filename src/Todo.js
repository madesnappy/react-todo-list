import React, { useState, useEffect } from "react";
import styles from "./Todo.module.css";

export default function Todo() {
  const [todos, setTodos] = React.useState([]);

  const [input, setInput] = useState("");

  const [quote, setQuote] = useState("");

  const [quoteAuthor, setQuoteAuthor] = useState("");

  useEffect(() => {
    // console.log("useEffect");
    const todos = localStorage.getItem("todos");
    if (todos) {
      setTodos(JSON.parse(todos));
    }
  }, []);

  const fetchInspiration = async () => {
    await fetch("https://api.quotable.io/random")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setQuote(data.content);
        setQuoteAuthor(data.author);
      });
  };

  useEffect(() => {
    fetchInspiration();
  }, []);

  const addTodo = (e) => {
    e.preventDefault();
    if (!input) return;
    console.log(`Adding todo: ${input}`);
    // capitalize first letter
    const formatted_input = input.charAt(0).toUpperCase() + input.slice(1);
    const newTodos = [{ text: formatted_input, isCompleted: false }, ...todos];
    // sort with completed at the bottom
    newTodos.sort((a, b) => {
      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;
      return 0;
    });
    setTodos(newTodos);
    setInput("");
    // add to localstorage
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const completeTodo = (index) => {
    console.log(`Completing todo: ${index}`);
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;
    newTodos.sort((a, b) => {
      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;
      return 0;
    });
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const removeTodo = (index) => {
    console.log(`Removing todo: ${index}`);
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const updateTodo = (index) => (e) => {
    console.log(`Updating todo: ${index}`);
    const newTodos = [...todos];
    newTodos[index].text = e.target.value;
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const clearTodos = (e) => {
    e.preventDefault();
    console.log("Clearing todos");
    setTodos([]);
    localStorage.setItem("todos", JSON.stringify([]));
  };

  return (
    <div className={styles.todo}>
      <h1>Todo List</h1>

      <blockquote>
        {quote}
        <cite>{quoteAuthor}</cite>
      </blockquote>

      <form className={styles.todo__add} onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Add a todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className={styles.buttons}>
          <button type="submit" className={styles.primary}>
            Add
          </button>

          <button type="button" onClick={clearTodos}>
            Clear All
          </button>
        </div>
      </form>
      {todos.length === 0 && <p>A clean slate.</p>}
      <ul>
        {todos.map((todo, idx) => (
          <li key={idx} className={todo.isCompleted ? styles.complete : ""}>
            <input
              value={todo.text}
              onChange={updateTodo(idx)}
              className={styles.todo__input}
              disabled={todo.isCompleted ? "disabled" : ""}
            />
            <div className={styles.buttons}>
              <button
                className={styles.primary}
                onClick={() => completeTodo(idx)}>
                &#10003; Complete
              </button>
              <button onClick={() => removeTodo(idx)}>&#10005; Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
