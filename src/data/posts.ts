export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  icon: string;
}

const posts: BlogPost[] = [
  {
    id: "hello-world",
    title: "你好，星际 — 我的第一篇博客",
    excerpt:
      "在这个数据洪流的时代，每个人都是一颗孤独的星球。而博客，则是我们向宇宙发出的信号。",
    content: `
## 为什么开始写博客

在 2026 年的今天，社交媒体已经变得无比碎片化。140 个字符的限制、15 秒的短视频、无限滚动的信息流... 这些都在不断地切割我们的注意力。

而长文写作，是一种抵抗。

## 技术选型

这个博客基于以下技术栈构建：

- **React 19** — 最新的 React 版本，带来更流畅的渲染体验
- **Vite** — 闪电般的构建速度
- **Tailwind CSS** — 实用优先的 CSS 框架
- **CloudBase** — 腾讯云开发，提供静态托管和云函数支持

## 设计理念

我选择了 **Retro-Futuristic** 风格——融合 80 年代科幻终端美学与现代玻璃态设计。

深色背景搭配霓虹色强调，给人一种在星际飞船控制台阅读的沉浸感。

> "Writing is perhaps the greatest of human inventions, binding together people who never knew each other, citizens of distant epochs." — Carl Sagan

## 接下来

我会在这里分享以下内容：

- 前端开发技巧与踩坑记录
- 开源项目的心得体会
- 技术趋势的观察与思考
- 偶尔的生活随笔

希望你能在这里找到有价值的信息。感谢你的到来！
    `,
    date: "2026-05-20",
    readTime: "5 分钟",
    tags: ["随笔", "技术"],
    icon: "fa-solid fa-rocket",
  },
  {
    id: "react-19-new-features",
    title: "React 19 核心新特性深度解析",
    excerpt:
      "React 19 带来了 Actions、新的 Hooks、Server Components 稳定版等重磅更新。一文搞懂所有变化。",
    content: `
## React 19 概览

React 19 于 2024 年底发布，是 React 历史上最重要的版本之一。它引入了多项革命性的特性，让我们逐一解析。

## 1. Actions 与 useActionState

\`useActionState\` 是 React 19 中最令人兴奋的新 Hook 之一。它简化了表单提交和异步状态管理的模式：

\`\`\`tsx
import { useActionState } from "react";

async function updateName(prevState: string, formData: FormData) {
  const name = formData.get("name") as string;
  await saveNameToDatabase(name);
  return name;
}

function NameForm() {
  const [name, formAction, isPending] = useActionState(
    updateName,
    "Anonymous"
  );

  return (
    <form action={formAction}>
      <input name="name" />
      <button type="submit" disabled={isPending}>
        {isPending ? "保存中..." : "保存"}
      </button>
      <p>当前用户名: {name}</p>
    </form>
  );
}
\`\`\`

## 2. useOptimistic

乐观更新是提升用户体验的关键手段。React 19 提供了内置的 \`useOptimistic\` Hook：

\`\`\`tsx
import { useOptimistic } from "react";

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );
}
\`\`\`

## 3. use() API

新的 \`use()\` 函数可以在渲染期间读取 Promise 和 Context，为 Suspense 提供了更灵活的用法：

\`\`\`tsx
import { use, Suspense } from "react";

const userPromise = fetchUser(1);

function UserProfile() {
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}
\`\`\`

## 4. Server Components 稳定版

React Server Components (RSC) 在 React 19 中正式稳定。结合 Next.js 或自定义的 RSC 框架，你可以：

- 在服务端直接访问数据库，无需额外 API 层
- 零客户端 JavaScript 的纯服务端组件
- 自动代码分割

## 总结

React 19 是一个里程碑式的版本。Actions 让表单处理变得更简洁，useOptimistic 让用户体验更流畅，而 Server Components 则重新定义了 React 应用的架构方式。

如果你还没有升级，现在就是最好的时机！
    `,
    date: "2026-05-15",
    readTime: "8 分钟",
    tags: ["前端", "React"],
    icon: "fa-brands fa-react",
  },
  {
    id: "cloudbase-guide",
    title: "从零到一：CloudBase 全栈部署实战",
    excerpt:
      "如何在 30 分钟内完成一个 React 博客从本地开发到线上部署的全流程？CloudBase 一站式解决。",
    content: `
## 前言

前端开发者最头疼的事情之一就是部署。买服务器、配 Nginx、搞 SSL 证书、配数据库... 每一步都是时间黑洞。

CloudBase（腾讯云开发）正是为了解决这个问题而生。它提供一个**一站式后端云服务**，让你专注于写代码，剩下的交给云。

## 环境准备

### 1. 注册并创建环境

首先访问 CloudBase 控制台，创建一个新的云开发环境。

### 2. 安装 CLI（可选）

\`\`\`bash
npm install -g @cloudbase/cli
tcb login
\`\`\`

## 项目初始化

使用 CloudBase 提供的 React 模板快速开始：

\`\`\`bash
npx @cloudbase/cli init
\`\`\`

选择 React + Vite 模板，会自动配置好：

- Vite 构建配置
- Tailwind CSS 样式
- CloudBase SDK 集成
- 路由配置

## 核心功能对接

### 静态托管

CloudBase 支持自动构建和部署静态网站：

\`\`\`json
// cloudbaserc.json
{
  "envId": "your-env-id",
  "framework": {
    "name": "vite",
    "plugins": {
      "client": {
        "use": "@cloudbase/framework-plugin-website",
        "inputs": {
          "buildCommand": "npm run build",
          "outputPath": "dist"
        }
      }
    }
  }
}
\`\`\`

### 云函数

如果需要后端逻辑（如评论系统），可以创建云函数：

\`\`\`js
// cloudfunctions/getComments/index.js
const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init();
const db = app.database();

exports.main = async (event) => {
  const { postId } = event;
  const res = await db
    .collection("comments")
    .where({ postId })
    .orderBy("createdAt", "desc")
    .get();
  return res.data;
};
\`\`\`

### NoSQL 数据库

CloudBase 提供了开箱即用的文档数据库，非常适合博客这种场景。

## 部署上线

一键部署到静态托管：

\`\`\`bash
npm run build
tcb hosting deploy dist -e your-env-id
\`\`\`

几分钟后，你的网站就上线了！自带 CDN 加速和 SSL 证书。

## 总结

CloudBase 极大地降低了全栈开发的门槛。对于个人博客、小型项目来说，它是最佳选择之一：

- 无需管理服务器
- 自动 HTTPS
- CDN 加速
- 按量计费（有免费额度）

开始你的 CloudBase 之旅吧！
    `,
    date: "2026-05-10",
    readTime: "10 分钟",
    tags: ["CloudBase", "部署", "全栈"],
    icon: "fa-solid fa-cloud",
  },
  {
    id: "tailwind-css-tips",
    title: "Tailwind CSS 高级技巧：打造独特视觉风格",
    excerpt:
      "Tailwind CSS 用不好就会千篇一律？分享 7 个技巧，让你的页面脱颖而出。",
    content: `
## 为什么 Tailwind CSS 有时看起来很"模板化"

Tailwind 的 utility-first 设计让开发效率极高，但很多项目止步于默认的 color palette 和基础 class 组合，导致看起来大同小异。

以下 7 个技巧帮你打破这种局面。

## 1. 自定义 Design Tokens

在 \`tailwind.config.js\` 中扩展自己的颜色、字体、动画：

\`\`\`js
export default {
  theme: {
    extend: {
      colors: {
        void: "#0A0A0A",
        neon: "#E94560",
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
    },
  },
};
\`\`\`

## 2. 使用 CSS 变量实现动态主题

\`\`\`css
:root {
  --color-primary: #E94560;
  --color-bg: #0A0A0A;
}

[data-theme="light"] {
  --color-primary: #C81D45;
  --color-bg: #FAFAFA;
}
\`\`\`

## 3. 玻璃态效果 (Glassmorphism)

\`\`\`css
.glass {
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
\`\`\`

## 4. 霓虹光晕效果

\`\`\`css
.neon-text {
  text-shadow:
    0 0 7px rgba(233, 69, 96, 0.5),
    0 0 20px rgba(233, 69, 96, 0.3),
    0 0 40px rgba(233, 69, 96, 0.1);
}
\`\`\`

## 5. 对角线装饰

在背景上添加对角线纹理可以立即提升视觉层次感。

## 6. 自定义动画和过渡

在 Tailwind 配置中定义自己的关键帧：

\`\`\`js
keyframes: {
  slideUp: {
    '0%': { opacity: '0', transform: 'translateY(40px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
}
\`\`\`

## 7. 错落动画 (Staggered Animations)

给相邻元素不同的 animation-delay，创造渐进式展示效果：

\`\`\`css
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
\`\`\`

## 总结

Tailwind CSS 的灵活性远超想象。关键在于**不要止步于默认配置**——大胆定义自己的 Design System，结合 CSS 原生能力创造独特的视觉效果。

记住：工具只是手段，独特的设计语言才是核心。
    `,
    date: "2026-05-05",
    readTime: "7 分钟",
    tags: ["CSS", "Tailwind", "设计"],
    icon: "fa-solid fa-paint-brush",
  },
  {
    id: "future-of-web",
    title: "2026 前端趋势：AI 原生开发时代的到来",
    excerpt:
      "当 AI 编程助手成为标配，前端开发者的角色正在发生根本性转变。我们该如何适应？",
    content: `
## 前言

2026 年，AI 编程助手已经从"新奇工具"变成了"必需品"。GitHub Copilot、Cursor、CodeBuddy 等工具彻底改变了我们写代码的方式。

## AI 正在改变什么

### 1. 从"怎么写"到"做什么"

过去，开发者的主要精力花在**实现细节**上——记 API、查文档、调 CSS。现在，AI 可以处理大部分样板代码和常规任务。

开发者的角色正在向**产品设计者**和**架构决策者**演进。

### 2. 提示工程成为核心技能

> "Prompt engineering is the new programming."

如何精准地描述需求、拆解任务、验证输出，正在成为比记住语法更重要的能力。

### 3. 全栈开发的边界模糊化

有了 AI 辅助，前端开发者可以轻易上手后端逻辑、数据库设计、部署运维。T 型人才变成 π 型人才。

## 不变的是什么

尽管工具在变，以下核心能力永远不会过时：

- **计算机科学基础**：数据结构、算法、网络协议
- **审美和设计感**：AI 可以生成代码，但无法替代对"什么是好体验"的判断
- **沟通和协作能力**：与 AI 沟通也属于此类
- **批判性思维**：AI 的输出需要人类的审查和修正

## 给前端开发者的建议

1. **拥抱 AI 工具**——不要抗拒，学会与它高效协作
2. **深入理解底层**——AI 帮你写代码，但你要知道代码为什么这样写
3. **培养产品思维**——从"实现需求"到"定义需求"
4. **持续学习**——技术栈更迭更快了，保持好奇心

## 结语

2026 年不是前端开发者的末日，而是新的开始。那些能够**驾驭 AI 工具、深入理解原理、具备产品思维**的开发者，将在这个时代脱颖而出。
    `,
    date: "2026-05-01",
    readTime: "6 分钟",
    tags: ["思考", "AI", "趋势"],
    icon: "fa-solid fa-brain",
  },
  // ========== 生活类新文章 ==========
  {
    id: "morning-routine-developer",
    title: "程序员的晨间仪式：用代码唤醒一天",
    excerpt:
      "比起咖啡，有时候写 30 分钟的个人项目更能让你精神焕发。分享我的晨间编程仪式。",
    content: `
## 早上 6:30 的闹钟

很多人好奇程序员的一天是怎么开始的。是睡到自然醒，然后瘫在电脑前开始改 bug？还是一杯黑咖啡 + 16 小时连续编程？

我的答案是：都不是。

## 一次偶然的发现

去年有一天，项目 deadline 在即，我不得不 5 点半爬起来赶工。本以为会困得要死，结果发现——**清晨写代码的效率出奇地高**。

没有 Slack 消息轰炸，没有突如其来的会议，世界安静得像只剩下你和编译器。

## 我的晨间仪式

### 6:30 - 起床 & 洗漱

不碰手机。先洗把脸，喝一杯温水。手机的消息可以等到 7 点后再看。

### 6:50 - 轻量运动

5 分钟拉伸 + 10 分钟跳绳。让身体先于大脑醒过来。

### 7:10 - 深度工作 90 分钟

这是我最珍惜的时间段。我会：

- 关掉所有通知
- 打开 \`Do Not Disturb\` 模式
- 专注于一个具体的、有挑战性的任务
- 使用番茄钟法，25 分钟专注 + 5 分钟休息

### 8:40 - 早餐 & 阅读

一边吃早餐，一边读几篇技术博客或者 Hacker News。不赶时间的感觉真好。

### 9:30 - 正式开工

这时候大多数同事也开始上线了。我已经完成了最难的部分——心里有底，整天都从容很多。

## 为什么晨间编程这么有效？

心理学上有一个概念叫 **"决策疲劳"** —— 你一天中做的决定越多，后续的决策质量就越差。

早上的大脑是"新鲜"的，还没有被各种琐事消耗。这时候处理复杂逻辑、架构设计，效率至少是下午的两倍。

## 一些小建议

如果你也想尝试：

1. **不要一下子就 5 点起**。每天提前 15 分钟，两周过渡
2. **前一天晚上准备好任务清单**。早上起来不用纠结"今天做什么"
3. **把最难的放早上**。简单任务留给下午
4. **周末也尽量保持**。不必那么早，但保持节奏

> "The early morning has gold in its mouth." — Benjamin Franklin

## 写在最后

晨间编程不是"卷"，而是一种**为自己争取高质量时间**的生活方式。

试试看，也许你也会爱上那种——在黎明前的寂静中，只有键盘声和 IDE 陪伴的感觉。
    `,
    date: "2026-04-25",
    readTime: "6 分钟",
    tags: ["生活", "效率", "程序员"],
    icon: "fa-solid fa-mug-hot",
  },
  {
    id: "books-that-shaped-me",
    title: "塑造我的 5 本书：一个开发者的阅读史",
    excerpt:
      "技术之外，这些书改变了我的思维方式、解决问题的方法，甚至人生的方向。",
    content: `
## 前言

人们常说："You are what you read."

作为一个开发者，我读了很多技术书——但真正塑造我的，反而是这些"非技术"书籍。它们教会了我如何思考、如何决策、如何与自己相处。

## 1. 《黑客与画家》 — Paul Graham

> "编程语言不是技术，而是思考工具。"

Paul Graham 是 Y Combinator 的创始人，也是一位出色的 Lisp 黑客。这本书让我看到了**编程作为创造性活动**的一面。

书中最打动我的一句话：*"黑客和画家最像的地方在于，他们都是创造者。"*

读完这本书后，我开始把写代码视为"艺术创作"而非"工程任务"。这种心态转变让编程变得更有趣了。

## 2. 《思考，快与慢》 — Daniel Kahneman

诺贝尔经济学奖得主卡尼曼的经典之作。他提出了两个系统：

- **系统 1**：快速、直觉、情绪化（"本能反应"）
- **系统 2**：缓慢、理性、需要努力（"深度思考"）

作为程序员，我们每天都在和这两个系统打交道：

- Code review 时，系统 1 让你快速发现明显的 bug
- 设计架构时，系统 2 帮你权衡各种 trade-off
- Debug 时，系统 1 的"直觉"有时候比系统 2 的"逻辑推演"更快

**关键启示**：学会识别自己在使用哪个系统，在该用系统 2 的时候不要偷懒。

## 3. 《原子习惯》 — James Clear

> "你不会上升到目标的高度，你会掉落到系统的水平。"

这本书彻底改变了我对"自律"的理解。以前我总想靠"意志力"坚持做某事——学新语言、健身、写博客——结果都以失败告终。

Clear 的方法很简单：**不要关注目标，关注系统**。

- 不是"我要学会 Rust"，而是"每天写 15 分钟 Rust 代码"
- 不是"我要减肥 10 公斤"，而是"每天午餐后散步 20 分钟"

小到不可能失败的习惯，最终会堆出惊人的成果。

## 4. 《禅与摩托车维修艺术》 — Robert Pirsig

这本书很难归类。表面上是游记，内核是哲学。Pirsig 探讨了一个核心问题：**什么是"好"？什么是"质量"？**

对开发者来说，这触及了一个本质问题：**什么是"好代码"？**

可维护？可测试？高性能？——这些都是"好"的结果，不是"好"本身。

Pirsig 认为，真正的"质量"来自于**全身心的投入和关注**。当你完全沉浸在手头的工作中时，"好"自然就出现了。

## 5. 《1984》 — George Orwell

我知道这听起来很 cliché，但每过几年重读一遍，都有新的感受。

在算法推荐无处不在的今天，Orwell 描绘的"老大哥"换了一种更隐蔽的方式存在。作为技术从业者，我们更有责任去思考——**我们在构建什么样的世界？**

## 写在最后

好的书籍就像好的代码——经得起时间的考验。

如果你也有改变你人生的书，欢迎分享给我。📚
    `,
    date: "2026-04-18",
    readTime: "8 分钟",
    tags: ["阅读", "生活", "思考"],
    icon: "fa-solid fa-book-open",
  },
  {
    id: "remote-work-one-year",
    title: "远程工作一周年：自由与自律的拉锯战",
    excerpt:
      "一年前我开始了远程工作生涯。自由是真的自由，但没有人告诉你的是——自律是需要刻意练习的。",
    content: `
## 梦想 vs 现实

一年前，当我告诉朋友我要开始远程工作时，他们的反应基本一致：

> "羡慕！可以在家穿着睡衣上班！"

然后他们会想象一种画面：沙滩上喝着椰子汁写代码，或者咖啡馆里一边撸猫一边调试 API。

实际情况呢？

**第一个月，我的作息完全崩了。**

凌晨 2 点还在写代码，中午 12 点才起床，周末和工作日失去了边界。我以为这是"自由"，其实是失控。

## 远程工作的真实挑战

### 1. 社交隔离

远程之前我低估了"办公室里随口聊两句"的价值。那种走到同事工位、指着屏幕说"你看这个 bug 是什么鬼"的便利，是 Slack 消息替代不了的。

**解决方法**：我加入了几个线上开发者社区，每周至少参加一次线上 meetup。偶尔也去联合办公空间坐坐。

### 2. 沟通成本指数增长

在办公室，你写了一个 RFC，可以快速召集几个人讨论 5 分钟。远程之后，同样的讨论要变成：

- 写文档（+30 分钟）
- 等待回复（+4 小时，因为时差）
- 澄清误解（+2 轮来回）

**解决方法**：学会了"过度沟通"——写得比你以为需要的更详细，同步比你以为需要的更频繁。

### 3. 工作与生活边界模糊

这是最致命的。当你的卧室就是办公室，\`work\` 和 \`life\` 就变成了一锅粥。

我曾经过上了这种生活：晚上 10 点收到消息 → "就改一行代码" → 打开电脑 → 改完发现有个相关 bug → 修到凌晨 1 点 → 后悔 → 第二天继续。

**解决方法**：物理隔离 + 时间仪式。

- 租了一个工作专用的小房间（哪怕只有 6 平米）
- 每天 9:00 和 18:00 各响一次闹钟 → "上班"和"下班"的仪式感
- 下班后把工作电脑关机塞进抽屉

## 远程工作的美好之处

吐槽了这么多，但我不后悔。远程工作也有无可替代的优势：

### 深度工作的天堂

没有 open office 的嘈杂，没有突然拍肩的打断。上午 7-10 点是我效率的黄金时段。

### 健康改善

自己做饭（不再吃油腻的外卖），午休可以小睡 20 分钟，下午累了还能做 10 分钟拉伸。

### 地理位置自由

上个月我在大理待了两周，面朝洱海写代码。这种体验……确实很爽。

## 给考虑远程工作的你

如果你是第一次尝试远程：

1. **不要高估自己的自律**。建立系统，不要依赖意志力
2. **投资一套好设备**。升降桌、好椅子、大显示器——这比咖啡值钱
3. **主动社交**。远程不会自动给你社交，你得去争取
4. **照顾好身体**。久坐是新型吸烟
5. **保持学习节奏**。没有同事在旁边讨论新技术，需要自己主动跟进

> 自由不是随心所欲，而是自我主宰。—— 康德

一年的远程经历教会我最重要的道理：

**自由和自律是一枚硬币的两面。**
    `,
    date: "2026-04-10",
    readTime: "9 分钟",
    tags: ["生活", "远程工作", "效率"],
    icon: "fa-solid fa-house-laptop",
  },
  {
    id: "my-dev-toolkit-2026",
    title: "我的 2026 开发工具箱：利器推荐",
    excerpt:
      "工欲善其事，必先利其器。分享我日常开发中最离不开的那些工具和配置。",
    content: `
## 前言

一个好的工具能让你事半功倍。在试用了无数编辑器、终端、插件之后，我终于稳定下来一套自己最舒服的工具链。

这不是"最好"的，但可能是"最适合做类似工作的你"的。

## 编辑器：VS Code + Neovim 双修

我日常使用 **VS Code** 作为主力编辑器，但会在终端里使用 **Neovim** 进行快速编辑。

### VS Code 必备插件

- **GitHub Copilot** — AI 补全已经是肌肉记忆的一部分
- **Error Lens** — 把错误信息直接显示在行尾，省去 hover 的时间
- **Tailwind CSS IntelliSense** — 自动补全 + 预览颜色
- **Pretty TypeScript Errors** — 让 TS 错误信息变得可读
- **GitLens** — 代码考古必备

### Neovim 配置

\`\`\`lua
-- 精简配置，不到 200 行
-- 核心插件：telescope + treesitter + lsp
\`\`\`

我主要用 Neovim 来处理 VS Code 太"重"的场景——比如 SSH 到服务器改个配置、快速预览一个文件。

## 终端：Windows Terminal + Oh My Posh

Windows Terminal 这两年进步神速：

- GPU 加速渲染，丝般顺滑
- 分屏 + 多标签页
- JSON 配置，可版本控制

搭配 **Oh My Posh** 主题 + **Nerd Font** 图标，颜值和功能都在线。

## Shell：PowerShell 7 + Starship

是的，在 Windows 上用 PowerShell。它支持：

- 管道操作（比 bash 更强大）
- 结构化数据传递（不是纯文本）
- 原生的 JSON / CSV 处理

搭配 **Starship** prompt，简洁又信息丰富。

\`\`\`powershell
# 常用 alias
function gcm { git commit -m $args }
function gp { git push }
function gl { git log --oneline -10 }
function dps { docker ps --format 'table {{.Names}}\t{{.Status}}' }
\`\`\`

## 浏览器：Arc Browser

Arc 重新设计了浏览器的交互方式：

- 垂直标签页（侧边栏）
- Spaces —— 工作/个人/项目的上下文隔离
- Boost —— 可以用 CSS/JS 自定义任意网页的外观
- 分屏浏览

唯一的缺点是资源占用偏高，但 32G 内存的用户应该不在乎。

## 笔记：Obsidian

所有技术笔记、读书笔记、项目文档都在 Obsidian 中。

- 纯 Markdown，数据掌握在自己手里
- 双向链接 —— 让知识自然形成网络
- 插件生态强大
- 免费 + 本地优先

## API 调试：Bruno

Postman 越来越臃肿，而且强制云端。**Bruno** 是一个轻量替代：

- API collection 存为本地文件（可 Git 版本控制）
- 界面简洁，启动飞快
- 支持环境变量 + 脚本

## 其他小工具

- **Everything** — 文件搜索（Windows 必备）
- **Snipaste** — 截图 + 贴图（debug 时把参考图钉在屏幕上）
- **DevToys** — 开发者的瑞士军刀（JSON 格式化、Base64 编解码等）
- **AutoHotkey** — 自定义全局快捷键

## 写在最后

工具不是越新越好，也不是越多越好。关键是你用得顺手。

我自己评估工具的框架：**学习成本 ÷ 日常使用频率 × 效率提升 = ROI**。ROI 为正才值得投入。

你有什么离不开的工具吗？欢迎推荐！🔧
    `,
    date: "2026-04-02",
    readTime: "7 分钟",
    tags: ["工具", "效率", "开发"],
    icon: "fa-solid fa-toolbox",
  },
  {
    id: "building-personal-blog",
    title: "我为什么用 React 自己写博客，而不是用 WordPress",
    excerpt:
      "在这个 No-Code 工具泛滥的时代，手写一个博客网站看起来是反直觉的。但有些东西，只有亲手敲代码才能体会到。",
    content: `
## "为什么不用 WordPress?"

这是每个手写博客的开发者都会被问到的问题。

答案很简单——**因为我不是在做一个博客，我是在写作一个作品。**

## 三年前：WordPress 时代

三年前，我也用过 WordPress。拖拽式编辑器、一键安装主题、插件市场琳琅满目……看起来什么都不缺。

但我很快遇到了问题：

- 想加一个自定义的动画效果 → 需要改 PHP 模板，或者找插件
- 想调整文章排版 → 可视化编辑器生成的 HTML 是一团乱麻
- 想要真正的暗色模式 → 主题不支持，换主题又太麻烦
- 网站加载速度 → 插件装多了，首屏要 5 秒+

每次想做点"自己的东西"，就会被各种限制挡住。

## 自己写的乐趣

当我决定用 React + Tailwind CSS 从零开始搭建这个博客时，很多人觉得"太费劲了"。

但这就是**费劲的价值所在**：

### 1. 完全的控制权

每一像素的间距、每一个动画的缓动函数、每一个颜色的选择——都是我决定的。

没有人会说"这个主题不支持这个功能"，因为我自己就是主题的作者。

### 2. 写代码 = 写文章

对我来说，写这个博客的代码和写博客文章是同一件事——**创造**。

搭建 Navigation 组件的过程，和学习一个新技术的过程一样有趣。

### 3. 技术的试炼场

这个博客是我所有技术实验的 playground：

- 试用了 Tailwind CSS 的自定义 Design Token
- 实现了自研的 Markdown 解析器
- 摸索了 Canvas 粒子动画
- 配置了完整的 CI/CD 流程

每做一个小功能，都是在实践和巩固。

### 4. 极度轻量化

当前这个博客的完整构建产物不到 **300KB**（含全部图片和字体），加载速度几乎瞬间。

没有数据库查询，没有 PHP 渲染，纯静态文件 + CDN。这种"轻"的感觉，就像开着一辆自己改装的小车，比开一辆功能齐全但笨重的房车更有驾驶乐趣。

## 选择的技术栈

- **React 19** + **TypeScript** — 类型安全 + 组件化
- **Vite** — 极速 HMR，开发体验满分
- **Tailwind CSS** — 原子化 CSS，定制 Retro-Futuristic 风格
- **CloudBase** — 静态托管 + CDN + HTTPS 一站式
- **Canvas API** — 星空背景和粒子动画，零依赖

## DIY 的代价

当然，自己写也不是没有缺点：

- **时间投入**：搭建框架 + 写 CSS 花了一整个周末
- **缺少 CMS**：目前文章是硬编码在 TypeScript 文件里的，发布新文章需要重新构建
- **没有评论系统**：需要额外集成（计划中）

但这些都可以迭代解决。重要的是——**我在掌控整个过程**。

## 适合谁？

如果你是一个开发者，并且有以下想法，手写博客很适合你：

- 想拥有完全自定义的设计
- 想把这当成一个学习项目
- 不在乎"快速上线"，更在乎"做得满意"

如果你只是想快速有一个博客来写东西，WordPress / Ghost / Notion 都是不错的选择。

> "The best tool is the one you actually use." — Unknown

## 最后

这个博客会不断迭代。正如代码有 v1.0、v2.0，博客也是如此。

如果你也在考虑自己写一个博客网站，希望这篇文章能给你一点启发。🚀
    `,
    date: "2026-03-25",
    readTime: "7 分钟",
    tags: ["思考", "博客", "独立开发"],
    icon: "fa-solid fa-pen-to-square",
  },
];

export default posts;
