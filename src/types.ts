export interface UserProfile {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  gender: string | null;
  referralCode: string;
  userID: string;
  role?: "user" | "freelancer" | string;
  freelancer?: string | number | { id?: string | number; _id?: string | number } | null;
  freelancerId?: string | number | { id?: string | number; _id?: string | number } | null;
  freelancerProfile?: string | number | { id?: string | number; _id?: string | number } | null;
  freelancerProfileId?: string | number | { id?: string | number; _id?: string | number } | null;
  hasServiceProfile?: boolean;
}
export interface ILoginForm {
  email: string;
  password: string;
}
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface SavedFile {
  path: string;
  album: string;
}

export type FileDirectory = "Courses" | "Projects";

export interface DownloadedFileRef {
  fileName: string;
  filePath: string;
  parentDirectory: FileDirectory;
  fileCode?: string;
  platform?: string; // 'web' | 'ios' | 'android'
  downloadDate?: string;
}

export interface ImageViewerProps {
  imageViewerVisible: boolean;
  imageUri: string | null;
  setImageViewerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DownloadItemViewProps {
  source: string;
  fileCode?: string;
  fileName: string;
  parentDirectory: FileDirectory;
  onItemPress: () => void;
  onDeletePress?: () => void; // Optional in filter/search lists
  platform?: string; // Optional platform prop
}

export interface PickedFile {
  name: string;
  mimeType: string;
  fileUri: string;
  imageUri: string;
}

export interface Job {
  id: number;
  title: string;
  status: string[];
  description: string;
  createdAt: string;
}

export interface ServiceType {
  id: string;
  title: string;
  description: string;
}

export interface FreelancerProfile {
  id: number;
  bio?: string;
  categoryId?: number;
  fullName?: string;
  phoneNumber?: string;
  portfolioLink?: string;
  profilePic?: string;
  startingAmount?: string;
  whatsappLink?: string;
  location?: string;
}
