import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCommentDTO } from "src/comment/comment.dto/comment.body.dto";
import { Conversation } from "src/conversation/conversation.schema/conversation.schema";
import { ConversationService } from "src/conversation/conversation.service";
import { User } from "src/users/users.schema/users.schema";
import { ExceptionResponseDetail } from "src/utils.common/utils.exception.common/utils.exception.common";
import { CreateMessageDTO } from "./message.dto/message.body.dto";
import { MessageParamsDTO } from "./message.dto/message.params.dto";
import { MessageQueryDTO } from "./message.dto/message.query.dto";
import { Message, MessageDocument } from "./message.schema/message.schema";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @Inject(forwardRef(() => ConversationService))
    private conversationService: ConversationService
  ) {}

  async createMessage(createMessageDTO: CreateMessageDTO): Promise<Message> {
    if (
      !createMessageDTO.recipient ||
      (!createMessageDTO.text.trim() && !createMessageDTO.media.length)
    ) {
      throw new HttpException(
        new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Lỗi dữ liệu !!!"),
        HttpStatus.OK
      );
    }

    const newConversation: Conversation =
      await this.conversationService.createConversation(createMessageDTO);

    const message: Message = new this.messageModel({
      ...createMessageDTO,
      conversation: newConversation._id,
    });

    message.save();

    return message;
  }

  async getMessages(messageQueryDTO: MessageQueryDTO): Promise<Message[]> {
    const page = messageQueryDTO.page * 1 || 1;
    const limit = messageQueryDTO.limit * 1 || 9;
    const skip = (page - 1) * limit;

    let messages: Message[] = await this.messageModel
      .find({
        conversation: messageQueryDTO.conversation_id,
      })
      .sort("-created_at")
      .skip(skip)
      .limit(limit)
      .populate("sender recipient", "avatar full_name")
      .lean();
    return messages;
  }

  async deleteMessage(senderId: String, messageId: String): Promise<any> {
    return await this.messageModel.deleteOne({
      $and: [{ _id: messageId }, { sender: senderId }],
    });
  }

  async deleteAllMessage(conversationId: String): Promise<any> {
    return await this.messageModel.deleteMany({ conversation: conversationId });
  }
}
