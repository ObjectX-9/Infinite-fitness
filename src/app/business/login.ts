import { User } from "@/model/user/type";
import { request } from "@/utils/request";

class LoginBusiness {
  async login(
    username: string,
    password: string
  ): Promise<{ token: string; user: User }> {
    const response = await request.post<{ token: string; user: User }>(
      "auth/login",
      {
        username,
        password,
      }
    );
    return response.data;
  }

  async register(userData: {
    username: string;
    password: string;
    email?: string;
    phone?: string;
    nickname?: string;
  }): Promise<User> {
    const response = await request.post<User>("auth/register", userData);
    return response.data;
  }
}

export const loginBusiness = new LoginBusiness();
