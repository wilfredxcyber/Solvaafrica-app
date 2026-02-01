export interface UserProfile {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  gender: string | null;
  referralCode: string;
  userID: string;
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
  fileCode: string;
  fileName: string;
  parentDirectory: string;
  onItemPress: () => void;
  onDeletePress: () => void; // Should not take any parameters
  platform?: string; // Optional platform prop
}

export interface PickedFile {
  name: string;
  mimeType: string;
  fileUri: string;
  imageUri: string;
}