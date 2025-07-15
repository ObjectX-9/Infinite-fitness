import mongoose from "mongoose";

// 最大重试次数
const MAX_RETRIES = 3;
// 重试间隔(毫秒)
const RETRY_INTERVAL = 5000;

// 判断环境
const isDev = process.env.NODE_ENV === "development";

/**
 * 连接配置选项
 */
const connectionOptions = {
  bufferCommands: true,
  autoIndex: true,
  autoCreate: true,
};

/**
 * 缓存连接
 */
let mongoConnection: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = {
  conn: null,
  promise: null,
};

// 开发环境使用全局变量缓存连接(避免热重载影响)
if (isDev) {
  if (!global._mongoConnection) {
    global._mongoConnection = { conn: null, promise: null };
  }
  mongoConnection = global._mongoConnection;
}

// 添加声明
declare global {
  var _mongoConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

/**
 * 获取MongoDB连接URI
 * @returns MongoDB连接URI
 */
function getConnectionUri(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "环境变量MONGODB_URI未设置，请在.env.local中配置MongoDB连接字符串"
    );
  }

  return uri;
}

/**
 * 连接MongoDB数据库
 * @param retryCount 重试次数
 * @returns Mongoose实例
 */
export async function connectDB(retryCount = 0): Promise<typeof mongoose> {
  // 如果已经连接，返回现有连接
  if (mongoConnection.conn) {
    return mongoConnection.conn;
  }

  // 如果正在连接，等待连接完成
  if (mongoConnection.promise) {
    return mongoConnection.promise;
  }

  try {
    const uri = getConnectionUri();

    // 记录连接信息(不显示凭据)
    const sanitizedUri = uri.replace(/\/\/([^@]+)@/, "//***:***@");
    console.log(
      `正在连接到MongoDB (尝试 ${retryCount + 1}/${MAX_RETRIES + 1})`,
      sanitizedUri
    );

    // 创建连接
    mongoConnection.promise = mongoose
      .connect(uri, connectionOptions)
      .then((mongoose) => {
        mongoConnection.conn = mongoose;
        return mongoose;
      })
      .catch((err) => {
        mongoConnection.promise = null;
        throw err;
      });

    return await mongoConnection.promise;
  } catch (error) {
    console.error("MongoDB连接失败:", error);
    mongoConnection.promise = null;

    // 重试连接
    if (retryCount < MAX_RETRIES) {
      console.log(`将在${RETRY_INTERVAL / 1000}秒后重试连接...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      return connectDB(retryCount + 1);
    }

    throw error;
  }
}

/**
 * 断开MongoDB连接
 */
export async function disconnectDB(): Promise<void> {
  if (!mongoConnection.conn) {
    return;
  }

  try {
    await mongoose.disconnect();
    console.log("MongoDB连接已关闭");
    mongoConnection.conn = null;
    mongoConnection.promise = null;
  } catch (error) {
    console.error("关闭MongoDB连接时出错:", error);
    throw error;
  }
}

// 监听MongoDB连接事件
mongoose.connection.on("connected", () => {
  console.log("Mongoose: 已连接");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose: 已断开连接");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose: 连接错误", err);
});

// 应用关闭时断开连接
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});
