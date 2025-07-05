// Navigation configuration shared between Navbar and Footer
export const mainNavLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/found/post", label: "Post Found", icon: "upload" },
  { to: "/found/pending", label: "Pending", icon: "clock" },
  { to: "/found/resolved", label: "Resolved", icon: "check-circle" },
  { to: "/found/mine", label: "My Posts", icon: "list" },
  { to: "/claims/mine", label: "My Claims", icon: "file-text" },
];

export const authNavLinks = [
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
];

export const legalLinks = [
  { to: "/terms", label: "Terms & Conditions", icon: "file-text" },
  { to: "/privacy", label: "Privacy Policy", icon: "shield" },
];
