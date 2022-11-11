import { Module, Post } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { jwtConstants } from "src/auth/constants";
import { PostController } from "./post.controller";
import { PostTDT, PostTDTSchema } from "./post.schema/post.schema";
import { PostService } from "./post.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PostTDT.name, schema: PostTDTSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60m" },
    }),
  ],
  providers: [PostService],
  exports: [PostService],
  controllers: [PostController],
})
export class PostModule {}
