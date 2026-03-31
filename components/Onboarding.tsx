"use client";

import { useState } from "react";

const STORAGE_KEY = "mm-editor-onboarding-dismissed";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    title: "Úvodní text",
    description:
      "Na začátku editoru vyplňte krátký popis článku nebo produktu. Tento text se exportuje jako úvodní odstavec a je povinný.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    title: "Přidávejte bloky",
    description:
      "Z levého panelu přidávejte bloky: nadpis, text, obrázky, videa nebo kombinaci médium + text. Bloky můžete libovolně přesouvat pomocí drag & drop.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    title: "Nahrávejte média",
    description:
      "Obrázky a videa nahrajete kliknutím do media bloku, nebo vyberte z knihovny již nahraných souborů. Soubory se automaticky ukládají na Shoptet.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
  },
  {
    title: "Exportujte HTML",
    description:
      'Až budete spokojeni, klikněte na "Exportovat HTML". Vygenerovaný kód zkopírujte a vložte do Shoptetu. Kód používá třídy mm-* pro snadné stylování.',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>
    ),
  },
  {
    title: "Importujte existující obsah",
    description:
      'Máte už hotový HTML kód? Použijte "Importovat HTML" — editor rozpozná mm-* třídy a načte obsah zpět do bloků, které můžete upravovat.',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
    ),
  },
];

function getInitialVisibility(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) !== "true";
}

export default function Onboarding() {
  const [visible, setVisible] = useState(getInitialVisibility);
  const [currentStep, setCurrentStep] = useState(0);

  if (!visible) return null;

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const handleClose = (permanent: boolean) => {
    if (permanent) {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    setVisible(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "36px 32px 28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        {/* Kroky indikátor */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "6px",
            marginBottom: "28px",
          }}
        >
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentStep(i)}
              style={{
                width: i === currentStep ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background:
                  i === currentStep ? "var(--accent)" : "var(--border2)",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* Ikona */}
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 20px",
            background: "var(--accent-bg)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent)",
          }}
        >
          {step.icon}
        </div>

        {/* Obsah */}
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: "18px",
            fontWeight: "700",
            color: "var(--text)",
          }}
        >
          {step.title}
        </h2>
        <p
          style={{
            margin: "0 0 32px",
            fontSize: "14px",
            lineHeight: "1.6",
            color: "var(--muted)",
            maxWidth: "380px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {step.description}
        </p>

        {/* Navigace */}
        {!isLast ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => handleClose(false)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                color: "var(--muted)",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Přeskočit
            </button>
            <div style={{ display: "flex", gap: "8px" }}>
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((s) => s - 1)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: "var(--surface2)",
                    color: "var(--text)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Zpět
                </button>
              )}
              <button
                onClick={() => setCurrentStep((s) => s + 1)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  border: "none",
                  background: "var(--gradient)",
                  color: "black",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                Další
              </button>
            </div>
          </div>
        ) : (
          /* Poslední krok — dvě tlačítka */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => handleClose(false)}
              style={{
                width: "100%",
                padding: "12px 24px",
                borderRadius: "10px",
                border: "none",
                background: "var(--gradient)",
                color: "black",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              Rozumím
            </button>
            <button
              onClick={() => handleClose(true)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                color: "var(--muted)",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Příště již nezobrazovat
            </button>
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((s) => s - 1)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "transparent",
                  color: "var(--muted)",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                Zpět
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
