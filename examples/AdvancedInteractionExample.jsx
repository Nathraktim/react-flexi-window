import React, { useState } from 'react';
import WindowComponent from 'react-flexi-window';

function AdvancedInteractionExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted!\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#f3f4f6',
      position: 'relative',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Form Window */}
      <WindowComponent
        w={400}
        h={350}
        x={50}
        y={50}
        minW={300}
        minH={250}
        boundary={true}
        windowColor="blue-500/15"
        windowBorderColor="blue-600/30"
        windowBorderRadius="lg"
        windowBorder={1}
        windowShadow="lg"
        windowBackgroundBlur="sm"
        zIndex={1}
      >
        <div style={{ padding: '20px', height: '100%' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1e40af' }}>Contact Form</h3>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Message:</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Submit Form
            </button>
          </form>
        </div>
      </WindowComponent>

      {/* Todo List Window */}
      <WindowComponent
        w={350}
        h={400}
        x={500}
        y={80}
        minW={300}
        minH={300}
        boundary={true}
        windowColor="green-500/15"
        windowBorderColor="green-600/30"
        windowBorderRadius="lg"
        windowBorder={1}
        windowShadow="lg"
        windowBackgroundBlur="sm"
        zIndex={2}
      >
        <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#059669' }}>Todo List</h3>
          
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add new todo..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <button
              onClick={addTodo}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {todos.length === 0 ? (
              <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No todos yet. Add one above!</p>
            ) : (
              todos.map(todo => (
                <div
                  key={todo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    marginBottom: '8px',
                    backgroundColor: todo.completed ? '#f3f4f6' : 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    style={{ marginRight: '10px' }}
                  />
                  <span
                    style={{
                      flex: 1,
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#6b7280' : '#111827'
                    }}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </WindowComponent>

      {/* Info Window */}
      <WindowComponent
        w={300}
        h={200}
        x={100}
        y={450}
        minW={250}
        minH={150}
        boundary={true}
        windowColor="purple-500/15"
        windowBorderColor="purple-600/30"
        windowBorderRadius="lg"
        windowBorder={1}
        windowShadow="lg"
        windowBackgroundBlur="sm"
        zIndex={3}
      >
        <div style={{ padding: '20px', height: '100%' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#7c3aed' }}>Interactive Elements Demo</h3>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4b5563' }}>
            This example shows how the WindowComponent handles interactive elements seamlessly:
          </p>
          <ul style={{ margin: '0', fontSize: '12px', color: '#6b7280', paddingLeft: '20px' }}>
            <li>✅ Forms and inputs work normally</li>
            <li>✅ Buttons and links are clickable</li>
            <li>✅ Text selection is preserved</li>
            <li>✅ Drag from empty areas to move windows</li>
          </ul>
        </div>
      </WindowComponent>
    </div>
  );
}

export default AdvancedInteractionExample;
