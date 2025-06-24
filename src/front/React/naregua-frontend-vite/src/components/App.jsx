import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ProductList from './ProductList.jsx';
import '../styles/TelaProdutos.css';

function App() {
  return (
    <div className="App">
      <Header />
      {}
      <main className="container py-4">
        <ProductList />
      </main>
      <Footer />
    </div>
  );
}

export default App;