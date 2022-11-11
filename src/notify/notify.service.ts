import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/users/users.schema/users.schema";
import { CreateNotifyDTO } from "./notify.dto/notify.body.dto";
import { NotifyParamsDTO } from "./notify.dto/notify.params.dto";
import { Notify, NotifyDocument } from "./notify.schema/notify.schema";

@Injectable()
export class NotifyService {
  constructor(
    @InjectModel(Notify.name)
    private notifyModel: Model<NotifyDocument>
  ) {}

  async createNotify(
    user: User,
    createNotifyDTO: CreateNotifyDTO
  ): Promise<Notify> {
    if (createNotifyDTO.recipients.includes(user._id.toString())) return;
    const newNotify: Notify = new this.notifyModel({
      ...createNotifyDTO,
      user: user,
    });

    newNotify.save();

    return newNotify;
  }

  async deleteNotify(
    user: User,
    notifyParamsDTO: NotifyParamsDTO
  ): Promise<Notify> {
    const notify: Notify = await this.notifyModel.findOneAndUpdate(
      {
        _id: notifyParamsDTO.id,
      },
      {
        $pull: { recipients: user._id },
      },
      {
        returnOriginal: false,
      }
    );
    return notify;
  }

  async deleteAllNotify(user: User): Promise<Notify> {
    const notify = await this.notifyModel.updateMany(
      { recipients: user._id },
      {
        $pull: { recipients: user._id },
      }
    );
    return;
  }

  async getNotifies(user: User): Promise<Notify[]> {
    const notifies: Notify[] = await this.notifyModel
      .find({ recipients: user._id })
      .sort("-createdAt")
      .populate("user", "avatar full_name");
    return notifies;
  }

  async isReadNotify(notifyParamsDTO: NotifyParamsDTO): Promise<Notify> {
    const newNotify: Notify = await this.notifyModel.findOneAndUpdate(
      { _id: notifyParamsDTO.id },
      { is_read: true },
      { returnOriginal: false }
    );
    return newNotify;
  }
}
