import React from 'react';
import Logo from '../assets/logo.png';

function Header() {
  return (
    <header className="main-header py-3">
      {}
      <nav className="navbar navbar-expand-lg navbar-dark container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img src={Logo} alt="Logo" className="header-logo me-2" /> NaRégua
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="../../front/html/Agendamento.html">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Contato</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Informações</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="../../front/html/Agendamento.html">Agende Seu Horário</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;