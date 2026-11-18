"use client";
import { useState } from "react";
export default function HeroPhoto({ alt }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="hero-photo">
      {/* Coloque a foto da confeiteira em public/confeiteira.jpg */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {ok && <img src="/confeiteira.jpg" alt={alt} onError={() => setOk(false)} />}
    </div>
  );
}
