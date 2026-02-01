export interface JobOffer {
  id: string;
  jobTitle: string;
  jobType: "remote" | "onsite" | "hybrid";
  postingDate: string;
  description: string;
}
export const jobOffersData: JobOffer[] = [
  {
    id: "1",
    jobTitle: "Frontend Developer",
    jobType: "remote",
    postingDate: "2025-06-07",
    description:
      "We are looking for a React developer to build modern UIs for our web platform. Experience with TypeScript and Tailwind CSS is a plus.",
  },
  {
    id: "2",
    jobTitle: "Backend Engineer",
    jobType: "onsite",
    postingDate: "2025-06-05",
    description:
      "Join our backend team to build scalable APIs using Node.js and Express. Familiarity with PostgreSQL and Redis is required.",
  },
  {
    id: "3",
    jobTitle: "Product Manager",
    jobType: "hybrid",
    postingDate: "2025-06-03",
    description:
      "Seeking a Product Manager to lead cross-functional teams, define product vision, and deliver features from concept to launch.",
  },
  {
    id: "4",
    jobTitle: "UI/UX Designer",
    jobType: "remote",
    postingDate: "2025-06-01",
    description:
      "Design clean and intuitive user interfaces. Must have experience with Figma, user research, and prototyping tools.",
  },
  {
    id: "5",
    jobTitle: "DevOps Engineer",
    jobType: "onsite",
    postingDate: "2025-05-30",
    description:
      "Looking for a DevOps expert to manage CI/CD pipelines and cloud infrastructure (AWS, Docker, Kubernetes).",
  },
];

export const data = [
  {
    id: "1",
    serviceName: "Graphics & Design",
    serviceSub: "Logo & Brand Identity, Gaming, etc",
    servicePerson: [
      {
        personDesc: "Make outstanding cartoon, mascot and character logo",
        minPrice: "8,000",
      },
    ],
  },
  {
    id: "2",
    serviceName: "Digital Marketing",
    serviceSub: "Social Media Marketing, SEO",
    servicePerson: [
      {
        personDesc: "Boost your business with SEO & Ads",
        minPrice: "12,000",
      },
    ],
  },
  {
    id: "3",
    serviceName: "Programming & Tech",
    serviceSub: "Website Development, Maintenance",
    servicePerson: [
      {
        personDesc: "Build modern websites & apps",
        minPrice: "15,000",
      },
    ],
  },
  {
    id: "4",
    serviceName: "Video & Animation",
    serviceSub: "Video Editing, Video Ads & Commercials",
    servicePerson: [
      {
        personDesc: "Engaging video ads and animations",
        minPrice: "10,000",
      },
    ],
  },
];
