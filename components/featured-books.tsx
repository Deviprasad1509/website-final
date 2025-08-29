import React from 'react';

const books = [
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    image: '/psychology-of-money-book-cover.png',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    image: '/dune-book-cover.png',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    image: '/atomic-habits-cover.png',
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    image: '/midnight-library-cover.png',
  },
];

export default function FeaturedBooks() {
  return (
    <section className="bg-background">
      <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
        <header className="text-center">
          <h2 className="text-xl font-bold text-foreground sm:text-3xl">
            Featured Books
          </h2>

          <p className="max-w-md mx-auto mt-4 text-muted-foreground">
            Check out our hand-picked selection of must-read books.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-4 mt-8 lg:grid-cols-4">
          {books.map((book) => (
            <li key={book.title}>
              <a href="#" className="block overflow-hidden group">
                <img
                  src={book.image}
                  alt=""
                  className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                />

                <div className="relative pt-3 bg-background">
                  <h3
                    className="text-xs text-muted-foreground group-hover:underline group-hover:underline-offset-4"
                  >
                    {book.title}
                  </h3>

                  <p className="mt-2">
                    <span className="sr-only"> Regular Price </span>

                    <span className="tracking-wider text-foreground"> {book.author} </span>
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
