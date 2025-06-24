import React from 'react';
import Logo from '../assets/logo.png';

function Footer() {
  return (
    <footer className="main-footer py-5">
      {}
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-4 mb-4 mb-md-0 d-flex flex-column align-items-center">
            <a className="footer-brand d-flex align-items-center mb-3 text-white text-decoration-none" href="#">
              <img src={Logo} alt="Logo NaRégua" className="footer-logo me-2" /> NaRégua
            </a>
            <p className="text-white-50">Sua barbearia de confiança, onde o estilo encontra a precisão. Agende seu
              horário e venha para o NaRégua!</p>
          </div>

          <div className="col-12 col-md-auto mb-3 mb-md-0 text-center me-md-5">
            <h5 className="text-white mb-3">Endereço/Contatos</h5>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>Avenida Um, n°100, Oitis - Contagem/MG
              </li>
              <li className="mb-2"><i className="bi bi-telephone-fill me-2"></i>(31) 9 9200-6110</li>
            </ul>
          </div>
        </div>

        <hr className="border-light my-4 opacity-25" />

        <div className="row">
          <div className="col-12 text-center text-white-50">
            <p className="mb-0">&copy; 2025 NaRégua. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;