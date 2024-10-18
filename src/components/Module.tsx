// components/Module.tsx
import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ModuleProps {
  title: string;
  description: string;
  icon: LucideIcon;
  linkHref: string;
  isLoggedIn: boolean;
}

const Module: React.FC<ModuleProps> = ({ title, description, icon: Icon, linkHref, isLoggedIn }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push('/login');
    }
  };

  return (
    <Link href={linkHref} onClick={handleClick} className="block">
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center mb-4">
          <Icon className="text-blue-500 mr-2" size={24} />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
      </div>
    </Link>
  );
};

export default Module;