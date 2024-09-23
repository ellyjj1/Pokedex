import pokeball from '../assets/Poke_ball_small.png';  // Import the image

import React from 'react'

export default function Footer() {
  return (
<footer className="relative overflow-hidden bg-neutral-200">
   <div className="relative z-10">
        <div className="w-full max-w-5xl px-4 xl:px-0 py-10 lg:pt-16 mx-auto">
          <div className="inline-flex items-center">
            <img src={pokeball} alt="Poke Ball Logo" className="w-16 h-auto" />

            <div className="border-s border-neutral-700 ps-5 ms-5">
              <p className="text-sm text-neutral-400">
                2024 Jingjing Yu
                <a
                  className="text-sm text-neutral-400 ml-4"
                  href="https://github.com/ellyjj1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>

                <a
                  className="text-sm text-neutral-400 ml-4"
                  href="https://www.jingjing-portfolio.online/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}