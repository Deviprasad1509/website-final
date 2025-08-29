import React from 'react';

export default function Stats() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Trusted by the best
          </h2>

          <p className="mt-4 text-muted-foreground sm:text-xl">
            We are proud to partner with the leading publishers and authors to bring you the best reading experience.
          </p>
        </div>

        <div className="mt-8 sm:mt-12">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div
              className="flex flex-col rounded-lg border border-border px-4 py-8 text-center"
            >
              <dt className="order-last text-lg font-medium text-muted-foreground">
                Total Books
              </dt>

              <dd className="text-4xl font-extrabold text-primary md:text-5xl">
                10k+
              </dd>
            </div>

            <div
              className="flex flex-col rounded-lg border border-border px-4 py-8 text-center"
            >
              <dt className="order-last text-lg font-medium text-muted-foreground">
                Happy Readers
              </dt>

              <dd className="text-4xl font-extrabold text-primary md:text-5xl">2M+</dd>
            </div>

            <div
              className="flex flex-col rounded-lg border border-border px-4 py-8 text-center"
            >
              <dt className="order-last text-lg font-medium text-muted-foreground">
                Authors
              </dt>

              <dd className="text-4xl font-extrabold text-primary md:text-5xl">5k+</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

