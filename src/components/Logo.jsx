// Brand logo mark — reusable SVG
import { Droplet } from 'lucide-react';

export default function Logo({ size = 40, color = '#fff' }) {
  return (
    <div className="brand-mark" style={{ width: size, height: size }}>
      <Droplet size={size * 0.55} color={color} fill={color} />
    </div>
  );
}
