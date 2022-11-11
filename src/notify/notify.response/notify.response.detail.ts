import mongoose from "mongoose";
import { User } from "src/users/users.schema/users.schema";
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.format-time.common";
import { Notify } from "../notify.schema/notify.schema";

export class NotifyDetailResponse {
  id: String;
  user: User | object;
  recipients: mongoose.Types.ObjectId[];
  url: String;
  text: String;
  image: String;
  content: String;
  is_read: boolean;
  created_at: string;
  updated_at: string;

  constructor(data?: Notify) {
    this.id = data?.id ? data.id.toString() : "";
    this.user = data?.user ? data.user : {};
    this.recipients = data?.recipients.length ? data.recipients : [];
    this.url = data?.url ? data.url : "";
    this.text = data?.text ? data.text : "";
    this.image = data?.image ? data.image : "";
    this.content = data?.content ? data.content : "";
    this.is_read = data?.is_read ? data.is_read : false;
    this.created_at = data?.created_at
      ? UtilsDate.formatDateTimeVNToString(data.created_at)
      : "";
    this.updated_at = data?.updated_at
      ? UtilsDate.formatDateTimeVNToString(data.updated_at)
      : "";
  }

  public maptoList(data: Notify[]) {
    let response: NotifyDetailResponse[] = [];
    data.forEach((e) => {
      response.push(new NotifyDetailResponse(e));
    });

    return response;
  }
}
