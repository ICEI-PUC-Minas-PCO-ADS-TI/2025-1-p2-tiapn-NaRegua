import React from 'react';
import ProductCard from './ProductCard.jsx';
import MattePomada from '../assets/MattePomada.png';
import DeluxePomada from '../assets/DeluxePomada.png';
import GelBoy from '../assets/Gel_boy.png';
import GelCola from '../assets/Gel_cola.png';
import CamisaCorin from '../assets/CamisaCorin.png';
import InterCamisa from '../assets/InterCamisa.png';
import PSGCamisa from '../assets/PSG_Camisa.png';
import CamisaLacos from '../assets/Camisa_Lacos.png';
import CamisaNike from '../assets/Camisa_Nike.png';



const products = [
  {
    id: "pomada-matte",
    name: "Pomada Matte",
    image: MattePomada,
    category: "pomada"
  },
  {
    id: "pomada-deluxe",
    name: "Pomada Deluxe",
    image: DeluxePomada,
    category: "pomada"
  },
  {
    id: "gel-boy",
    name: "Gel Boy",
    image: GelBoy,
    category: "gel"
  },
  {
    id: "gel-cola",
    name: "Gel Cola",
    image: GelCola,
    category: "gel"
  },
  {
    id: "camisa-corinthians",
    name: "Camisa Corinthians",
    image: CamisaCorin,
    category: "camisa"
  },
  {
    id: "camisa-inter-milao",
    name: "Camisa Inter de Milão",
    image: InterCamisa,
    category: "camisa"
  },
  {
    id: "camisa-psg",
    name: "Camisa PSG",
    image: PSGCamisa,
    category: "camisa"
  },
  {
    id: "camisa-lacoste",
    name: "Camisa Lacoste",
    image: CamisaLacos,
    category: "camisa"
  },
  {
    id: "camisa-nike",
    name: "Camisa Nike",
    image: CamisaNike,
    category: "camisa"
  },
];

function ProductList() {
  return (
    <div className="row g-4 justify-content-center">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;