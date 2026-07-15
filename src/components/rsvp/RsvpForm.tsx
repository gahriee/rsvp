"use client";

import React, { useState } from "react";
import { CreateRsvpInput } from "../../lib/types";
import { createRsvpSchema } from "../../lib/validators";

interface RsvpFormProps {
  onSubmit: (data: CreateRsvpInput) => Promise<void> | void;
  selectedGiftId?: string | null;
}

export function RsvpForm({ onSubmit, selectedGiftId = null }: RsvpFormProps) {
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState(true);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setError(null);

    const rawData = {
      guestName,
      email,
      attending,
      numberOfGuests: Number(numberOfGuests),
      message,
      selectedGift: selectedGiftId,
    };

    const validation = createRsvpSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(validation.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred submitting RSVP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="guestName"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name *
        </label>
        <input
          id="guestName"
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {validationErrors.guestName && (
          <p className="mt-1 text-xs text-red-600">
            {validationErrors.guestName}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {validationErrors.email && (
          <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Will you be attending? *
        </label>
        <div className="mt-2 flex space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={attending}
              onChange={() => setAttending(true)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-800">Yes, joyfully accept</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={!attending}
              onChange={() => setAttending(false)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-800">
              No, regretfully decline
            </span>
          </label>
        </div>
      </div>

      {attending && (
        <div>
          <label
            htmlFor="numberOfGuests"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Guests *
          </label>
          <input
            id="numberOfGuests"
            type="number"
            min={1}
            max={10}
            value={numberOfGuests}
            onChange={(e) =>
              setNumberOfGuests(parseInt(e.target.value, 10) || 1)
            }
            className="mt-1 block w-24 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {validationErrors.numberOfGuests && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors.numberOfGuests}
            </p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Message for the Graduate (Optional)
        </label>
        <textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit RSVP"}
      </button>
    </form>
  );
}
