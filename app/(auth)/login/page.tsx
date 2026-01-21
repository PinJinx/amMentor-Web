"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import { sendOtp, verifyOtp } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import { toast } from "react-toast";

export default function LoginPage() {
  type UserRole = "mentee" | "mentor";



  const [role, setRole] = useState<UserRole>("mentee");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpRequestSend, setOtpRequestSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);

  const isEmailValid = email.includes("@") && email.includes(".");
  const canSendOtp = isEmailValid && !otpRequestSend;

  const router = useRouter();
  const { login, isLoggedIn, isInitialized } = useAuth();

  useEffect(() => {
    setOtp("");
    setOtpSent(false);
  }, [email]);

  useEffect(() => {
    if (!isInitialized || hasRedirected) return;

    const emailInStorage = localStorage.getItem("email");
    if (isLoggedIn && emailInStorage) {
      setHasRedirected(true);
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, isInitialized, router, hasRedirected]);

  const handleGenerateOtp = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      toast.warn("Please enter a valid email address");
      return;
    }

    try {
      setOtpRequestSent(true);
      await sendOtp(email);
      setOtpRequestSent(false);
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP. Please try again.");
      setOtpRequestSent(false);
    }
  };

  const handleLogin = async () => {
    try {
      const user = await verifyOtp(email, otp);
      if (user.role !== role) {
        toast.warn(`Registered as ${user.role}, not ${role}`);
        setOtpSent(false);
        return;
      }

      const capitalizedRole = (role.charAt(0).toUpperCase() + role.slice(1)) as
        | "Mentee"
        | "Mentor";

      localStorage.setItem("email", user.email);
      localStorage.setItem("name", user.name);
      localStorage.setItem("userRole", capitalizedRole);
      localStorage.setItem("isLoggedIn", "true");

      login(capitalizedRole);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Something went wrong during login.");
    }
  };

  if (loading) return <div className="loader" />;

  return (
    <div className="w-full max-w-[340px] mx-auto">
      <div className="space-y-5">
        {/* Logo */}
        <div>
          <div className="text-v1-text-white flex justify-center items-center text-4xl font-bold">
            amMENT<span className="text-v1-primary-yellow">&lt;&gt;</span>R
          </div>

          <div className="text-center mb-6 mt-3">
            <p className="text-v1-text-muted text-[11px] tracking-[0.15em] uppercase font-medium">
              Professional Growth
            </p>
          </div>
        </div>

        {/* Login As */}
        <div>
          <label className="text-v1-text-muted text-[10px] uppercase tracking-[0.15em] mb-2.5 block font-medium">
            Login As
          </label>

          <div className="relative w-full">
            <button
              onClick={() => setOpen(!open)}
              className="
                bg-v1-bg-input
                text-v1-text-white
                w-full py-3.5 px-4
                rounded-xl
                flex justify-between items-center
                border border-v1-bg-hover
                hover:border-v1-bg-hover-strong
                transition-all
              "
            >
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-v1-primary-yellow flex items-center justify-center mr-3">
                  <svg
                    className="h-4 w-4 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="capitalize text-[15px]">{role}</span>
              </div>

              <svg
                className={`h-5 w-5 transition-transform text-v1-grey ${
                  open ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {open && (
              <div
                className="
                absolute mt-2 w-full rounded-xl
                bg-v1-bg-input
                border border-v1-bg-hover
                shadow-2xl z-10 overflow-hidden
              "
              >
                {["mentee", "mentor"].map((r) => (
                  <div
                    key={r}
                    onClick={() => {
                      setRole(r as UserRole);
                      setOpen(false);
                    }}
                    className="
                      px-4 py-3.5
                      hover:bg-v1-bg-hover
                      cursor-pointer capitalize
                      text-v1-text-white
                      transition-colors
                      text-[15px]
                    "
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-v1-text-muted text-[10px] uppercase tracking-[0.15em] mb-2.5 block font-medium">
            Email Address
          </label>

          <div
            className="
            flex items-center
            bg-v1-bg-input
            rounded-xl px-4 py-3.5
            border border-v1-bg-hover
            focus-within:border-v1-bg-hover-strong
            transition-colors
          "
          >
            <svg
              className="h-5 w-5 text-v1-grey mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>

            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                bg-transparent
                text-v1-text-white
                placeholder-v1-text-placeholder
                focus:outline-none
                w-full text-[15px]
              "
            />
          </div>
        </div>

        {/* OTP */}
        {otpSent && (
          <div>
            <label className="text-v1-text-muted text-[10px] uppercase tracking-[0.15em] mb-2.5 block font-medium">
              OTP Code
            </label>

            <div
              className="
              flex items-center
              bg-v1-bg-input
              rounded-xl px-4 py-3.5
              border border-v1-bg-hover
              focus-within:border-v1-bg-hover-strong
              transition-colors
            "
            >
              <svg
                className="h-5 w-5 text-v1-grey mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="
                  bg-transparent
                  text-v1-text-white
                  placeholder-v1-text-placeholder
                  focus:outline-none
                  w-full text-[15px]
                "
              />
            </div>
          </div>
        )}

        {/* Button */}
        {!otpSent ? (
          <button
            onClick={handleGenerateOtp}
            disabled={
              !canSendOtp
            }
            className={`
              w-full py-4 px-6 rounded-xl font-semibold
              transition mt-2 flex items-center justify-center
              text-[15px]
              ${
                (canSendOtp)
                  ? "bg-v1-primary-yellow hover:bg-v1-primary-yellow-hover text-black"
                  : "bg-v1-bg-hover text-v1-text-placeholder cursor-not-allowed"
              }
            `}
          >
            <span className="tracking-wide">
              {" "}
              {otpSent ? "LOGIN" : otpRequestSend ? "SENDING OTP" : "SEND OTP"}
            </span>
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="
              w-full bg-v1-primary-yellow
              hover:bg-v1-primary-yellow-hover
              text-black font-semibold
              py-4 px-6 rounded-xl
              transition mt-2
              flex items-center justify-center
              text-[15px]
            "
          >
            <span className="tracking-wide">LOGIN</span>
            <ArrowRight />
          </button>
        )}

        {/* Footer */}
        <div className="text-center pt-6">
          <p className="text-v1-text-muted-strong text-[11px]">
            © 2024 amMENTOR. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
