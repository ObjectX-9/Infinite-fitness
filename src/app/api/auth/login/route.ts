import { NextRequest } from "next/server";
import { UserModel } from "@/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  ApiErrors,
  successResponse,
  unifiedInterfaceProcess,
  parseRequestBody,
  RequestValidator,
} from "@/utils/api-helpers";
import { MembershipLevel, UserMembership } from "@/model/user-member/type";
import { UserMembershipModel } from "@/model/user-member";

/**
 * 用户登录
 */
export const POST = unifiedInterfaceProcess(async (req: NextRequest) => {
  // 参数验证
  const useInfo = await parseRequestBody(req);

  RequestValidator.validateRequired(useInfo, ["username", "password"]);

  const { username, password } = useInfo;

  // 查找用户
  const user = await UserModel.findOne({ username });

  const userMembership = await UserMembershipModel.findOne({ userId: user._id }) as UserMembership;

  // 用户不存在
  if (!user) {
    throw ApiErrors.UNAUTHORIZED("用户名或密码错误");
  }

  // 验证密码
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiErrors.UNAUTHORIZED("用户名或密码错误");
  }

  // 生成JWT令牌
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw ApiErrors.FORBIDDEN("JWT_SECRET 未配置");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      membershipLevel: userMembership.level || MembershipLevel.FREE,
    },
    secret,
    { expiresIn: "7d" }
  );

  // 更新最后登录时间
  await UserModel.findByIdAndUpdate(user._id, {
    $set: { lastLoginAt: new Date() },
  });

  return successResponse(
    {
      token,
      user: {
        _id: user._id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        status: user.status,
      },
    },
    "登录成功"
  );
});
