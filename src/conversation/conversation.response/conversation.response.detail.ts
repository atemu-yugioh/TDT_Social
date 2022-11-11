import mongoose from "mongoose";
import { User } from "src/users/users.schema/users.schema";
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.format-time.common";
import { Conversation } from "../conversation.schema/conversation.schema";

export class ConversationResponseDetail {
  recipients: User[];
  text: String;
  media: String[];
  created_at: string;
  updated_at: string;

  constructor(data?: Conversation) {
    this.recipients = data?.recipients ? data.recipients : [];
    this.text = data?.text ? data.text : "";
    this.media = data?.media.length ? data.media : [];
    this.created_at = data?.created_at
      ? UtilsDate.formatDateTimeVNToString(data.created_at)
      : "";
    this.updated_at = data?.updated_at
      ? UtilsDate.formatDateTimeVNToString(data.updated_at)
      : "";
  }

  public mapToList(data: Conversation[]) {
    let response: ConversationResponseDetail[] = [];
    data.forEach((e) => {
      response.push(new ConversationResponseDetail(e));
    });

    return response;
  }
}
