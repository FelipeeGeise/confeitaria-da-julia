"use client";
import { useRef } from "react";
import CakeCard from "./CakeCard";
export default function Carousel({ products }) {
  const ref = useRef(null);
  const go = (dir) => {
    const el = ref.current; if (!el) return;
    el.scrollBy({ left: dir * (el.firstChild?.offsetWidth + 20 || 300), behavior: "smooth" });
  };
  if (!products.length) return <p className="empty">Em breve novos bolos por aqui.</p>;
  return (
    <div className="carousel">
      <button className="arrow left" onClick={() => go(-1)} aria-label="Anterior">‹</button>
      <div className="track" ref={ref}>{products.map((p) => <CakeCard key={p.id} p={p} />)}</div>
      <button className="arrow right" onClick={() => go(1)} aria-label="Próximo">›</button>
    </div>
  );
}
