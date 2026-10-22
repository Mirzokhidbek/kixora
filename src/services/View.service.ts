import ViewModel from "../models/View.model";
import { ViewInput } from "../libs/types/view";

class ViewService {
  private readonly viewModel = ViewModel;

  /**
   * Records a unique (member, item) view in one atomic upsert.
   * Returns true only the first time, so concurrent requests can't double count.
   */
  public async recordView(input: ViewInput): Promise<boolean> {
    const result = await this.viewModel
      .updateOne(
        { memberId: input.memberId, viewRefId: input.viewRefId },
        { $setOnInsert: input },
        { upsert: true }
      )
      .exec();
    return result.upsertedCount === 1;
  }
}

export default ViewService;
