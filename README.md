# cloudingyu.top
这是一个康威生命游戏的网页实现。该项目包含一个简单的用户界面，允许用户与游戏进行交互并观察细胞的演变。

## 文件结构
- `index.html`：网页的入口点，包含游戏的基本结构和引用的样式和脚本文件。
- `css/styles.css`：包含网页的样式定义，用于设置游戏界面的外观，包括网格、颜色和布局。
- `js/game.js`：包含康威生命游戏的核心逻辑，包括初始化游戏、更新状态和渲染网格的函数。

## 如何运行游戏
1. 将项目克隆到本地。
2. 在浏览器中打开 `index.html` 文件。
3. 使用界面上的按钮开始或停止游戏。

## 游戏规则
- 每个细胞可以是“活”或“死”。
- 根据以下规则更新细胞状态：
  - 如果一个活细胞周围有两个或三个活邻居，它将继续存活。
  - 如果一个死细胞周围有正好三个活邻居，它将复活。
  - 在其他情况下，细胞将死亡或保持死亡状态。

## 操作说明
- 点击网格单元格以切换其状态（活/死）。
- 使用“开始”按钮开始游戏循环。
- 使用“停止”按钮停止游戏循环。