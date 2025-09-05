export interface UserProfile {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  gender: string | null;
  referralCode: string;
  userID: string;
  role: string;
  freelancer?: any;
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
  fileCode?: string;
  fileName: string;
  filePath: string;
  parentDirectory: FileDirectory;
}

export interface ImageViewerProps {
  imageViewerVisible: boolean;
  imageUri: string | null;
  setImageViewerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DownloadItemViewProps {
  source: string;
  fileCode: string;
  fileName: string;
  parentDirectory: FileDirectory;
  onDeletePress?: (item: string) => void;
  onItemPress: () => void;
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
}
