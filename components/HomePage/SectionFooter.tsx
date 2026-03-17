"use client";

import { JSX } from "react";
const subscribeContent = {
  heading: "Stay Updated",
  description:"Subscribe to our newsletter for the latest updates on inclusive hiring and talent acquisition.",
  placeholder: "Enter your Email Address",
  buttonText: "Subscribe",
  privacy: "We respect your privacy. Unsubscribe at any time.",
  copyright: "©2026 Enable Canada. All rights reserved.",
} as const;

export default function NewsletterFooter(): JSX.Element {
  return (
    <footer className="bg-[#0f1117] text-white py-16 px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col text-left">
          <h2 className="text-3xl font-semibold mb-4 sm:text-4xl">
            {subscribeContent.heading}
          </h2>
          <p className="text-gray-300 mb-8 text-base max-w-2xl sm:text-lg">
            {subscribeContent.description}
          </p>
        </header>
        <form className="w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
			<input
			  type="email"
			  placeholder={subscribeContent.placeholder}
			  className="w-full pl-6 pr-40 py-4 bg-[#1f2329] border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
			  required
			/>
			<button
			  type="submit"
			  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-8 py-3 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-medium rounded-full transition-colors duration-150"
			>
			  {subscribeContent.buttonText}
			</button>
          </div>
        </form>

        <p className="mt-8 text-sm text-gray-500">
          {subscribeContent.privacy}
        </p>
        <p className="mt-10 text-sm text-gray-600">
          {subscribeContent.copyright}
        </p>
      </div>
    </footer>
  );
}