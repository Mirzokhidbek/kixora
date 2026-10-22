import ViewModel from "../schema/View.model";
import { View, ViewInput } from "../libs/types/view";
import Errors, { HTTPCode, Message } from "../libs/Errors";

class ViewService {
  private readonly viewModel;

  constructor() {
    this.viewModel = ViewModel;
  }

  public async checkViewExistence(input: ViewInput): Promise<View> {
    return (await this.viewModel
      .findOne({ memberId: input.memberId, viewRefId: input.viewRefId })
      .exec()) as unknown as View;
  }

  public async insertMemberView(input: ViewInput): Promise<View> {
    try {
      const result = await this.viewModel.create(input);
      return result.toJSON() as View;
    } catch (err) {
      console.error("Error, insertMemberView:", err);
      throw new Errors(HTTPCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default ViewService;
