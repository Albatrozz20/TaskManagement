import React, { useEffect, useState } from "react";
import "./todo.css";
import ei from "./assets/ei.png";
import di from "./assets/di.png";
import ui from "./assets/ui.png";
import ci from "./assets/ci.png";
const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [mess, setMess] = useState("");
  const [edit, setEdit] = useState(-1);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";
  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setTitle("");
            setDescription("");
            setMess("Task added successfully !");
            setTimeout(() => {
              setMess(" ");
            }, 3000);
          } else {
            setError("Unable to create task sorry !");
          }
        })
        .catch(() => {
          setError("Unable to create task sorry !");
        });
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };

  const handleUpdate = () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + edit, {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) => {
              if (item._id === edit) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            });
            setTodos(updatedTodos);
            setMess("Task Updated successfully !");
            setTimeout(() => {
              setMess(" ");
            }, 300);

            setEdit(-1);
          } else {
            setError("Unable to create task sorry !");
          }
        })
        .catch(() => {
          setError("Unable to create task sorry !");
        });
    }
  };
  const handleEdit = (item) => {
    setEdit(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleEditCancel = () => {
    setEdit(-1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task ?")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      });
    }
  };
  return (
    <div className="container">
      <br />
      <div className="container">
        <div className="title-container rounded bg-purple p-lg-3 p-sm-2 p-1 text-w">
          <h1 className="title rounded">Tasks to be done !!</h1>
        </div>
        <br />
        <div className="input-container d-flex w-100 gap-1 ">
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="bg-w w-100 px-2"
            placeholder="Title"
          />
          <input
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="bg-w w-100 px-2"
            placeholder="Description"
          />
          <button
            onClick={handleSubmit}
            className="add-btn btn bg-purple text-w px-4"
          >
            Add
          </button>
        </div>
        {mess && <p className="text-success p-1 p-lg-2">{mess}</p>}
        {error && <p className="text-danger p-1 p-lg-2">{error}</p>}
      </div>
      <br />
      <div className="task-group container">
        <h1 className="task-text text-start text-purple">
          Tasks need to be done
        </h1>
        <br />
        <div className="d-flex flex-column-reverse">
          {todos.map((item) => (
            <div className="total container bg-w rounded  py-2 px-3">
              <div className="task-list align-items-center d-flex w-100 gap-1">
                {edit === -1 || edit !== item._id ? (
                  <>
                    <span className="w-100 d-flex flex-column align-items-start">
                      <h6>{item.title}</h6>
                      <p>
                        <i>{item.description}</i>
                      </p>
                    </span>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="input-container d-flex w-100 gap-1 ">
                        <input
                          type="text"
                          onChange={(e) => setEditTitle(e.target.value)}
                          value={editTitle}
                          className="bg-w w-100 px-2"
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          onChange={(e) => setEditDescription(e.target.value)}
                          value={editDescription}
                          className="bg-w w-100 px-2"
                          placeholder="Description"
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="btn-ei-di d-flex gap-1">
                  {edit === -1 ? (
                    <button
                      onClick={() => handleEdit(item)}
                      className="inner-btn border-0 p-0"
                    >
                      <img className="icons" src={ei} alt="Edit icon" />
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdate}
                      className="inner-btn border-0 p-0"
                    >
                      <img className="icons" src={ui} alt="Update icon" />
                    </button>
                  )}
                  {edit === -1 ? (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="inner-btn border-0 p-0"
                    >
                      <img className="icons" src={di} alt="Delete icon" />
                    </button>
                  ) : (
                    <button
                      onClick={handleEditCancel}
                      className="inner-btn border-0 p-0"
                    >
                      <img className="icons" src={ci} alt="Cancel icon" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Todo;
