export type UniversityType = "Federal" | "State" | "Private";

export interface Faculty {
  name: string;
  departments: string[];
}

export interface University {
  name: string;
  type: UniversityType;
  faculties: Faculty[];
}

export const universities: University[] = [
  {
    name: "University of Lagos",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Physics"],
      },
      {
        name: "Arts",
        departments: ["English", "History"],
      },
    ],
  },
  {
    name: "Lagos State University",
    type: "State",
    faculties: [
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration"],
      },
    ],
  },
  {
    name: "Covenant University",
    type: "Private",
    faculties: [
      {
        name: "Engineering",
        departments: ["Computer Engineering", "Electrical Engineering"],
      },
    ],
  },
];


// Banks list
export const BANKS = [
  "Access Bank",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "Guaranty Trust Bank (GTB)",
  "United Bank for Africa (UBA)",
  "Zenith Bank",
  "Stanbic IBTC",
  "Ecobank",
  "FCMB",
  "Polaris Bank",
  "Providus Bank",
  "Wema Bank",
  "Sterling Bank",
  "Unity Bank",
];