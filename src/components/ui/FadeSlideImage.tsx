"use client";

import React, { useEffect, useState, useRef } from "react";

interface FadeSlideImageProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "down";
  className?: string;
}

export function FadeSlideImage({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: FadeSlideImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentElem = elementRef.current;
    if (!currentElem) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(currentElem);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, []);

  const getTransformStyle = () => {
    if (isVisible) return "translate-x-0 translate-y-0 opacity-100 scale-100";
    switch (direction) {
      case "up":
        return "translate-y-12 opacity-0 scale-95";
      case "down":
        return "-translate-y-12 opacity-0 scale-95";
      case "left":
        return "translate-x-12 opacity-0 scale-95";
      case "right":
        return "-translate-x-12 opacity-0 scale-95";
      default:
        return "translate-y-12 opacity-0 scale-95";
    }
  };

  return (
    <div
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${getTransformStyle()} ${className}`}
    >
      {children}
    </div>
  );
}
