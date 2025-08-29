import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-text-heading">
              BuisBuz
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/books" className="text-text-body hover:text-primary">
              Books
            </Link>
            <Link href="/categories" className="text-text-body hover:text-primary">
              Categories
            </Link>
            <Link href="/authors" className="text-text-body hover:text-primary">
              Authors
            </Link>
            <Link href="/about" className="text-text-body hover:text-primary">
              About
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="btn">
              Login
            </Link>
            <Link href="/signup" className="hidden sm:block text-text-body hover:text-primary">
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
