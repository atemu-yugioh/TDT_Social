import { User } from "src/users/users.schema/users.schema";
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.format-time.common";
import { Message } from "../message.schema/message.schema";
export class MessageResponseDetail {
  conversation: String;
  sender: User;
  recipient: User;
  media: String[];
  created_at: String;
  updated_at: String;

  constructor(data?: Message) {
    (this.conversation = data?.conversation
      ? data.conversation.toString()
      : ""),
      (this.sender = data?.sender ? data.sender : null);
    this.recipient = data?.recipient ? data.recipient : null;
    this.media = data?.media.length ? data.media : [];
    this.created_at = data?.created_at
      ? UtilsDate.formatDateTimeVNToString(data.created_at)
      : "";
    this.updated_at = data?.updated_at
      ? UtilsDate.formatDateTimeVNToString(data.updated_at)
      : "";
  }

  public mapToList(data: Message[]) {
    let response: MessageResponseDetail[] = [];
    data.forEach((e) => {
      response.push(new MessageResponseDetail(e));
    });
    return response;
  }
}
