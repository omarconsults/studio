import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <HeartPulse className="h-6 w-6" />
          Health Idol Africa
        </Link>
        {/* Add navigation links here if needed in the future */}
        {/* <nav>
          <ul className="flex space-x-4">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav> */}
      </div>
    </header>
  );
}
