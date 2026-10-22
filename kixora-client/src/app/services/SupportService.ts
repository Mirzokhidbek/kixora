import axios from "axios";
import { serverApi } from "../../lib/config";

/** Help-page contact form and newsletter (stored on the server, visible in the admin inbox) */
class SupportService {
  private readonly path = serverApi;

  public async sendMessage(input: { name: string; contact: string; message: string }): Promise<void> {
    await axios.post(`${this.path}/support/message`, input, { withCredentials: true });
  }

  public async subscribe(email: string): Promise<void> {
    await axios.post(`${this.path}/newsletter/subscribe`, { email }, { withCredentials: true });
  }

  public async unsubscribe(email: string, token: string): Promise<void> {
    await axios.post(`${this.path}/newsletter/unsubscribe`, { email, token }, { withCredentials: true });
  }
}

export default SupportService;
