import React from "react";
import { Sparkles } from "lucide-react";

export function Rules() {
  const rules = [
    "Be on time.",
    "No Plus One. This celebration is by invitation only.",
    "Follow the required attire.",
    "Bringing a gift is required because Irish's love language is receiving gifts.",
    "Take lots of photos and help make the celebration memorable.",
    "Be respectful and enjoy the celebration.",
    "Celebrate with good vibes only! Let's make this milestone unforgettable.",
  ];

  return (
    <section className="relative mx-auto max-w-4xl px-4 pt-12 text-slate-800">
      {/* Decorative Washi Tape */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-32 h-8 bg-gradient-to-r from-pink-200/90 to-rose-200/90 backdrop-blur-md transform rotate-2 shadow-sm flex items-center justify-center text-[10px] font-bold text-pink-800 uppercase tracking-widest">
        Important
      </div>

      <div className="relative rounded-sm bg-[#fffcf9] p-8 sm:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-pink-100/50">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 flex items-center justify-center gap-3">
            <Sparkles className="h-6 w-6 text-pink-400" />
            <span>Irish&apos;s Graduation Celebration Rules</span>
            <Sparkles className="h-6 w-6 text-pink-400" />
          </h2>
        </div>

        <ul className="space-y-5 font-serif text-lg text-slate-700">
          {rules.map((rule, index) => (
            <li key={index} className="flex items-start gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-bold text-sm shrink-0 mt-0.5 shadow-sm border border-pink-200">
                {index + 1}
              </span>
              <span className="leading-relaxed">{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
