/**
 * 主脚本文件 - 展示如何使用Data.js中的数据
 */

// 等待文档加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 在此处可以安全地访问 GameData 对象及其数据
    console.log("加载 3D 地图数据:");
    
    // 直接访问整个地图
    console.log("完整地图数据:", GameData.map);
    
    // 使用访问器方法获取特定位置的值
    console.log("位置[0][0][0]的值:", GameData.getMapValue(0, 0, 0));
    console.log("位置[1][2][3]的值:", GameData.getMapValue(1, 2, 3));
    console.log("位置[4][5][6]的值:", GameData.getMapValue(4, 5, 6));
    
    // 使用访问器方法设置值
    GameData.setMapValue(5, 5, 5, 25);
    console.log("位置[5][5][5]已设置为:", GameData.getMapValue(5, 5, 5));
    
    // 示例：在页面上显示数据
    displayMapDataExample();
});