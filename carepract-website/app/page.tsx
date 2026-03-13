"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import carepractCover from "./assets/carepract-cover.png";
import carepractLogo from "./assets/carepract-logo.png";
import { COUNTRY_NAMES } from "./components/countries";

type TimeLeft = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

type CountryOption = {
  value: string;
  label: string;
};

const calculateTimeLeft = (target: Date): TimeLeft => {
  const difference = target.getTime() - new Date().getTime();

  if (difference <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };
  }

  const secondsInDay = 1000 * 60 * 60 * 24;
  const days = Math.floor(difference / secondsInDay);
  const hours = Math.floor((difference % secondsInDay) / (1000 * 60 * 60));
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  const toTwoDigits = (value: number) => value.toString().padStart(2, "0");

  return {
    days: toTwoDigits(days),
    hours: toTwoDigits(hours),
    minutes: toTwoDigits(minutes),
    seconds: toTwoDigits(seconds),
  };
};

export default function Home() {
  const targetDate = useMemo(
    () => new Date("2026-04-13T00:00:00+05:30"),
    []
  );

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate)
  );
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    if (!isCountryOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCountryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isCountryOpen]);

  const countdownItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  const countryOptions = useMemo<CountryOption[]>(() => {
    const slugify = (name: string) =>
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    return COUNTRY_NAMES.map((country) => ({
      value: slugify(country),
      label: country,
    }));
  }, []);

  const selectedCountryLabel =
    countryOptions.find((option) => option.value === selectedCountry)?.label ??
    "Choose your Country";

  return (
    <main className="flex min-h-dvh w-full bg-[#f3f6fb] overflow-hidden">
      <section className="grid min-h-dvh w-full overflow-hidden bg-white shadow-[0_32px_70px_rgba(20,40,80,0.12)] lg:grid-cols-2">
        <div className="relative z-10 h-full">
          <div className="flex h-full flex-col overflow-y-auto px-6 py-12 sm:px-10 md:px-16 lg:px-[6vw] xl:px-[8vw] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto flex w-full max-w-130 flex-1 flex-col items-center gap-12 text-center sm:items-start sm:text-left lg:gap-14">
              <div className="flex w-full flex-col items-center space-y-4 sm:items-start">
                {/* <Image
                  src={carepractLogo}
                  alt="CarePract logo"
                  className="h-16 w-auto mx-auto sm:mx-0"
                  priority
                /> */}
                <p className="text-lg font-medium text-slate-900">
                  Our website is currently undergoing renovations.
                </p>
              </div>

              <div className="flex w-full flex-col items-center space-y-8 sm:items-start">
                <h1 className="text-[42px] font-semibold leading-tight text-[#0652C9] sm:text-[64px] sm:leading-[1.05] lg:-mt-8">
                  Coming Soon
                </h1>
                <p className="max-w-[38ch] -mt-4 text-base font-medium text-[#1b2435] sm:text-lg">
                  Guiding You to Trusted Medical <span className="text-[#0a54d8]">Care, Wherever You Are.</span>
                </p>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
                  {countdownItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex h-24 w-24 flex-col items-center justify-center rounded-full border bg-white text-center shadow-[0_12px_26px_rgba(19,42,85,0.12)] sm:h-28 sm:w-28"
                    >
                      <span className="text-3xl font-bold text-[#111a2c] sm:text-[40px]">
                        {item.value}
                      </span>
                      <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7e879a]">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <form className="flex w-full max-w-130 flex-col gap-3 sm:gap-4">
                <div ref={dropdownRef} className="relative">
                  <label htmlFor="country-trigger" className="sr-only">
                    Choose your country
                  </label>
                  <button
                    id="country-trigger"
                    type="button"
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-[#d2d7e1] bg-white px-5 text-left text-base text-[#1b2435] shadow-[0_10px_22px_rgba(12,32,72,0.06)] transition focus-visible:border-[#0a54d8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(10,84,216,0.18)]"
                    aria-haspopup="listbox"
                    aria-expanded={isCountryOpen}
                    onClick={() => setIsCountryOpen((open) => !open)}
                  >
                    <span className="truncate">
                      {selectedCountryLabel}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-[#1b2435] transition-transform ${
                        isCountryOpen ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {isCountryOpen && (
                    <div
                      className="country-listbox absolute left-0 right-0 z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border border-[#cfd6e4] bg-white shadow-[0_18px_32px_rgba(15,35,70,0.18)]"
                      role="listbox"
                      aria-labelledby="country-trigger"
                    >
                      {countryOptions.map((option) => {
                        const isActive = option.value === selectedCountry;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            onClick={() => {
                              setSelectedCountry(option.value);
                              setIsCountryOpen(false);
                            }}
                            className={`flex w-full items-center justify-between px-5 py-3 text-left text-sm font-medium transition sm:text-base ${
                              isActive
                                ? "bg-[rgba(10,84,216,0.12)] text-[#0a54d8]"
                                : "text-[#1b2435] hover:bg-[#eef3ff]"
                            }`}
                          >
                            <span>{option.label}</span>
                            {isActive && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-[#0a54d8]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <label htmlFor="notify-email" className="sr-only">
                  Enter your email
                </label>
                <div className="flex w-full overflow-hidden rounded-xl border border-[#d2d7e1] bg-white shadow-[0_12px_24px_rgba(12,32,72,0.08)] focus-within:border-[#0a54d8] focus-within:ring-2 focus-within:ring-[rgba(10,84,216,0.18)]">
                  <input
                    id="notify-email"
                    type="email"
                    placeholder="Enter your Email"
                    className="h-12 flex-1 bg-transparent px-5 text-base text-[#1b2435] placeholder:text-[#8a92a5] focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="h-12 px-6 cursor-pointer text-base font-semibold text-white transition bg-[#0a54d8] hover:bg-[#0a49bc] focus-visible:outline-none"
                  >
                    Notify Me
                  </button>
                </div>
              </form>

              <div className="w-full space-y-4 -mb-4 text-[#1a2335]">
                <h2 className="text-center text-[30px] font-bold text-[#111b2c] sm:text-left">
                  Contact us
                </h2>
                <div className="space-y-4 text-[17px] leading-relaxed text-[#1c2538]">
                  <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#edf2ff] text-[#0a54d8]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-[#111b2c]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 21s-6-4.8-6-10a6 6 0 1112 0c0 5.2-6 10-6 10z" />
                        <circle cx="12" cy="11" r="2.5" />
                      </svg>
                    </span>
                    <p className="max-w-[30ch] text-[15px] leading-relaxed text-[#1c2538] sm:text-[16px] sm:text-left">
                      Rayala Towers, No: 6, #781-785, Anna Salai,<br className="hidden sm:block" />
                      Chennai, Tamil Nadu 600002.
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#edf2ff] text-[#0a54d8]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-[#111b2c]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 5h16v14H4z" />
                        <path d="M4 7l8 6 8-6" />
                      </svg>
                    </span>
                    <a
                      href="mailto:hello@carepract.com"
                      className="text-[15px] text-[#0a54d8] underline-offset-4 hover:underline sm:text-[16px]"
                    >
                      hello@carepract.com
                    </a>
                  </div>

                  <div className="flex flex-col items-center gap-2 text-center sm:-mb-1 sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#edf2ff] text-[#0a54d8]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-[#111b2c]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5.5 4.5L9 4l1.5 4.5-2 1a11.5 11.5 0 005 5l1-2L19 14.5l-.5 3.5c-.1.8-.7 1.4-1.5 1.5-7.4.5-13-5.1-12.5-12.5.1-.8.7-1.4 1.5-1.5z" />
                      </svg>
                    </span>
                    <a
                      href="tel:+919876543210"
                      className="text-[15px] text-[#0a54d8] underline-offset-4 hover:underline sm:text-[16px]"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>

              <hr className="-my-2 w-full border-t border-[#dbe1ec]" />

              <p className="-mt-6 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-[#7d879d] sm:justify-start sm:text-left">
                <span className="text-base">©</span>
                <span>
                  {new Date().getFullYear()} CarePract. All rights reserved.
                  {/* © 2026 CarePract. All rights reserved. */}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-[#0a54d8] text-white">
          <div className="absolute inset-0">
            <Image
              src={carepractCover}
              alt="Travelers ready for medical journey"
              fill
              className="object-cover object-[50%_center] md:object-[30%_center]"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(6,82,201,0.5)_88.56%)]" />
          <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-[rgba(0,0,40,0.18)]" />

          <div className="relative flex h-full flex-col items-center justify-end px-8 pb-14 pt-28 text-center sm:px-12 md:px-16 lg:items-start lg:px-20 lg:text-left">
            <div className="max-w-xl space-y-6">
              <h2 className="text-balance text-4xl font-semibold font-Gotham Rounded leading-tight tracking-tight text-white sm:text-[58px] sm:leading-[1.05]">
                Travel for Care.
                <br />
                Return with Confidence.
              </h2>
              <p className="text-balance text-xl font-Inter font-medium leading-relaxed text-white/95">
                Affordable, high-quality medical treatments with <br /> world-class facilities and expert doctors—designed for international patients.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
