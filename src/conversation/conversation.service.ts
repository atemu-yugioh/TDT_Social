import { forwardRef, Inject, Injectable, Res } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { userInfo } from "os";
import { MessageService } from "src/message/message.service";
import { User } from "src/users/users.schema/users.schema";
import { CreateConversationDTO } from "./conversation.dto/conversation.body.dto";
import { ConversationParamsDTO } from "./conversation.dto/conversation.params.dto";
import { ConversationQueryDTO } from "./conversation.dto/conversation.query.dto";
import {
  Conversation,
  ConversationDocument,
} from "./conversation.schema/conversation.schema";

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService
  ) {}

  async createConversation(
    createConversationDTO: CreateConversationDTO
  ): Promise<Conversation> {
    const conversation: Conversation =
      await this.conversationModel.findOneAndUpdate(
        {
          $or: [
            {
              recipients: [
                createConversationDTO.sender,
                createConversationDTO.recipient,
              ],
            },
            {
              recipients: [
                createConversationDTO.recipient,
                createConversationDTO.sender,
              ],
            },
          ],
        },
        {
          ...createConversationDTO,
          recipients: [
            createConversationDTO.sender,
            createConversationDTO.recipient,
          ],
        },

        {
          returnOriginal: false,
          upsert: true,
        }
      );
    return conversation;
  }

  async getConversation(
    user: User,
    conversationQueryDTO: ConversationQueryDTO
  ): Promise<Conversation[]> {
    const page = conversationQueryDTO.page * 1 || 1;
    const limit = conversationQueryDTO.limit * 1 || 9;
    const skip = (page - 1) * limit;

    let conversations: Conversation[] = await this.conversationModel
      .find({
        recipients: user._id,
      })
      .sort("-created_at")
      .skip(skip)
      .limit(limit)
      .populate("recipients", "avatar full_name")
      .lean();
    return conversations;
  }

  async deleteConversation(
    user: User,
    conversationParamsDTO: ConversationParamsDTO
  ): Promise<Conversation> {
    let conversation: Conversation =
      await this.conversationModel.findOneAndDelete({
        $and: [{ _id: conversationParamsDTO.id }, { recipients: user._id }],
      });
    await this.messageService.deleteAllMessage(conversation._id);
    return conversation;
  }
}
