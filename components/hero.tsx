import React from 'react';

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-text-heading sm:text-6xl">
            Discover Your Next <span className="text-primary">Favorite Book</span>.
          </h1>
          <p className="mt-6 text-lg leading-8 text-text-muted">
            Explore our vast collection of ebooks and audiobooks. Find your next great read from our curated lists and bestsellers.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href="/books" className="btn">
              Explore Books
            </a>
            <a href="/about" className="text-sm font-semibold leading-6 text-text-heading">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
