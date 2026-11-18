"use client";
import { useEffect, useState } from "react";
import { Logo } from "./Icons";
import { STORE } from "@/lib/config";
export default function Loader() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);
  useEffect(() => {
    const a = setTimeout(() => setFade(true), 1700);
    const b = setTimeout(() => setShow(false), 2300);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (!show) return null;
  return (
    <div className={"loader" + (fade ? " loader-out" : "")} role="status" aria-label="Carregando">
      <div className="loader-logo"><Logo size={84} /></div>
      <h1 className="script loader-name">{STORE.name}</h1>
      <p className="loader-slogan">{STORE.slogan}</p>
      <div className="spinner" />
    </div>
  );
}
