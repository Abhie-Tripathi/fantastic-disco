export interface UserResponse {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    token?: string;
    profilePicture:string | null;
    companyId?: string | null;
    isVerified?:boolean;
    role?:string|null
  }