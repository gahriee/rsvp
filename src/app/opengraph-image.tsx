import { ImageResponse } from "next/og";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

export const runtime = "edge";

export const alt = `${EVENT_DETAILS.graduate.firstName}'s Graduation Celebration`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          backgroundImage: "linear-gradient(to bottom right, #0f172a, #1e1b4b, #312e81)",
          color: "white",
          padding: "60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 28px",
            border: "2px solid #fbbf24",
            borderRadius: "9999px",
            backgroundColor: "rgba(251, 191, 36, 0.1)",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#fbbf24",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            🎓 You&apos;re Invited!
          </span>
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            marginBottom: "20px",
            color: "#ffffff",
            display: "flex",
          }}
        >
          {EVENT_DETAILS.graduate.fullName}&apos;s Graduation
        </div>

        <div
          style={{
            fontSize: 32,
            color: "#cbd5e1",
            marginBottom: "48px",
            maxWidth: "900px",
            display: "flex",
          }}
        >
          {EVENT_DETAILS.graduate.degree} in {EVENT_DETAILS.graduate.major} · Class of {EVENT_DETAILS.graduate.classYear}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: 24,
            color: "#fbbf24",
            fontWeight: 500,
          }}
        >
          <span>📅 {EVENT_DETAILS.event.date}</span>
          <span>·</span>
          <span>📍 {EVENT_DETAILS.event.venueName}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
