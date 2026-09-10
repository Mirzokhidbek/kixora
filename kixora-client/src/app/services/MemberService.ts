/**
 * ============================================================================
 * MemberService.ts - Client API Service for User & Restaurant Authentication
 * ============================================================================
 * Handles Member Signup, Login, Google OAuth, Profile Updates, and Session
 * verification with Bearer token header injection and cookie credentials.
 */

import axios from "axios";
import { serverApi } from "../../lib/config";
import type { Member, LoginInput, MemberInput } from "../../lib/types/member";

// Setup global Axios interceptor for Bearer token authorization
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class MemberService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  /**
   * Fetch active Restaurant member information (brand info, phone, address).
   */
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

  /**
   * Fetch Top active members / leaderboard based on activity points.
   */
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

  /**
   * Fetch current authenticated member's complete details.
   */
  public async getMemberDetail(): Promise<Member> {
    const url = `${this.path}/member/detail`;
    const result = await axios.get(url, { withCredentials: true });
    return result.data;
  }

  public async updateMember(input: any): Promise<Member> {
    try {
      const url = `${this.path}/member/update`;
      const formData = new FormData();
      if (input.memberNick) formData.append("memberNick", input.memberNick);
      if (input.memberPhone) formData.append("memberPhone", input.memberPhone);
      if (input.memberAddress) formData.append("memberAddress", input.memberAddress);
      if (input.memberDesc) formData.append("memberDesc", input.memberDesc);
      if (input.memberImage) formData.append("memberImage", input.memberImage);

      const result = await axios.post(url, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return result.data;
    } catch (err) {
      console.log("Error, updateMember:", err);
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    const url = `${this.path}/member/login`;
    const result = await axios.post(url, input, { withCredentials: true });
    if (result.data?.accessToken) {
      localStorage.setItem("access_token", result.data.accessToken);
    }
    const member = result.data?.member || result.data;
    return member;
  }

  public async googleLogin(credential: string, userData?: any): Promise<Member> {
    const url = `${this.path}/member/google-login`;
    const result = await axios.post(
      url,
      { credential, userData },
      { withCredentials: true }
    );
    if (result.data?.accessToken) {
      localStorage.setItem("access_token", result.data.accessToken);
    }
    const member = result.data?.member || result.data;
    return member;
  }

  public async signup(input: MemberInput): Promise<Member> {
    const url = `${this.path}/member/signup`;
    const result = await axios.post(url, input, { withCredentials: true });
    if (result.data?.accessToken) {
      localStorage.setItem("access_token", result.data.accessToken);
    }
    const member = result.data?.member || result.data;
    return member;
  }

  public async logout(): Promise<boolean> {
    try {
      localStorage.removeItem("access_token");
      const url = `${this.path}/member/logout`;
      const result = await axios.post(url, {}, { withCredentials: true });
      return result.data.logout;
    } catch {
      localStorage.removeItem("access_token");
      return true;
    }
  }
}

export default MemberService;
