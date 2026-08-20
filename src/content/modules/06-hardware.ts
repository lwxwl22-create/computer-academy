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

export const module06: CourseModule = {
  ...moduleMeta({
    slug: "06-hardware",
    order: 6,
    title: "硬件深入",
    subtitle: "从参数到真实体验",
    description: "深入 CPU 架构、显卡渲染、接口协议与性能测试，看懂硬件评测。",
    icon: "CircuitBoard",
    accent: "from-violet-500 to-purple-400",
    difficulty: "进阶",
    estimatedMinutes: 340,
  }),
  lessons: [
    quickLesson({
      slug: "cpu-deep",
      title: "CPU 深入",
      subtitle: "架构、制程与功耗",
      durationMinutes: 35,
      difficulty: "进阶",
      goals: ["理解制程与架构", "看懂 TDP 与功耗", "区分大小核设计"],
      overview:
        "CPU 性能由架构、制程、频率、缓存和功耗共同决定。制程（nm）影响能效，架构决定每时钟性能（IPC），TDP 描述散热需求而非真实功耗。",
      points: [
        { title: "制程与 IPC", text: "7nm/4nm 等制程越小，晶体管越密、能效越高；架构升级带来的 IPC 提升比单纯提频更重要。" },
        { title: "TDP 的真相", text: "TDP 是散热设计功耗参考，实际功耗受睿频策略和厂商调校影响，同型号笔记本功耗释放不同。" },
        { title: "大小核", text: "现代 CPU 混合大小核：大核扛性能，小核省电，由调度器分配任务。Windows 11 对混合架构优化更好。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "一个真实例子",
          text: "同样叫 i5，低压 U 系列和标压 H 系列可能差一倍性能：一颗 28W、一颗 45W 以上。看 CPU 不能只看名字，还要看后缀和功耗释放。",
        },
        {
          type: "heading",
          text: "看 CPU 评测先看这三项",
        },
        {
          type: "list",
          items: [
            "单核跑分：决定日常软件、网页、游戏的响应速度。",
            "多核跑分：决定视频导出、编译、虚拟机等并行任务。",
            "持续功耗曲线：满载 10 分钟后频率还剩多少，比峰值更真实。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[架构] --> D[每时钟性能 IPC]\n  B[制程] --> E[能效]\n  C[功耗墙] --> F[持续频率]\n  D --> G[实际体验]\n  E --> G\n  F --> G",
          caption: "CPU 性能的决定因素",
        },
        {
          type: "simulator",
          kind: "cpu",
          title: "拆开 CPU 看核心与缓存",
          description: "点击核心、缓存、内存控制器，复习它们的分工。",
        },
      ],
      analogy: "CPU 架构像发动机设计，制程像材料工艺，频率像转速，功耗像油耗。设计再好的发动机，散热跟不上也发挥不出马力。",
      summary: ["架构决定每周期性能，制程决定能效。", "TDP 是散热参考而非实际功耗。", "大小核由调度器动态分配。"],
      mistakes: [
        "只看 GHz 数字比性能。",
        "把 TDP 当实际功耗。",
        "认为核心越多一定越快。",
      ],
      thinking: ["为什么苹果 M 系列能效突出？", "超频和降频分别发生在什么场景？"],
      exercises: [
        "查一款主流 CPU 的架构、制程、TDP 与真实评测。",
        "用 HWiNFO 观察你电脑 CPU 的实时功耗与频率。",
      ],
      quiz: [
        singleChoice("q1", "IPC 提升主要来自？", ["架构优化", "提高电压", "更换机箱", "加大风扇"], 0, "每时钟指令数与架构相关。"),
        trueFalse("q2", "TDP 等于 CPU 实际功耗。", false, "TDP 是散热参考。"),
        fillBlank("q3", "制程单位常用____表示。", "nm", "纳米。"),
        matchQuestion(
          "q4",
          "把 CPU 概念和含义连起来。",
          ["IPC", "TDP", "大小核", "制程"],
          ["每时钟指令数", "散热设计功耗", "大核性能小核省电", "晶体管密度"],
          [0, 1, 2, 3],
          "IPC 看架构，TDP 看散热，大小核分工，制程看密度。",
        ),
      ],
      tags: ["CPU", "架构", "进阶"],
      simulator: "cpu",
    }),
    quickLesson({
      slug: "gpu-deep",
      title: "GPU 深入",
      subtitle: "显存、渲染管线与 DLSS",
      durationMinutes: 35,
      difficulty: "进阶",
      goals: ["理解显存与带宽", "认识渲染管线", "了解 DLSS 与光追"],
      overview:
        "显卡性能由 GPU 核心规模、频率、显存容量与带宽、功耗共同决定。光追（Ray Tracing）让光影更真实但极耗性能，DLSS/FSR 用 AI 缩放换帧率。",
      points: [
        { title: "显存", text: "容量影响可加载的纹理规模，带宽影响高分辨率下的数据吞吐。8GB 显存在 1440p 够用，4K 大型游戏偏紧。" },
        { title: "渲染管线", text: "顶点处理 → 光栅化 → 像素着色 → 输出。现代 GPU 还承担 AI 推理、视频编码等通用计算。" },
        { title: "DLSS 与光追", text: "DLSS 用低分辨率渲染 + AI 超分提升帧率；光追单独开启可能掉一半帧率，常与 DLSS 搭配。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "warning",
          title: "显存不是一切",
          text: "16GB 显存但核心很弱的显卡，游戏表现不一定比 8GB 强卡好。显存只决定「装得下多少」，核心规模决定「算得多快」。",
        },
        {
          type: "heading",
          text: "笔记本显卡先看三件事",
        },
        {
          type: "list",
          items: [
            "功耗释放：同样 RTX 4060，满血 140W 与残血 80W 差距明显。",
            "散热实测：双烤温度与频率曲线决定持续性能。",
            "显存与带宽：1080p/1440p 主流够用，4K 看显存。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[3D场景] --> B[顶点处理]\n  B --> C[光栅化]\n  C --> D[像素着色]\n  D --> E[输出画面]\n  F[DLSS] -.低分辨率+AI超分.-> D\n  G[光追] -.真实光影.-> D",
          caption: "渲染管线与加速技术",
        },
        {
          type: "simulator",
          kind: "gpu",
          title: "对比 CPU 与 GPU 并行",
          description: "再看一次千个小核心同时开工的效果。",
        },
      ],
      analogy: "GPU 像印刷厂：核心是印刷机，显存是纸张仓库，带宽是传送带，DLSS 是智能排版（小样放大），光追是精细印刷工艺。",
      summary: ["显存容量与带宽共同决定大纹理场景表现。", "光追真实但昂贵，DLSS 是性能救星。", "显卡也承担 AI 与视频任务。"],
      mistakes: [
        "只看显存大小买显卡。",
        "买了高端显卡配老旧 CPU 导致瓶颈。",
        "电源功率不够硬上高端显卡。",
      ],
      thinking: ["为什么 4K 游戏对显存和带宽要求骤增？", "AI 超分和原生渲染有什么差异？"],
      exercises: [
        "用 GPU-Z 查看显卡核心、显存与带宽。",
        "在游戏中对比 DLSS 开关的帧率与画质。",
      ],
      quiz: [
        singleChoice("q1", "DLSS 的核心技术是？", ["AI 超分辨率", "更粗的像素", "降低屏幕亮度", "预渲染动画"], 0, "DLSS 用 AI 从低分辨率重建高分辨率。"),
        trueFalse("q2", "显存越大显卡性能一定越强。", false, "核心规模与带宽同样关键。"),
        fillBlank("q3", "光线追踪的英文简称是____。", "RT", "Ray Tracing。"),
        singleChoice("q4", "笔记本同型号显卡的实际性能最受什么影响？", ["功耗释放与散热", "外壳颜色", "键盘灯", "屏幕尺寸"], 0, "功耗释放决定持续性能。"),
      ],
      tags: ["GPU", "显卡", "进阶"],
      simulator: "gpu",
    }),
    quickLesson({
      slug: "display-deep",
      title: "屏幕深入",
      subtitle: "IPS、OLED 与 HDR",
      durationMinutes: 30,
      difficulty: "进阶",
      goals: ["区分主流面板类型", "理解 HDR 与色深", "看懂屏幕评测"],
      overview:
        "屏幕面板类型决定观感：IPS 视角广色彩稳，OLED 对比度无限黑场但可能烧屏，TN 响应快但视角差。HDR 需要亮度、色域、色深共同支撑。",
      points: [
        { title: "面板类型", text: "IPS 是笔记本主流；OLED 适合影音与设计（注意任务栏常驻烧屏）；mini-LED 通过分区控光提升 HDR。" },
        { title: "色深与抖动", text: "8bit 约 1670 万色，10bit 更平滑；很多 8bit+FRC 是「抖动到 10bit」，色阶过度更自然。" },
        { title: "HDR 真假", text: "真 HDR 需要 600 尼特以上峰值亮度与广色域；仅支持 HDR 解码不等于好的 HDR 显示。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "学生屏的及格线",
          text: "2K 分辨率 + 100% sRGB + 300 尼特亮度 + 护眼认证，是学生笔记本屏幕的舒适基线。低色域屏文字发虚、颜色发灰，比分辨率更影响体验。",
        },
        {
          type: "heading",
          text: "看懂屏幕评测数据",
        },
        {
          type: "list",
          items: [
            "色域覆盖：sRGB 100% 是基准，P3 更适合设计与影视。",
            "峰值亮度：HDR 需要 600 尼特以上，SDR 300 尼特及格。",
            "色准 ΔE：平均小于 2 才适合修图调色。",
            "均匀性：四角偏暗是常见问题，评测会测 5 点亮度。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph TD\n  A[面板类型] --> B[IPS 均衡主流]\n  A --> C[OLED 黑场佳 怕烧屏]\n  A --> D[TN 响应快 视角差]\n  E[HDR] --> F[亮度600+\n广色域\n高色深]",
          caption: "面板与 HDR 的关系",
        },
      ],
      analogy: "面板是画布材质，色深是颜料层级，HDR 是灯光系统。好画布 + 好颜料 + 好灯光，才能呈现真实画面。",
      summary: ["IPS 均衡，OLED 对比度强，TN 电竞向。", "HDR 是亮度、色域、色深的系统能力。", "屏幕评测要看实测色准与亮度。"],
      mistakes: [
        "看到「支持 HDR」就以为屏幕好。",
        "OLED 笔记本长期固定壁纸和任务栏。",
        "把面板类型和分辨率混为一谈。",
      ],
      thinking: ["为什么 OLED 不适合长时间办公人群？", "分区控光为什么能提升 HDR 效果？"],
      exercises: [
        "用屏显信息工具查看你屏幕的色深与刷新率。",
        "对比一款 IPS 和 OLED 的实测亮度与色域数据。",
      ],
      quiz: [
        singleChoice("q1", "对比度最高的主流面板是？", ["OLED", "TN", "IPS", "VA 低端"], 0, "OLED 自发光，黑场接近无限。"),
        trueFalse("q2", "支持 HDR 解码就代表 HDR 效果好。", false, "硬件亮度色域更重要。"),
        fillBlank("q3", "10bit 色深比 8bit 拥有更多____过渡。", "色阶", "颜色层次。"),
        trueFalse("q4", "屏幕色准 ΔE 越小越好。", true, "ΔE 越小，色彩越准。"),
      ],
      tags: ["屏幕", "OLED", "HDR"],
    }),
    quickLesson({
      slug: "ports",
      title: "接口",
      subtitle: "USB、HDMI、雷电与扩展坞",
      durationMinutes: 30,
      difficulty: "基础",
      goals: ["认识 USB 与雷电协议", "区分视频接口", "学会使用扩展坞"],
      overview:
        "接口决定设备连接能力：USB-A 是传统方口，USB-C 是新一代通用口，雷电（Thunderbolt）是高速 USB-C 的进阶协议，HDMI/DP 用于视频输出。",
      points: [
        { title: "USB 版本", text: "USB 2.0 480Mbps 适合键鼠；USB 3.x 5-20Gbps 适合移动硬盘；USB4 40Gbps 整合雷电与视频。" },
        { title: "视频接口", text: "HDMI 电视显示器通用；DP 带宽高适合高刷电竞屏；USB-C 视频输出越来越常见。" },
        { title: "扩展坞", text: "笔记本接口少时用扩展坞：注意电源输入（PD）、视频输出规格和数据带宽分配。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "warning",
          title: "接口名字的坑",
          text: "USB 3.0/3.1/3.2 名字很乱，本质看带宽：5Gbps、10Gbps、20Gbps。买线时别只看“USB-C”，要看它支持什么协议。",
        },
        {
          type: "heading",
          text: "扩展坞选购三问",
        },
        {
          type: "list",
          items: [
            "供电：支持 PD 反向充电吗？功率够不够笔记本满载？",
            "视频：能输出 4K60 还是 4K30？连接的是 HDMI 还是 DP？",
            "带宽：同时插硬盘和显示器，会不会互相抢带宽？",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[USB-A] --> D[键鼠/老设备]\n  B[USB-C] --> E[充电/数据/视频]\n  C[雷电] --> F[40Gbps 高速扩展]\n  G[HDMI] --> H[电视/显示器]\n  I[DP] --> J[高刷电竞屏]",
          caption: "常见接口的适用场景",
        },
      ],
      analogy: "接口像插座标准：USB-A 是老式两脚插，USB-C 是万能多功能插座，雷电是带高速公路的万能插座，扩展坞是插线板。",
      summary: ["USB-C 是趋势，雷电是高速版。", "HDMI/DP/USB-C 视频各有适用场景。", "扩展坞要看供电与带宽分配。"],
      mistakes: [
        "买 USB 3.0 移动硬盘插 USB 2.0 口，速度减半。",
        "把显示器接主板 HDMI，独显没工作。",
        "扩展坞充电功率不足，笔记本越充越少。",
      ],
      thinking: ["为什么接口名称这么混乱？", "同一条 USB-C 线为什么价格差十倍？"],
      exercises: [
        "盘点你设备的全部接口类型与版本。",
        "确认你的扩展坞是否支持 PD 反向充电与视频输出。",
      ],
      quiz: [
        singleChoice("q1", "40Gbps 且整合视频/数据的接口标准是？", ["USB4/雷电", "USB 2.0", "VGA", "PS/2"], 0, "USB4/雷电带宽最高。"),
        trueFalse("q2", "显示器必须接独立显卡的 HDMI 口。", false, "核显输出同样可用，但独显渲染需接独显口。"),
        fillBlank("q3", "Thunderbolt 的中文名是____。", "雷电", "英特尔主导的高速接口。"),
        matchQuestion(
          "q4",
          "把接口和典型用途连起来。",
          ["USB 2.0", "雷电", "DP", "扩展坞"],
          ["键鼠", "高速数据与视频", "高刷电竞屏", "扩展接口不足"],
          [0, 1, 2, 3],
          "键鼠用 USB 2.0，雷电高速，DP 高刷，扩展坞救接口少。",
        ),
      ],
      tags: ["接口", "USB", "雷电"],
    }),
    quickLesson({
      slug: "wifi-deep",
      title: "WiFi 深入",
      subtitle: "WiFi 6、频段与 Mesh",
      durationMinutes: 30,
      difficulty: "基础",
      goals: ["理解 WiFi 协议代际", "看懂频段与信道", "了解 Mesh 组网"],
      overview:
        "WiFi 代际命名从 802.11n（WiFi 4）到 WiFi 7；WiFi 6 引入 OFDMA 和 MU-MIMO，多设备时更稳定。频段越高带宽越大，穿墙越弱。",
      points: [
        { title: "WiFi 6/6E/7", text: "WiFi 6 提升多设备并发效率，6E 增加 6GHz 频段，WiFi 7 带宽更高。设备与路由器都支持才能享受。" },
        { title: "信道", text: "2.4GHz 有 1/6/11 等非重叠信道；路由器自动选信道，邻居太多时可手动固定空闲信道。" },
        { title: "Mesh 组网", text: "大户型用 Mesh 多节点漫游，手机在各房间自动切换；比「WiFi 中继」体验好很多。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "信号满格但网速慢",
          text: "可能是频段拥挤、路由器位置不好或 ISP 问题。先插网线测速排除宽带，再考虑换信道或加节点。",
        },
        {
          type: "heading",
          text: "路由器的三个常见位置错误",
        },
        {
          type: "list",
          items: [
            "塞进电视柜或弱电箱，信号被金属和木板屏蔽。",
            "放在墙角地面，覆盖范围打折。",
            "贴着微波炉/冰箱，2.4GHz 干扰严重。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[2.4GHz] --> B[穿墙好 易拥挤]\n  C[5GHz] --> D[速度快 穿墙弱]\n  E[6GHz] --> F[WiFi 6E/7 更宽]\n  G[Mesh] --> H[多节点无缝漫游]",
          caption: "频段与组网选择",
        },
      ],
      analogy: "WiFi 协议像公路等级，频段像车道宽度，信道像行车道，Mesh 像城市多枢纽换乘。车多时，路宽、分流、换乘顺畅才不堵。",
      summary: ["WiFi 6 面向多设备并发优化。", "5/6GHz 快但穿墙弱。", "大户型优先 Mesh。"],
      mistakes: [
        "路由器支持 WiFi 6 但设备旧，误以为提速。",
        "为了信号把路由器调成「最大发射功率」违规。",
        "Mesh 和无线中继混为一谈。",
      ],
      thinking: ["为什么运营商送的「千兆路由器」还卡？", "WiFi 信号满格但网速慢是什么原因？"],
      exercises: [
        "在路由器管理页查看当前信道与频段。",
        "判断你的设备是否支持 WiFi 6。",
      ],
      quiz: [
        singleChoice("q1", "WiFi 6 的核心优势是？", ["多设备并发效率", "穿墙更强", "网线免费", "功耗更高"], 0, "OFDMA 提升并发。"),
        singleChoice("q2", "6GHz 频段属于哪个代际？", ["WiFi 6E/7", "WiFi 4", "WiFi 3", "蓝牙"], 0, "6E 引入 6GHz。"),
        trueFalse("q3", "设备不支持 WiFi 6 也能享受其全部优势。", false, "两端都需支持。"),
        trueFalse("q4", "Mesh 节点之间可以自动无缝漫游。", true, "Mesh 的核心就是无缝漫游。"),
      ],
      tags: ["WiFi", "网络", "路由"],
    }),
    quickLesson({
      slug: "bluetooth",
      title: "蓝牙",
      subtitle: "配对、版本与设备管理",
      durationMinutes: 25,
      difficulty: "入门",
      goals: ["完成蓝牙配对", "理解蓝牙版本差异", "解决常见连接问题"],
      overview:
        "蓝牙用于短距离无线连接：耳机、鼠标、键盘、音箱。配对本质是设备互信握手，连接问题大多出在电量、距离和「已配对但未连接」状态。",
      points: [
        { title: "配对流程", text: "Win+I → 蓝牙和其他设备 → 添加设备；设备进入配对模式（通常长按按键）后即可发现。" },
        { title: "版本", text: "蓝牙 5.x 传输距离和带宽优于 4.x；LE Audio（LC3）音质与功耗更好，需要两端支持。" },
        { title: "故障排查", text: "先移除设备重新配对；检查电量；Windows 蓝牙服务是否运行；距离近、避开 USB 3.0 口干扰。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "warning",
          title: "连不上的万能三板斧",
          text: "移除设备 → 重新配对；检查是否已被手机占用；重启电脑蓝牙服务。80% 的连接问题都在这三步里解决。",
        },
        {
          type: "heading",
          text: "蓝牙和 Wi-Fi 的区分",
        },
        {
          type: "list",
          items: [
            "蓝牙：短距离、低功耗，适合耳机、键鼠、传小文件。",
            "Wi-Fi：高速、远距离，适合上网和大文件。",
            "两者都用 2.4GHz，极端拥挤时可能互相干扰。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph TD\n  A[打开蓝牙] --> B[设备进入配对模式]\n  B --> C[搜索并连接]\n  C --> D{连接成功?}\n  D -->|否| E[移除重配对]\n  E --> B\n  D -->|是| F[设为默认设备]",
          caption: "蓝牙配对流程图",
        },
      ],
      analogy: "蓝牙配对像交换名片：设备先广播「我是谁」，主机发现后建立信任。名片丢过（已配对未连接），重新交换一次就好了。",
      summary: ["配对入口在设置-蓝牙和其他设备。", "蓝牙 5.x 距离带宽更好，LE Audio 是新方向。", "连接故障先移除重连。"],
      mistakes: [
        "一直点「添加设备」却不把设备调到配对模式。",
        "耳机已连手机，电脑自然连不上。",
        "以为蓝牙和 WiFi 会互相抢网速而乱关。",
      ],
      thinking: ["蓝牙耳机为什么有时音画不同步？", "TWS 耳机左右耳为什么有主副之分？"],
      exercises: [
        "把你的蓝牙耳机重新配对一次，记录配对模式入口。",
        "查看系统蓝牙版本与已配对设备列表。",
      ],
      quiz: [
        singleChoice("q1", "蓝牙设备配对前通常需要？", ["进入配对模式", "连接充电线", "重启电脑", "更新 BIOS"], 0, "配对模式让设备可被发现。"),
        trueFalse("q2", "蓝牙耳机连接失败时重新配对是有效手段。", true, "移除并重配对解决大多数问题。"),
        fillBlank("q3", "蓝牙的新一代低功耗音频标准是____。", "LE Audio", "LC3 编码。"),
      ],
      tags: ["蓝牙", "外设", "连接"],
    }),
    quickLesson({
      slug: "power",
      title: "电源",
      subtitle: "适配器、PD 与供电安全",
      durationMinutes: 25,
      difficulty: "基础",
      goals: ["理解电源功率计算", "认识 PD 快充", "掌握供电安全"],
      overview:
        "台式机电源（PSU）决定整机稳定，笔记本适配器决定充电速度与性能上限。功率不足会导致重启、性能下降甚至硬件损坏。",
      points: [
        { title: "台式机电源", text: "功率 = 整机峰值功耗 + 30% 余量；认准 80PLUS 认证与 12V 输出；杂牌电源是整机隐患。" },
        { title: "PD 充电", text: "USB-C PD 支持 20V/5A 等档位，65W 适合轻薄本；游戏本需要 100W+ 或专用方口。" },
        { title: "安全习惯", text: "不用劣质排插、不私接大功率电器；充电线破损立即更换；雷电天气重要数据先保存。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "warning",
          title: "一个常见误判",
          text: "用 65W 手机充电器给游戏本供电，边用边掉电，还以为是电池坏了。其实功率不够时，电脑只能「用多少补多少」。",
        },
        {
          type: "heading",
          text: "电源选购四看",
        },
        {
          type: "list",
          items: [
            "功率：峰值 + 30% 余量，别卡着满载线。",
            "认证：80PLUS 金牌以上，转换效率高、发热小。",
            "12V 输出：显卡和 CPU 主要吃 12V，别只看总瓦数。",
            "接口：确认有足够的 8pin/16pin 显卡供电线。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[整机峰值功耗] --> B[+30%余量]\n  B --> C[电源额定功率]\n  D[80PLUS认证] --> E[效率与发热]\n  F[12V输出] --> G[CPU/GPU供电]",
          caption: "电源怎么选",
        },
      ],
      analogy: "电源像心脏供血：功率是血量，电压是血压，纹波是血流平稳度。心脏（电源）不行，再好的器官（硬件）也发挥不出来。",
      summary: ["电源功率留足余量，认准认证。", "PD 充电看功率档位匹配。", "用电安全比性能更重要。"],
      mistakes: [
        "整机 500W 买 450W 电源，满载重启。",
        "用手机充电器给游戏本充电，边用边掉电。",
        "插座超载还插一堆设备。",
      ],
      thinking: ["为什么高端显卡要 8pin/16pin 供电？", "笔记本「省电模式」如何影响性能？"],
      exercises: [
        "用功耗计算器估算你台式机/笔记本的电源需求。",
        "检查你的适配器铭牌，记录电压与功率。",
      ],
      quiz: [
        singleChoice("q1", "电源功率应如何选择？", ["峰值功耗 + 30% 余量", "刚好等于峰值", "越小越好", "越大一定越省电"], 0, "留余量保稳定。"),
        trueFalse("q2", "手机充电器可以长期给游戏本供电。", false, "功率不足会掉电降频。"),
        fillBlank("q3", "USB-C 通用充电协议是____。", "PD", "Power Delivery。"),
        orderQuestion(
          "q4",
          "按顺序排出电源选购流程。",
          ["估算整机功耗", "加 30% 余量", "确认 80PLUS 认证", "核对供电接口"],
          [0, 1, 2, 3],
          "先算功耗，再留余量，再看认证和接口。",
        ),
      ],
      tags: ["电源", "PD", "供电"],
    }),
    quickLesson({
      slug: "storage-deep",
      title: "内存与硬盘深入",
      subtitle: "DDR5、NVMe 与选购",
      durationMinutes: 30,
      difficulty: "进阶",
      goals: ["理解 DDR5 与双通道", "看懂 NVMe 与 PCIe 代际", "正确选购扩容"],
      overview:
        "内存进入 DDR5 时代，频率更高但延迟略增；双通道让带宽翻倍，核显提升明显。SSD 用 PCIe 4.0/5.0 NVMe，速度越来越快，但日常使用感知差异有限。",
      points: [
        { title: "DDR 代数", text: "DDR5 起始频率高、单条容量大，但升级必须确认主板支持，混插 DDR4 插不进去。" },
        { title: "NVMe 代际", text: "PCIe 3.0 约 3500MB/s，4.0 约 7000MB/s，5.0 翻倍；实际办公看随机读写，升级感知不如换内存明显。" },
        { title: "扩容注意", text: "笔记本先查内存是否板载、有几个插槽；SSD 看 M.2 长度 2280、协议与散热。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "先查再买",
          text: "扩容前用 CPU-Z/系统信息确认：内存代数、频率、是否双通道、最大容量；SSD 确认是 SATA 还是 NVMe、M.2 还是 2.5 寸。",
        },
        {
          type: "heading",
          text: "什么时候该升级",
        },
        {
          type: "list",
          items: [
            "内存：开多个浏览器+软件就 80% 占用，升级收益最大。",
            "硬盘：机械盘换 NVMe SSD，开机和软件启动提升明显。",
            "SSD 换更快的 SSD：日常办公感知有限，谨慎花钱。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[瓶颈判断] --> B{内存占用高?}\n  A --> C{磁盘100%?}\n  B --> D[升级内存]\n  C --> E[机械换SSD]\n  C -->|SSD已满| F[清理或换大容量]",
          caption: "升级决策树",
        },
      ],
      analogy: "双通道内存像双向八车道，单通道像单行道；NVMe 像高速收费站多开窗口。带宽再大，日常小文件（短途）体验差别有限。",
      summary: ["DDR5 与双通道提升内存带宽。", "NVMe 代数影响顺序读写，办公感知有限。", "扩容先确认插槽与兼容性。"],
      mistakes: [
        "买 DDR5 内存插进 DDR4 主板。",
        "扩容时混用不同频率内存造成降频。",
        "为省事买无散热贴片的发热 SSD。",
      ],
      thinking: ["为什么笔记本厂商喜欢焊死内存？", "PS5 为什么用 PCIe 4.0 SSD 而不用更快的？"],
      exercises: [
        "用 CPU-Z 查看内存通道模式与频率。",
        "查你的笔记本是否有空闲 M.2 或内存插槽。",
      ],
      quiz: [
        singleChoice("q1", "双通道内存的主要收益是？", ["带宽翻倍", "容量翻倍", "延迟翻倍", "功耗翻倍"], 0, "双通道提升内存带宽。"),
        trueFalse("q2", "DDR4 和 DDR5 内存可以混插。", false, "插槽不兼容。"),
        fillBlank("q3", "M.2 SSD 常见长度规格是____。", "2280", "22mm 宽 80mm 长。"),
        matchQuestion(
          "q4",
          "把场景和升级建议连起来。",
          ["内存占用 90%", "机械硬盘 100%", "SSD 只剩 5%", "4K 游戏卡顿"],
          ["加内存", "换 NVMe SSD", "清理或换大容量", "看显卡与显存"],
          [0, 1, 2, 3],
          "不同瓶颈对应不同升级。",
        ),
      ],
      tags: ["内存", "SSD", "NVMe"],
    }),
    quickLesson({
      slug: "benchmark",
      title: "性能测试",
      subtitle: "跑分与真实体验",
      durationMinutes: 30,
      difficulty: "基础",
      goals: ["理解跑分意义", "使用常见测试工具", "结合场景解读结果"],
      overview:
        "跑分是标准化的性能测量：Cinebench 测 CPU 渲染，3DMark 测游戏，CrystalDiskMark 测硬盘，PCMark 测整机。但跑分不等于体验，散热、续航、键盘等都要看评测。",
      points: [
        { title: "常用工具", text: "CPU-Z（信息）、Cinebench R23（CPU）、3DMark（GPU）、CrystalDiskMark（SSD）、HWiNFO（监控）。" },
        { title: "怎么看跑分", text: "横向比较同型号机型；注意功耗墙：持续跑分 vs 短时跑分差距大；温度高会降频。" },
        { title: "真实体验", text: "跑分之外看：屏幕、键盘手感、重量、续航、风扇噪音、接口布局，这些决定每天的使用感受。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "跑分对比的正确姿势",
          text: "同型号笔记本之间比跑分才有意义；不同定位的机型比跑分没有参考价值。还要看“持续跑分”，跑 20 分钟后的分数比首轮更真实。",
        },
        {
          type: "heading",
          text: "一次标准测试流程",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "合上所有后台软件，插电并开启高性能模式。",
            "先跑一轮短时测试，记录峰值性能。",
            "连续跑 10-20 分钟，观察温度与频率曲线。",
            "对比同型号评测，判断散热是否正常。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[Cinebench] --> B[CPU渲染]\n  C[3DMark] --> D[游戏图形]\n  E[CrystalDiskMark] --> F[硬盘速度]\n  G[PCMark] --> H[整机办公]\n  B --> I[跑分报告]\n  D --> I\n  F --> I\n  H --> I",
          caption: "各跑分工具测什么",
        },
      ],
      analogy: "跑分像体检指标，体检好不等于生活幸福。血压（跑分）正常，但睡眠（续航）、心情（屏幕）差，日子还是不好过。",
      summary: ["跑分工具各测其职。", "同型号也要看功耗释放与散热。", "参数之外的真实体验更关键。"],
      mistakes: [
        "用手机 App 给电脑跑分。",
        "只比峰值跑分忽略降频曲线。",
        "跑分高就买，不看屏幕键盘续航。",
      ],
      thinking: ["为什么同一 GPU 在不同笔记本跑分差很多？", "安兔兔跑分为什么被懂行的人嘲笑？"],
      exercises: [
        "跑一次 Cinebench R23 多核，与同型号评测对比。",
        "用 HWiNFO 记录 30 分钟负载下的温度与频率曲线。",
      ],
      quiz: [
        singleChoice("q1", "测 SSD 顺序读写常用？", ["CrystalDiskMark", "Cinebench", "3DMark", "PCMark"], 0, "CrystalDiskMark 测存储。"),
        trueFalse("q2", "跑分高代表所有体验都好。", false, "体验是多维度的。"),
        fillBlank("q3", "笔记本因温度过热降低频率的现象叫____墙。", "功耗", "thermal/power wall。"),
        trueFalse("q4", "持续跑分比首轮短时跑分更能反映真实性能。", true, "散热与功耗墙会在持续负载中显现。"),
      ],
      tags: ["跑分", "性能", "测试"],
    }),
    quickLesson({
      slug: "peripherals",
      title: "外设",
      subtitle: "键鼠、扩展与舒适工位",
      durationMinutes: 30,
      difficulty: "入门",
      goals: ["选择适合的键鼠", "布置舒适工位", "了解显示器与外接设备"],
      overview:
        "外设决定长期使用体验：机械键盘手感好但吵，静音鼠标适合宿舍；外接显示器能明显缓解颈椎压力。预算优先给「每天接触最久」的设备。",
      points: [
        { title: "键盘", text: "薄膜安静便宜；机械键盘按轴体分（青轴吵、红轴轻、茶轴均衡）；无线优先 2.4G 接收器，延迟低。" },
        { title: "鼠标", text: "办公用静音鼠，游戏用高 DPI 电竞鼠；手腕不适可换垂直鼠标或加腕托。" },
        { title: "工位", text: "屏幕顶部与视线平齐，距离 50cm+；椅子支撑腰背；外接键盘鼠标让笔记本垫高，是宿舍护颈方案。" },
      ],
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "宿舍外设三原则",
          text: "安静优先（青轴慎入宿舍）；无线键鼠共享接收器；预算花在每天摸得最多的设备上，RGB 灯是最后考虑。",
        },
        {
          type: "heading",
          text: "10 分钟调整工位",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "把笔记本垫高，让屏幕顶部和视线平齐。",
            "外接键盘鼠标，手腕保持自然伸展。",
            "屏幕距离 50-70cm，亮度与环境匹配。",
            "椅子高度让大腿与地面平行，双脚踩实。",
          ],
        },
        {
          type: "mermaid",
          chart: "graph LR\n  A[屏幕高度] --> B[视线平齐]\n  C[外接键鼠] --> D[手腕自然]\n  E[椅高] --> F[双脚踩实]\n  G[休息] --> H[20-20-20法则]",
          caption: "舒适工位四要素",
        },
      ],
      analogy: "外设像鞋：跑鞋（电竞）很帅，但上课通勤（写论文）还是舒服的鞋重要。买一堆华丽外设不如一双合脚的。",
      summary: ["键鼠按场景选，宿舍注意噪音。", "外接显示器+垫高笔记本保护颈椎。", "预算优先投给接触最多的设备。"],
      mistakes: [
        "宿舍买青轴键盘吵到室友。",
        "笔记本平放桌面低头看屏，颈椎疼。",
        "买一堆 RGB 外设忽视人体工学。",
      ],
      thinking: ["为什么程序员偏爱机械键盘？", "显示器高度多少合适？"],
      exercises: [
        "测量你当前屏幕高度，调整到与视线平齐。",
        "根据使用场景列出你真正需要的 3 件外设。",
      ],
      quiz: [
        singleChoice("q1", "宿舍使用最合适的键盘类型是？", ["静音薄膜/静音轴", "青轴机械", "打字机", "投影键盘"], 0, "安静不打扰室友。"),
        trueFalse("q2", "外接显示器有助于改善坐姿。", true, "屏幕抬高减少低头。"),
        fillBlank("q3", "机械键盘的按键手感由____决定。", "轴体", "如红轴青轴茶轴。"),
      ],
      tags: ["外设", "键盘", "鼠标"],
    }),
  ],
};
