import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { jwtConstants } from "src/auth/constants";
import { PostModule } from "src/post/post.module";
import { CommentController } from "./comment.controller";
import { Comment, CommentSchema } from "./comment.schema/comment.schema";
import { CommentService } from "./comment.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60m" },
    }),
    PostModule,
  ],
  providers: [CommentService],
  exports: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
