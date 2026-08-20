import { CourseModule } from "@/lib/schema";
import {
  fillBlank,
  matchQuestion,
  moduleMeta,
  orderQuestion,
  quickLesson,
  singleChoice,
  trueFalse,
} from "@/content/helpers";

export const module07: CourseModule = {
  ...moduleMeta({
    slug: "07-college-software",
    order: 7,
    title: "大学软件",
    subtitle: "开学就能用起来的工具包",
    description: "微信、QQ、截图录屏、PDF 与 AI 工具，覆盖大学高频场景。",
    icon: "GraduationCap",
    accent: "from-pink-500 to-rose-400",
    difficulty: "入门",
    estimatedMinutes: 260,
  }),
  lessons: [
    quickLesson({
      slug: "wechat",
      title: "微信",
      subtitle: "聊天、文件与文件传输",
      durationMinutes: 30,
      difficulty: "入门",
      goals: ["掌握微信电脑版文件管理", "理解文件传输助手", "管理群聊与收藏"],
      overview:
        "微信电脑版是大学生最常用的沟通与文件工具。核心技巧：把默认保存路径改到非系统盘、用文件传输助手在两设备间传文件、把重要文件收藏并加标签。",
      points: [
        { title: "文件路径", text: "设置 → 文件管理 → 更改保存路径到 D 盘；微信视频和图片会占大量 C 盘空间，这是学生电脑最实用的设置。" },
        { title: "文件传输助手", text: "手机 ⇄ 电脑互传文件首选；注意传输的是原文件，不是压缩模糊版本。" },
        { title: "收藏与标签", text: "重要聊天记录、文件、链接用收藏 + 标签归类；收藏夹支持笔记和待办。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "warning",
          title: "开学第一件事",
          text: "把微信文件保存路径改到 D 盘，否则一学期后 C 盘被聊天图片和视频塞满，电脑变卡。",
        },
        {
          type: "heading",
          text: "微信电脑版防丢文件清单",
        },
        {
          type: "list",
          items: [
            "重要课件接收后立即移动到课程文件夹。",
            "文件传输助手传完大文件后手动清理。",
            "重要聊天记录定期备份到电脑（设置 → 聊天 → 备份）。",
            "收藏里的资料半年检查一次，防止失效。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[手机收到文件] --> B[文件传输助手]\n  B --> C[电脑端保存到D盘]\n  C --> D[移动到课程文件夹]\n  D --> E[收藏+标签]",
          caption: "微信文件处理流程",
        },
      ],
      analogy: "微信电脑版像宿舍收发室：文件都堆在收发室（默认 C 盘）会占满宿舍，搬到仓库（D 盘）才有地方住人。",
      summary: ["微信文件保存路径第一时间改到 D 盘。", "文件传输助手是跨设备传文件捷径。", "收藏 + 标签管理重要资料。"],
      mistakes: [
        "微信聊天记录从不备份，换机全丢。",
        "文件传输助手传完不清，图片视频越积越多。",
        "在电脑版微信下载的文件默认在 C 盘不知道改。",
      ],
      thinking: ["为什么微信文件接收会有过期时限？", "聊天记录备份在电脑端怎么恢复？"],
      exercises: [
        "把微信文件保存路径改为 D 盘并重启生效。",
        "用文件传输助手传一份课程 PDF 到手机。",
      ],
      quiz: [
        singleChoice("q1", "微信电脑版文件默认存在？", ["C 盘", "D 盘", "U 盘", "云端"], 0, "默认在 C 盘文档目录。"),
        trueFalse("q2", "文件传输助手可以在手机和电脑之间传文件。", true, "跨设备传输常用。"),
        fillBlank("q3", "设置微信文件保存位置在「设置 → ____管理」。", "文件", "文件管理。"),
        orderQuestion(
          "q4",
          "按顺序处理一份微信里收到的课件。",
          ["接收文件", "移动到课程文件夹", "重命名为课程名", "必要时收藏"],
          [0, 1, 2, 3],
          "先接收，再归档，再命名，最后收藏。",
        ),
      ],
      tags: ["微信", "工具", "文件"],
    }),
    quickLesson({
      slug: "qq",
      title: "QQ",
      subtitle: "群文件与校园协作",
      durationMinutes: 25,
      difficulty: "入门",
      goals: ["掌握 QQ 群文件使用", "了解 QQ 空间与账号安全", "学会聊天记录管理"],
      overview:
        "QQ 在大学里依然是班级群、课程群的重要载体：群文件共享课件、群公告通知、远程协助修电脑。新版 QQ 更清爽，但核心功能一致。",
      points: [
        { title: "群文件", text: "课程群文件里找课件；上传作业注意命名规范；群文件有容量限制，过期文件提前下载。" },
        { title: "远程协助", text: "QQ 远程协助让同学帮你排查电脑问题，只对信任的人开放，用后关闭。" },
        { title: "账号安全", text: "开启设备锁与登录保护；不要租借 QQ 号；群里的链接先验证域名再点。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "群文件命名规范",
          text: "上传作业用「班级-姓名-作业名-日期」，例如 计算机2班-张三-实验1-0814.docx。老师找得到，同学也方便。",
        },
        {
          type: "heading",
          text: "QQ 安全三不要",
        },
        {
          type: "list",
          items: [
            "不要把 QQ 号和密码告诉同学帮忙挂机。",
            "不点群里“成绩查询/免费会员”类可疑链接。",
            "不随便同意陌生人的远程协助。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[课程群] --> B[群公告]\n  A --> C[群文件]\n  C --> D[下载到本地]\n  B --> E[重要通知]\n  F[远程协助] --> G[仅限信任的人]",
          caption: "QQ 校园场景",
        },
      ],
      analogy: "QQ 群像班级布告栏 + 文件柜：公告贴墙上（群公告），课件放柜里（群文件），找东西先看柜子分类。",
      summary: ["群文件是课件集中地，及时下载。", "远程协助只开给信任的人。", "账号安全设置要开启。"],
      mistakes: [
        "群文件不下载，期末发现过期。",
        "随便点群里的「成绩查询」链接被盗号。",
        "把 QQ 号密码告诉同学帮忙挂机。",
      ],
      thinking: ["为什么学校仍用 QQ 而不用微信？", "远程协助和远程桌面的区别是什么？"],
      exercises: [
        "加入课程群后，把群文件按科目整理到本地文件夹。",
        "开启 QQ 的登录保护与设备锁。",
      ],
      quiz: [
        singleChoice("q1", "QQ 群共享课程文件的地方是？", ["群文件", "空间相册", "个性签名", "QQ 邮箱"], 0, "群文件共享课件。"),
        trueFalse("q2", "QQ 远程协助可以控制对方电脑。", true, "授权后可远程操作。"),
        fillBlank("q3", "防止 QQ 在陌生设备登录可开启____锁。", "设备", "设备锁。"),
        trueFalse("q4", "群文件下载后就不需要再管了。", false, "要整理归档，过期后可能失效。"),
      ],
      tags: ["QQ", "群", "协作"],
    }),
    quickLesson({
      slug: "campus-browser",
      title: "校园浏览器",
      subtitle: "校园网、教务系统与学习平台",
      durationMinutes: 30,
      difficulty: "入门",
      goals: ["处理校园网认证", "使用教务与学习平台", "安装学习必备扩展"],
      overview:
        "大学网络环境特殊：校园网常需要认证登录、教务系统限制浏览器、学习平台要求兼容。学会用浏览器的兼容模式、书签和扩展能省很多时间。",
      points: [
        { title: "校园网认证", text: "连接后通常自动弹出认证页；若未弹出，手动访问认证域名或用学校客户端。宿舍路由器设置需按学校规范。" },
        { title: "教务系统", text: "IE 兼容需求可用 Edge 的 IE 模式或学校要求的浏览器；抢课用书签固定入口 + 提前登录。" },
        { title: "学习平台", text: "慕课、知到、学习通等平台建议用 Chrome/Edge 最新版；下载课件注意扩展名。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "warning",
          title: "校园网连上但上不了网",
          text: "先检查是否弹出认证页；弹窗被拦截时点地址栏的弹窗图标放行；还不行就断开重连或联系网络中心。",
        },
        {
          type: "heading",
          text: "开学前浏览器准备",
        },
        {
          type: "list",
          items: [
            "书签栏建「教务/学习/图书馆」三个文件夹。",
            "把抢课入口、选课系统固定到书签栏。",
            "安装翻译、PDF、广告拦截三个基础扩展。",
            "开启浏览记录同步（登录浏览器账号）。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph TD\n  A[连上校园WiFi] --> B{弹出认证页?}\n  B -->|是| C[输入学号密码]\n  B -->|否| D[手动访问认证域名]\n  C --> E[正常上网]\n  D --> E\n  E --> F[访问教务/学习平台]",
          caption: "校园网接入流程",
        },
      ],
      analogy: "校园网像学校宿舍门禁：先刷卡（认证）才能进门；教务系统像老楼，电梯（IE 模式）只认老钥匙。",
      summary: ["校园网认证先看浏览器是否拦截弹窗。", "教务系统兼容性优先，用 Edge IE 模式。", "书签固定常用入口。"],
      mistakes: [
        "私接路由器导致校园网封禁 MAC。",
        "抢课浏览器不支持提示一直失败。",
        "学习平台弹窗被拦截，课件下载不了。",
      ],
      thinking: ["为什么很多校园网要登录认证？", "学校为什么禁止私接路由器？"],
      exercises: [
        "把教务系统、图书馆、学习平台加入书签文件夹。",
        "测试 Edge IE 模式打开教务系统。",
      ],
      quiz: [
        singleChoice("q1", "校园网连接后无法上网，首先检查？", ["认证页面", "更换电脑", "重装系统", "修改 DNS 为 8.8.8.8"], 0, "认证是第一步。"),
        trueFalse("q2", "浏览器弹窗拦截会影响学习平台功能。", true, "授权弹窗即可。"),
        fillBlank("q3", "Edge 的兼容旧网站模式叫 IE ____。", "模式", "IE mode。"),
        trueFalse("q4", "校园网认证前就能直接访问任意网站。", false, "需要先通过认证。"),
      ],
      tags: ["校园网", "浏览器", "教务"],
    }),
    quickLesson({
      slug: "screenshot",
      title: "截图",
      subtitle: "Win+Shift+S 与截图工具",
      durationMinutes: 25,
      difficulty: "入门",
      goals: ["掌握系统截图快捷键", "编辑与标注截图", "自动保存截图"],
      overview:
        "截图是大学生最高频的效率操作：Win+Shift+S 框选截图，截图工具自动打开可标注；Win+PrtScn 全屏自动保存到「图片/屏幕截图」。",
      points: [
        { title: "快捷键全家桶", text: "Win+Shift+S 矩形/任意/窗口/全屏截图；PrtScn 复制全屏到剪贴板；Win+PrtScn 保存全屏。" },
        { title: "标注编辑", text: "截图工具支持矩形、箭头、文字、荧光笔；标注后再分享，注意打码隐私。" },
        { title: "剪贴板流转", text: "截图默认进剪贴板，Ctrl+V 可直接粘贴到文档、微信、PPT。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "warning",
          title: "截图也要讲隐私",
          text: "分享聊天记录前，先给姓名、号码、地址打码；截图工具里用「矩形」或「模糊」处理。",
        },
        {
          type: "heading",
          text: "截图的三种去向",
        },
        {
          type: "list",
          items: [
            "剪贴板：Ctrl+V 直接粘贴，适合快速发图。",
            "自动保存：Win+PrtScn 存到「图片/屏幕截图」。",
            "截图工具窗口：标注后另存或分享。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[Win+Shift+S] --> B[选择区域]\n  B --> C[截图工具标注]\n  C --> D[打码隐私]\n  D --> E[粘贴/保存/分享]",
          caption: "一次规范的截图流程",
        },
      ],
      analogy: "截图像拍照：系统相机（Win+Shift+S）随拍随发，相册（屏幕截图文件夹）自动存底，修图（标注工具）让重点更清楚。",
      summary: ["Win+Shift+S 是截图标准姿势。", "截图后立即标注重点。", "敏感信息分享前打码。"],
      mistakes: [
        "截图后找不到文件，其实在剪贴板。",
        "分享聊天记录不遮挡名字和号码。",
        "用第三方截图软件却不知道系统自带更好用。",
      ],
      thinking: ["截图和录屏对隐私有什么不同风险？", "OCR 截图文字提取怎么实现？"],
      exercises: [
        "用 Win+Shift+S 截取当前窗口并标注重点。",
        "把一张截图粘贴到 Word，体验剪贴板流转。",
      ],
      quiz: [
        singleChoice("q1", "框选截图的快捷键是？", ["Win+Shift+S", "Ctrl+PrtScn", "Alt+F4", "Win+L"], 0, "Win+Shift+S 打开截图工具。"),
        trueFalse("q2", "截图默认会保存到剪贴板。", true, "可直接粘贴。"),
        fillBlank("q3", "Win+PrtScn 会把全屏截图自动保存到「图片/____截图」文件夹。", "屏幕", "Screenshots。"),
        trueFalse("q4", "分享截图前给敏感信息打码是多余操作。", false, "打码保护隐私，不是多余。"),
      ],
      tags: ["截图", "效率", "工具"],
    }),
    quickLesson({
      slug: "screen-record",
      title: "录屏",
      subtitle: "Win+G 录制与剪辑",
      durationMinutes: 25,
      difficulty: "入门",
      goals: ["用 Xbox Game Bar 录屏", "录制系统声音与麦克风", "简单剪辑导出"],
      overview:
        "Windows 自带录屏：Win+G 打开 Xbox Game Bar（游戏录制），可录窗口、应用和系统声音。演示操作、录网课回放都用得上。",
      points: [
        { title: "基础录制", text: "Win+G → 录制按钮或 Win+Alt+R 开始/停止；默认保存到「视频/捕获」。" },
        { title: "声音设置", text: "录制面板齿轮 → 音频：系统声音、麦克风可分别开关；录自己的讲解需要开麦克风。" },
        { title: "其他工具", text: "OBS Studio 免费强大适合直播/教程；剪映适合加字幕剪辑；录课时注意版权。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "warning",
          title: "录屏前先试录 30 秒",
          text: "确认画面、系统声音、麦克风都正常再正式录，避免录完才发现声音没开。",
        },
        {
          type: "heading",
          text: "录一段操作演示的步骤",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "关闭无关通知，清理桌面敏感信息。",
            "Win+Alt+R 开始录制。",
            "逐步操作并口播关键步骤。",
            "Win+Alt+R 停止，到「视频/捕获」查看。",
            "用剪映加字幕或裁剪后导出。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[准备素材] --> B[Game Bar录制]\n  B --> C[检查音画]\n  C --> D[剪辑加字幕]\n  D --> E[导出分享]",
          caption: "录屏工作流",
        },
      ],
      analogy: "录屏像课堂录像：Game Bar 是手机随拍，OBS 是专业摄像机，剪辑软件是后期剪辑室。随拍够用就别架大机器。",
      summary: ["Win+Alt+R 快速录屏。", "音频面板可分别控制系统声与麦克风。", "进阶用 OBS + 剪映。"],
      mistakes: [
        "录完后找不到视频，没注意保存路径。",
        "只录了麦克风没录系统声音。",
        "录制公开课转售/传播，侵犯版权。",
      ],
      thinking: ["录屏对性能影响大吗？", "HDR 屏幕录制为什么容易过曝？"],
      exercises: [
        "用 Win+Alt+R 录一段 30 秒操作并回放。",
        "尝试在录制中同时录入麦克风讲解。",
      ],
      quiz: [
        singleChoice("q1", "开始/停止录屏的快捷键是？", ["Win+Alt+R", "Win+Shift+S", "Ctrl+R", "Alt+Tab"], 0, "Win+Alt+R 控制录制。"),
        trueFalse("q2", "Game Bar 可以分别控制系统声音和麦克风。", true, "音频面板可分别设置。"),
        fillBlank("q3", "免费开源的直播/录制软件是____。", "OBS", "Open Broadcaster Software。"),
        orderQuestion(
          "q4",
          "按顺序完成一次录屏。",
          ["清理桌面", "开始录制", "操作并讲解", "停止并检查"],
          [0, 1, 2, 3],
          "先准备，再录制，后检查。",
        ),
      ],
      tags: ["录屏", "视频", "工具"],
    }),
    quickLesson({
      slug: "pdf-tools",
      title: "PDF 工具链",
      subtitle: "阅读、标注、转换与加密",
      durationMinutes: 30,
      difficulty: "基础",
      goals: ["高效阅读标注 PDF", "完成格式转换", "给 PDF 加密与签名"],
      overview:
        "PDF 工具链覆盖阅读、标注、转换、合并、加密。Edge 内置阅读器支持高亮与填写；格式转换优先在线官网；敏感 PDF 用密码保护。",
      points: [
        { title: "阅读标注", text: "Edge 打开 PDF 可高亮、批注、朗读；OneNote 可以「打印到 OneNote」摘录课件。" },
        { title: "转换", text: "Word/Excel 导出 PDF 保排版；PDF 转 Word 用 Adobe 或小型开源工具，注意上传隐私。" },
        { title: "加密签名", text: "打印为 PDF 时不可加密，需要「另存为」或 Acrobat；电子签名用「图片插入」或签署工具。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "课件高效阅读法",
          text: "用 Edge 高亮关键概念 → 批注自己的理解 → 导出带批注的 PDF 归档。期末复习时只看高亮和批注，效率翻倍。",
        },
        {
          type: "heading",
          text: "PDF 安全三原则",
        },
        {
          type: "list",
          items: [
            "隐私文件不上传陌生在线转换站。",
            "敏感 PDF 设置打开密码，密码另渠道发送。",
            "扫描件先 OCR 再搜索复制，交作业前确认。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[Word/PPT] --> B[另存为PDF]\n  B --> C[Edge标注]\n  C --> D[导出批注版]\n  B --> E[合并/加密]\n  E --> F[提交或归档]",
          caption: "PDF 工具链",
        },
      ],
      analogy: "PDF 工具链像文件加工厂：阅读是看货，标注是贴标签，转换是重新包装，加密是上锁。加工前想清楚这一步要不要。",
      summary: ["Edge 内置阅读标注够用。", "转换工具注意隐私，敏感文档本地处理。", "加密签名各有用例。"],
      mistakes: [
        "把隐私 PDF 传到陌生在线转换站。",
        "需要可编辑格式却一直发 PDF。",
        "加密后忘记密码，文件永远打不开。",
      ],
      thinking: ["为什么论文答辩要交 PDF？", "PDF 里的链接和书签怎么管理？"],
      exercises: [
        "用 Edge 打开课件 PDF，练习高亮和批注。",
        "把一个 Word 文档导出 PDF 并加密。",
      ],
      quiz: [
        singleChoice("q1", "Edge 阅读 PDF 能做什么？", ["高亮批注", "自动写论文", "压缩视频", "安装软件"], 0, "Edge 支持标注。"),
        trueFalse("q2", "在线转换站上传隐私文件有风险。", true, "文件可能被存储。"),
        fillBlank("q3", "给 PDF 设置打开密码属于____保护。", "加密", "PDF 加密。"),
        trueFalse("q4", "扫描版 PDF 可以直接搜索文字。", false, "需要先 OCR。"),
      ],
      tags: ["PDF", "工具", "文档"],
      simulator: "pdf",
    }),
    quickLesson({
      slug: "ai-tools-college",
      title: "AI 工具",
      subtitle: "写作、翻译、PPT 与学习助手",
      durationMinutes: 35,
      difficulty: "入门",
      goals: ["认识主流 AI 工具", "用 AI 辅助学习", "识别 AI 幻觉"],
      overview:
        "大学生常用的 AI 工具：ChatGPT/DeepSeek 问答写作、Claude 长文分析、Kimi 长文档阅读、豆包/通义全能助手、Gamma 生成 PPT。AI 是助手，不是答案机器。",
      points: [
        { title: "场景矩阵", text: "翻译用 DeepL/沉浸式翻译；长论文用 Claude/Kimi 总结；生成 PPT 用 Gamma；查资料用 Perplexity（带引用）。" },
        { title: "提问公式", text: "角色 + 任务 + 上下文 + 要求 + 输出格式：如「你是高数助教，解释泰勒展开，要求用生活例子，500 字以内」。" },
        { title: "幻觉与版权", text: "AI 会一本正经地编造事实，关键数据必须核实；直接复制 AI 内容交作业有学术诚信风险。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "warning",
          title: "AI 使用边界",
          text: "可以让 AI 解释概念、检查逻辑、出练习题；不要让它替你写整篇作业，更不要把 AI 生成的参考文献直接放进论文。",
        },
        {
          type: "heading",
          text: "一个 AI 辅助学习流程",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "自己先读课本，标注不理解的概念。",
            "让 AI 用生活类比解释，再回课本核对。",
            "让 AI 出 5 道自测题，先自己答再看解析。",
            "把 AI 总结与老师课件交叉验证。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[自己先学] --> B[AI解释难点]\n  B --> C[回课本核对]\n  C --> D[AI出题自测]\n  D --> E[交叉验证]",
          caption: "AI 辅助学习闭环",
        },
        {
          type: "simulator",
          kind: "prompt-coach",
          title: "Prompt 练习",
          description: "写一条清晰的提示词，看看 AI 反馈评分。",
        },
      ],
      analogy: "AI 工具像图书馆+助教：问它怎么查资料很快，但把它的答案直接交作业，就像抄书，老师一眼看出来。",
      summary: ["不同 AI 各有强项，按场景选择。", "好的提问公式产出好的答案。", "AI 会幻觉，关键信息要验证。"],
      mistakes: [
        "让 AI 生成参考文献，编出假论文。",
        "把 AI 写的整篇交作业。",
        "把隐私/考试内容直接发给 AI。",
      ],
      thinking: ["AI 搜索和传统搜索有什么本质区别？", "课程论文哪些环节适合用 AI？"],
      exercises: [
        "用「角色+任务+要求」公式让 AI 解释一个课程概念。",
        "用带引用的 AI 搜索查一个事实，并去原始来源验证。",
      ],
      quiz: [
        singleChoice("q1", "AI 一本正经说错事实的现象叫？", ["幻觉", "卡顿", "过拟合", "缓存"], 0, "Hallucination。"),
        trueFalse("q2", "AI 生成的参考文献可以直接使用。", false, "必须核实真实性。"),
        fillBlank("q3", "长文档阅读与总结常用工具之一是____。", "Kimi", "Kimi 等支持长文档。"),
        trueFalse("q4", "AI 总结和老师课件完全一致时可以放心引用。", false, "仍需交叉验证并注明来源。"),
      ],
      tags: ["AI", "工具", "学习"],
      simulator: "prompt-coach",
    }),
    quickLesson({
      slug: "collab-suite",
      title: "学习协作套件",
      subtitle: "网盘、在线文档与会议",
      durationMinutes: 30,
      difficulty: "入门",
      goals: ["搭建个人协作工具链", "使用在线文档协作", "组织线上会议"],
      overview:
        "大学的团队作业越来越多：在线文档实时协作、网盘共享资料、会议软件线上答辩。推荐组合：腾讯文档/WPS + OneDrive + 腾讯会议/飞书。",
      points: [
        { title: "在线文档", text: "腾讯文档、WPS 云文档、飞书文档都支持多人同时编辑，历史版本可恢复；权限设为「可编辑/可评论/只读」。" },
        { title: "网盘共享", text: "小组资料用网盘建共享文件夹；按「资料/成品/交付」分层，避免版本混乱。" },
        { title: "会议工具", text: "腾讯会议、飞书会议适合小组讨论；录屏存档会议内容；提前测试麦克风和共享屏幕。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "一份小组项目怎么分工",
          text: "一个在线文档写大纲 → 每人负责一节（评论区认领）→ 修订模式互改 → 最后一人统一排版。所有人在同一个文件里协作，不传“最终版”。",
        },
        {
          type: "heading",
          text: "权限三档速查",
        },
        {
          type: "list",
          items: [
            "可编辑：核心成员，负责写内容。",
            "可评论：审阅者，只提意见不改内容。",
            "只读：老师/汇报对象，看最终版。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[在线文档] --> B[多人编辑]\n  B --> C[修订模式]\n  C --> D[统一排版]\n  E[网盘] --> F[资料/成品分层]\n  G[会议] --> H[讨论+录屏存档]",
          caption: "协作套件分工",
        },
      ],
      analogy: "协作套件像小组办公室：在线文档是共享黑板，网盘是资料柜，会议是会议室。办公室规则清楚，小组才不吵架。",
      summary: ["在线文档解决多人编辑冲突。", "共享文件夹分层管理版本。", "会议工具提前测试设备。"],
      mistakes: [
        "把文档权限设成「互联网上任何人可编辑」。",
        "小组各存一版，合并时崩溃。",
        "会议不静音，噪音一片。",
      ],
      thinking: ["为什么在线文档能解决「同时编辑冲突」？", "共享链接的权限粒度有哪些？"],
      exercises: [
        "创建一个小组共享文档，设置合理权限。",
        "用在线文档和同学完成一次 20 分钟协作编辑。",
      ],
      quiz: [
        singleChoice("q1", "多人同时编辑最合适的工具是？", ["在线文档", "U 盘拷贝", "微信发文件", "打印传阅"], 0, "在线文档实时协作。"),
        trueFalse("q2", "共享链接权限可以设为只读。", true, "权限分级。"),
        fillBlank("q3", "线上会议的常见工具之一是腾讯____。", "会议", "腾讯会议。"),
        matchQuestion(
          "q4",
          "把权限和用途连起来。",
          ["可编辑", "可评论", "只读", "网盘分层"],
          ["成员写内容", "审阅者提意见", "老师看终稿", "资料/成品归档"],
          [0, 1, 2, 3],
          "编辑给成员，评论给审阅，只读给观众，网盘管归档。",
        ),
      ],
      tags: ["协作", "在线文档", "会议"],
    }),
  ],
};
