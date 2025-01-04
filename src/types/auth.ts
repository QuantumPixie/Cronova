export type UserResponse = {
  id: string;
  email: string;
  name: string | null;
  menopauseStage: 'PERIMENOPAUSE' | 'MENOPAUSE' | 'POSTMENOPAUSE' | null;
  createdAt: Date;
};
