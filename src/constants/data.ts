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
  // Federal Universities
  {
    name: "University of Ibadan (UI)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "University of Lagos (UNILAG)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "University of Nigeria, Nsukka (UNN)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Ahmadu Bello University, Zaria (ABU)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Obafemi Awolowo University (OAU)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "University of Benin (UNIBEN)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "University of Ilorin (UNILORIN)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "University of Port Harcourt (UNIPORT)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "University of Calabar (UNICAL)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "University of Jos (UNIJOS)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "University of Maiduguri (UNIMAID)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "University of Uyo (UNIUYO)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Bayer University Kano (BUK)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Usmanu Danfodiyo University, Sokoto (UDUSOK)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "University of Abuja (UNIABUJA)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Federal University of Technology, Akure (FUTA)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Federal University of Technology, Owerri (FUTO)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Federal University of Technology, Minna (FUTMINNA)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Federal University of Agriculture, Abeokuta (FUNAAB)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Michael Okpara University of Agriculture, Umudike (MOUAU)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Federal University of Petroleum Resources, Effurun (FUPRE)",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Nigerian Defence Academy (NDA), Kaduna",
    type: "Federal",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Geology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering", "Petroleum Engineering", "Mechatronics Engineering", "Agricultural Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Medicine & Surgery (MBBS)", "Nursing Science", "Pharmacy", "Medical Laboratory Science", "Physiotherapy", "Anatomy", "Physiology", "Public Health"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations", "Criminology & Security Studies"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Fine & Applied Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Agronomy", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry", "Food Science & Technology"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling", "Library & Information Science"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },

  // State Universities
  {
    name: "Lagos State University (LASU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Delta State University (DELSU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Ambrose Alli University (AAU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Ekiti State University (EKSU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Osun State University (UNIOSUN)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Olabisi Onabanjo University (OOU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Rivers State University (RSU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Abia State University (ABSU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Benue State University (BSU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Imo State University (IMSU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Kaduna State University (KASU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Ebonyi State University (EBSU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Enugu State University of Science and Technology (ESUT)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Kwara State University (KWASU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Nasarawa State University, Keffi (NSUK)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Plateau State University (PLASU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Taraba State University (TSU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Adamawa State University (ADSU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments:[ "Education & Biology", "Education & Chemistry", "Education & Mathematics", "EducationalManagement", "Guidance & Counselling"]
      }, 
      {
        name: "Law",
        departments:["Law (LLB)"]
      },
    ]
  },
  {
    name: "Akwa Ibom State University (AKSU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Bauchi State University, Gadau (BASUG)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Cross River University of Technology (CRUTECH)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
  {
    name: "Gombe State University (GSU)",
    type: "State",
    faculties: [
      {
        name: "Science",
        departments: ["Computer Science", "Mathematics", "Statistics", "Physics", "Chemistry", "Biochemistry", "Microbiology", "Biology", "Environmental Science"]
      },
      {
        name: "Engineering / Technology",
        departments: ["Civil Engineering", "Mechanical Engineering", "Electrical/Electronics Engineering", "Computer Engineering", "Chemical Engineering"]
      },
      {
        name: "Medical & Health Sciences",
        departments: ["Nursing Science", "Medical Laboratory Science", "Public Health", "Physiology", "Anatomy"]
      },
      {
        name: "Social Sciences",
        departments: ["Economics", "Political Science", "Sociology", "Psychology", "Geography", "International Relations"]
      },
      {
        name: "Arts / Humanities",
        departments: ["English & Literary Studies", "History & International Studies", "Linguistics", "Philosophy", "Theatre Arts", "Religious Studies"]
      },
      {
        name: "Management Sciences",
        departments: ["Accounting", "Business Administration", "Banking & Finance", "Marketing", "Public Administration", "Entrepreneurship"]
      },
      {
        name: "Agriculture",
        departments: ["Agriculture", "Animal Science", "Crop Science", "Soil Science", "Fisheries & Aquaculture", "Forestry"]
      },
      {
        name: "Education",
        departments: ["Education & Biology", "Education & Chemistry", "Education & Mathematics", "Educational Management", "Guidance & Counselling"]
      },
      {
        name: "Law",
        departments: ["Law (LLB)"]
      }
    ]
  },
]
// Bank List
export const BANKS =[
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
