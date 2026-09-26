import axios from "axios";
import { serverApi } from "../../lib/config";
import { Member, LoginInput, MemberInput } from "../../lib/types/member";

class MemberService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getRestaurant(): Promise<Member> {
    try {
      const url = `${this.path}/member/restaurant`;
      const result = await axios.get(url, { withCredentials: true });
      return result.data;
    } catch (err) {
      console.log("Error, getRestaurant:", err);
      throw err;
    }
  }

  public async getTopUsers(): Promise<Member[]> {
    try {
      const url = `${this.path}/member/top-users`;
      const result = await axios.get(url, { withCredentials: true });
      return result.data;
    } catch (err) {
      console.log("Error, getTopUsers:", err);
      throw err;
    }
  }

  public async getMemberDetail(): Promise<Member> {
    try {
      const url = `${this.path}/member/detail`;
      const result = await axios.get(url, { withCredentials: true });
      return result.data;
    } catch (err) {
      console.log("Error, getMemberDetail:", err);
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const url = `${this.path}/member/login`;
      const result = await axios.post(url, input, { withCredentials: true });
      return result.data.member;
    } catch (err) {
      console.log("Error, login:", err);
      throw err;
    }
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const url = `${this.path}/member/signup`;
      const result = await axios.post(url, input, { withCredentials: true });
      return result.data.member;
    } catch (err) {
      console.log("Error, signup:", err);
      throw err;
    }
  }

  public async logout(): Promise<boolean> {
    try {
      const url = `${this.path}/member/logout`;
      const result = await axios.post(url, {}, { withCredentials: true });
      return result.data.logout;
    } catch (err) {
      console.log("Error, logout:", err);
      throw err;
    }
  }
}

export default MemberService;
