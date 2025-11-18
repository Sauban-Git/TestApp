import { scale, verticalScale } from "@/utils/style"

export const colors = {
  light: {
    background: "#FFFFFF",
    card: "#FFF9DB",
    primary: "#FACC15",
    primaryDark: "#EAB308",
    text: "#1A1A1A",
    textSecondary: "#525252",
    border: "#E5E7EB",
    highlight: "#FEF3C7",
    senderMessage: "#FACC15",
    recieverMessage: "#F5F5F5",
    timeText: "rgba(0,0,0,0.45)",
    statusText: "rgba(0,0,0,0.45)",
    link: "#2563EB",
    linkHighlight: "#1E40AF"
  },

  dark: {
    background: "#0D0D0D",
    card: "#1A1A1A",
    primary: "#FACC15",
    primaryDark: "#EAB308",
    text: "#FFFFFF",
    textSecondary: "#D4D4D4",
    border: "#2D2D2D",
    highlight: "#3A3200",
    senderMessage: "#EAB308",
    recieverMessage: "#1F1F1F",

    timeText: "rgba(255,255,255,0.45)",
    statusText: "rgba(255,255,255,0.45)",
    link: "#60A5FA",
    linkHighlight: "#3B82F6"
  },
};

export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _20: scale(20),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
};

export const radius = {
  _3: verticalScale(3),
  _6: verticalScale(6),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _30: verticalScale(30),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
  _70: verticalScale(70),
  _80: verticalScale(80),
  _90: verticalScale(90),
  full: 200,
};
