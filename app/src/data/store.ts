// Shared mock data store for OJ-Track

export type DesignStatus = "Not Started" | "Pending" | "Done";
export type PaymentStatus = "Not Paid" | "Partial" | "Paid";
export type ProjectType = "Logo" | "UI/UX" | "Branding" | "Print" | "Web" | "Illustration";

export interface Client {
  id: string;
  projectName: string;
  clientName: string;
  projectType: ProjectType;
  rateAmount: number;
  revisionCount: number;
  dateNegotiated: string; // ISO date string
  designStatus: DesignStatus;
  paymentStatus: PaymentStatus;
}

export const clients: Client[] = [
  {
    id: "1",
    projectName: "Brand Identity Redesign",
    clientName: "Jessa Reyes",
    projectType: "Branding",
    rateAmount: 12000,
    revisionCount: 3,
    dateNegotiated: "2026-01-15",
    designStatus: "Done",
    paymentStatus: "Paid",
  },
  {
    id: "2",
    projectName: "App UI Design",
    clientName: "Mark Santos",
    projectType: "UI/UX",
    rateAmount: 18500,
    revisionCount: 5,
    dateNegotiated: "2026-02-03",
    designStatus: "Done",
    paymentStatus: "Paid",
  },
  {
    id: "3",
    projectName: "Logo Concept Pack",
    clientName: "Nina Cruz",
    projectType: "Logo",
    rateAmount: 5000,
    revisionCount: 2,
    dateNegotiated: "2026-02-18",
    designStatus: "Done",
    paymentStatus: "Paid",
  },
  {
    id: "4",
    projectName: "Product Flyer Series",
    clientName: "Leo Tan",
    projectType: "Print",
    rateAmount: 4500,
    revisionCount: 1,
    dateNegotiated: "2026-03-01",
    designStatus: "Pending",
    paymentStatus: "Partial",
  },
  {
    id: "5",
    projectName: "E-commerce Website",
    clientName: "Sofia Lim",
    projectType: "Web",
    rateAmount: 35000,
    revisionCount: 0,
    dateNegotiated: "2026-03-12",
    designStatus: "Pending",
    paymentStatus: "Partial",
  },
  {
    id: "6",
    projectName: "Character Illustration Set",
    clientName: "Ryan Dela Cruz",
    projectType: "Illustration",
    rateAmount: 9000,
    revisionCount: 4,
    dateNegotiated: "2026-03-25",
    designStatus: "Done",
    paymentStatus: "Paid",
  },
  {
    id: "7",
    projectName: "Company Profile Layout",
    clientName: "Ana Villanueva",
    projectType: "Print",
    rateAmount: 7500,
    revisionCount: 2,
    dateNegotiated: "2026-04-08",
    designStatus: "Pending",
    paymentStatus: "Not Paid",
  },
  {
    id: "8",
    projectName: "Mobile App Prototype",
    clientName: "Kevin Go",
    projectType: "UI/UX",
    rateAmount: 22000,
    revisionCount: 6,
    dateNegotiated: "2026-04-20",
    designStatus: "Not Started",
    paymentStatus: "Not Paid",
  },
  {
    id: "9",
    projectName: "Social Media Kit",
    clientName: "Bea Ocampo",
    projectType: "Branding",
    rateAmount: 6000,
    revisionCount: 1,
    dateNegotiated: "2026-05-03",
    designStatus: "Not Started",
    paymentStatus: "Not Paid",
  },
  {
    id: "10",
    projectName: "Restaurant Menu Design",
    clientName: "Chris Morales",
    projectType: "Print",
    rateAmount: 3500,
    revisionCount: 0,
    dateNegotiated: "2026-05-17",
    designStatus: "Not Started",
    paymentStatus: "Not Paid",
  },
  {
    id: "11",
    projectName: "Portfolio Website",
    clientName: "Ella Torres",
    projectType: "Web",
    rateAmount: 15000,
    revisionCount: 2,
    dateNegotiated: "2026-05-28",
    designStatus: "Pending",
    paymentStatus: "Partial",
  },
  {
    id: "12",
    projectName: "Event Poster Pack",
    clientName: "Dan Aquino",
    projectType: "Print",
    rateAmount: 4000,
    revisionCount: 1,
    dateNegotiated: "2026-06-05",
    designStatus: "Not Started",
    paymentStatus: "Not Paid",
  },
];

// Monthly client counts for chart (Jan-Jun 2026)
export const monthlyClients = [
  { month: "Jan", clients: 2, sales: 17000 },
  { month: "Feb", clients: 3, sales: 27500 },
  { month: "Mar", clients: 3, sales: 48500 },
  { month: "Apr", clients: 2, sales: 29500 },
  { month: "May", clients: 3, sales: 24500 },
  { month: "Jun", clients: 1, sales: 4000 },
];

// Computed stats
export function getStats() {
  const totalSales = clients.reduce((acc, c) => acc + c.rateAmount, 0);
  const totalClients = clients.length;
  const notStarted = clients.filter((c) => c.designStatus === "Not Started").length;
  const pending = clients.filter((c) => c.designStatus === "Pending").length;
  const done = clients.filter((c) => c.designStatus === "Done").length;
  const payNotPaid = clients.filter((c) => c.paymentStatus === "Not Paid").length;
  const payPartial = clients.filter((c) => c.paymentStatus === "Partial").length;
  const payPaid = clients.filter((c) => c.paymentStatus === "Paid").length;

  return {
    totalSales,
    totalClients,
    notStarted,
    pending,
    done,
    payNotPaid,
    payPartial,
    payPaid,
  };
}
