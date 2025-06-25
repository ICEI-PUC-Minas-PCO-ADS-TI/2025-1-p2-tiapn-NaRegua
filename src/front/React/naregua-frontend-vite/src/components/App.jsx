// naregua-frontend-vite/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ProductList from './ProductList.jsx';
import '../styles/TelaProdutos.css';

function App() {
  return (
    <div className="App">
      <Router> {}
        <Header /> {}
        <main className="container py-4">
          <Routes>
            {}
            <Route path="/" element={<ProductList />} />
            {}
          </Routes>
        </main>
        <Footer /> {}
      </Router>
    </div>
  );
}

export default App;