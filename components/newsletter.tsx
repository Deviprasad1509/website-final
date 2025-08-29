import React from 'react';

export default function Newsletter() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-heading sm:text-4xl">
            Subscribe to our Newsletter
          </h2>
          <p className="mt-4 text-lg leading-8 text-text-muted">
            Get the latest updates on new releases, special offers, and curated reading lists.
          </p>
        </div>
        <form className="mt-10 mx-auto max-w-md">
          <div className="flex gap-x-4">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input min-w-0 flex-auto"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="btn"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
