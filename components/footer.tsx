import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-heading tracking-wider uppercase">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/books" className="text-base text-text-muted hover:text-primary">New Releases</Link></li>
              <li><Link href="/books" className="text-base text-text-muted hover:text-primary">Bestsellers</Link></li>
              <li><Link href="/categories" className="text-base text-text-muted hover:text-primary">Fiction</Link></li>
              <li><Link href="/categories" className="text-base text-text-muted hover:text-primary">Non-Fiction</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-heading tracking-wider uppercase">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-base text-text-muted hover:text-primary">Help Center</Link></li>
              <li><Link href="/shipping" className="text-base text-text-muted hover:text-primary">Shipping Info</Link></li>
              <li><Link href="/no-refunds" className="text-base text-text-muted hover:text-primary">No Refunds</Link></li>
              <li><Link href="/contact" className="text-base text-text-muted hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-heading tracking-wider uppercase">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-base text-text-muted hover:text-primary">About Us</Link></li>
              <li><Link href="/careers" className="text-base text-text-muted hover:text-primary">Careers</Link></li>
              <li><Link href="/press" className="text-base text-text-muted hover:text-primary">Press</Link></li>
              <li><Link href="/privacy" className="text-base text-text-muted hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-text-muted text-center">&copy; 2025 SREnterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

