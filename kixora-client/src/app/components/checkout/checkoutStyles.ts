/** Shared styles for the checkout steps */
export const fieldLabelSx = { fontWeight: 700, color: "#374151", mb: 0.5, display: "block" } as const;

export const inputSx = { "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fcfcfd" } } as const;

export const stepTitleSx = { fontWeight: 800, mb: 0.5, fontSize: "1.05rem" } as const;

export const stepSubtitleSx = { color: "#6b7280", mb: 2.5, fontSize: "0.82rem" } as const;

export const optionCardSx = (selected: boolean) =>
  ({
    p: 2,
    borderRadius: "12px",
    border: selected ? "2px solid #111827" : "1px solid #e5e7eb",
    bgcolor: selected ? "#fafafa" : "#ffffff",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }) as const;

export const primaryButtonSx = {
  bgcolor: "#111827",
  color: "#ffffff",
  borderRadius: "10px",
  fontWeight: 800,
  fontSize: "0.88rem",
  px: 3.5,
  py: 1,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": { bgcolor: "#000000", boxShadow: "none" },
} as const;
