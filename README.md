# Hexa Realm
一个基于二维与三维间视错觉的解谜游戏。
人眼可以将涂有三种颜色的二维图形，

## 项目结构

```hexarealm
hexarealm/
├── index.html         # 主HTML页面
├── README.md          # 项目文档
├── css/               # 样式文件目录
│   └── style.css      # 主样式表
├── gamedata/          # 游戏数据文件
│   └── map.in         # 地图数据文件
├── img/               # 图像资源目录
│   └── favicon/       # 网站图标资源
└── js/                # JavaScript文件目录
    ├── Data.js        # 数据管理模块
    ├── Game.js        # 游戏主逻辑
    ├── Hexagon.js     # 六边形渲染逻辑
    └── Scripts.js     # 主脚本文件