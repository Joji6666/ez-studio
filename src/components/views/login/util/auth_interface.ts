export interface IAuthStore {
  loginInfo: {
    id: number;
  };
  setLoginInfo: (id: number) => void;
}
