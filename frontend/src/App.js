import './App.css';

function App() {
  const handleClick = async() => {
    const response = await fetch('http://localhost:8000/');
    const data = await response.json();
    console.log(data);
  }

  return (
    <div className="App">
      <button onClick={handleClick}>Click me pls</button>
    </div>
  );
}

export default App;