import { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (value) => {
    setQuery(value);

    if (!value) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/search?q=${value}`
      );
      setResults(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🔎 Search Engine</h1>

      <input
        type="text"
        placeholder="Search product..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px"
        }}
      />

      {results.length === 0 && query && <p>No results found</p>}

      {results.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default App;