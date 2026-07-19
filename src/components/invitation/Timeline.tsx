import React from "react";
import { Calendar, Sparkles, Wine, Award, Utensils, Camera, Clock } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

export function Timeline() {
  const { timeline } = EVENT_DETAILS;

  if (!timeline || timeline.length === 0) return null;

  const renderIcon = (iconKey: string) => {
    switch (iconKey) {
      case "glass":
        return <Wine className="h-5 w-5 text-white" />;
      case "award":
        return <Award className="h-5 w-5 text-white" />;
      case "utensils":
        return <Utensils className="h-5 w-5 text-white" />;
      case "camera":
        return <Camera className="h-5 w-5 text-white" />;
      default:
        return <Clock className="h-5 w-5 text-white" />;
    }
  };

  return (
    <section id="timeline" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl border-2 border-pink-200/90 bg-white/90 p-8 sm:p-12 shadow-xl shadow-pink-100/60 overflow-hidden">
        {/* Decorative Scrapbook Tape Header */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 w-56 h-8 bg-pink-200/90 backdrop-blur-md rounded-sm border border-pink-300 shadow-md transform -rotate-1 flex items-center justify-center text-xs font-bold text-pink-900 tracking-widest uppercase select-none gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>Celebration Schedule</span>
        </div>

        <div className="text-center mt-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-500">
            Graduation Day Schedule
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-slate-900 flex items-center justify-center gap-2">
            <span>Event Timeline</span>
            <Sparkles className="h-6 w-6 text-pink-400" />
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto font-serif italic">
            Here is what we have planned for our memorable afternoon and evening together in the garden!
          </p>
        </div>

        {/* Vertical Timeline List */}
        <div className="relative border-l-2 border-pink-200 ml-4 sm:ml-32 space-y-10 py-2">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative pl-8 sm:pl-10 group">
              {/* Milestone Circle Badge */}
              <div className="absolute -left-5 top-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 text-white shadow-md shadow-pink-200 group-hover:scale-110 transition-transform">
                {renderIcon(item.icon)}
              </div>

              {/* Time pill for mobile & tablet/desktop */}
              <div className="sm:absolute sm:-left-36 sm:top-1 sm:w-28 sm:text-right">
                <span className="inline-block rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700 border border-pink-200 shadow-sm">
                  {item.time}
                </span>
              </div>

              {/* Content Card */}
              <div className="rounded-2xl border border-pink-100 bg-pink-50/40 p-5 shadow-sm hover:bg-pink-50/70 hover:border-pink-200 transition-all">
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed font-serif">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
