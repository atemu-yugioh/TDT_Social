import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { PostController } from "./post/post.controller";
import { PostService } from "./post/post.service";
import { PostModule } from "./post/post.module";
import { CommentController } from "./comment/comment.controller";
import { CommentService } from "./comment/comment.service";
import { CommentModule } from "./comment/comment.module";
import { NotifyController } from "./notify/notify.controller";
import { NotifyService } from "./notify/notify.service";
import { NotifyModule } from "./notify/notify.module";
import { ConversationController } from "./conversation/conversation.controller";
import { ConversationService } from "./conversation/conversation.service";
import { ConversationModule } from "./conversation/conversation.module";
import { MessageController } from "./message/message.controller";
import { MessageService } from "./message/message.service";
import { MessageModule } from "./message/message.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),

    MongooseModule.forRoot("mongodb://localhost:27017/tdt_social_db"),
    AuthModule,
    UsersModule,
    PostModule,
    CommentModule,
    NotifyModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
