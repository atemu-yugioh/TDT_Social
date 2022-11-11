import { User } from "src/users/users.schema/users.schema";
import { UtilsJwt } from "src/utils.common/utils.jwt.common/utils.jwt.common";

export class UserDetailResponse {
  _id: string;
  full_name: string;
  email: string;
  avatar: string;
  role: string;
  gender: string;
  mobile: string;
  address: string;
  story: string;
  followers: User[];
  following: User[];
  saved: User[];
  access_token: string;

  constructor(user?: User) {
    this._id = user?._id ? user._id : "";
    this.full_name = user?.full_name ? user.full_name : "";
    this.email = user?.email ? user.email : "";
    this.avatar = user?.avatar ? user.avatar : "";
    this.role = user?.role ? user.role : "";
    this.gender = user?.gender ? user.gender : "";
    this.mobile = user?.mobile ? user.mobile : "";
    this.address = user?.address ? user.mobile : "";
    this.story = user?.story ? user.story : "";
    this.followers = user?.followers ? user.followers : [];
    this.following = user?.following ? user.following : [];
    this.saved = user?.saved ? user.saved : [];
    this.access_token = user?.email
      ? UtilsJwt.createAccessToken({ email: this.email })
      : "";
  }

  public mapToList(data: User[]) {
    const response: UserDetailResponse[] = [];
    data.forEach((e) => {
      response.push(new UserDetailResponse(e));
    });
    return response;
  }
}
