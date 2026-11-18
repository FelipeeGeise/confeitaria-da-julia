import Link from "next/link";
import { brl } from "@/lib/config";
export function CakeImage({ src, alt }) {
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt={alt} loading="lazy" /> : <div className="cake-ph" aria-label={alt}>🎂</div>;
}
export default function CakeCard({ p }) {
  return (
    <Link href={`/produtos/${p.id}`} className="cake-card">
      <div className="cake-img"><CakeImage src={p.image} alt={p.name} /></div>
      <div className="cake-info"><h3>{p.name}</h3><span className="price">{brl(p.price)}</span></div>
    </Link>
  );
}
