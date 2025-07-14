"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  BarChart, 
  Book, 
  ShoppingBag
} from 'lucide-react';

const navItems = [
  { name: '首页', path: '/', icon: Home },
  { name: '记录', path: '/fit-record', icon: Calendar },
  { name: '工具', path: '/fit-tool', icon: BarChart },
  { name: '教程', path: '/fit-tech', icon: Book },
  { name: '商城', path: '/fit-mall', icon: ShoppingBag },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 h-16 z-50">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`flex flex-col items-center justify-center w-full h-full
                ${isActive 
                  ? 'text-blue-500 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'}`}
            >
              <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 