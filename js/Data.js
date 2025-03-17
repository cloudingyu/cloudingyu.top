/**
 * 地图类 - 管理三维地图数据
 */
class Map {
    /**
     * 创建一个新的地图实例
     * @param {number} size - 地图的尺寸 (size × size × size)
     */
    constructor(size = 4) {
        this.Size = size;
        this.data = this._createEmptyMap(size);
        this._initializeDefaultData();
    }

    /**
     * 创建一个空的三维地图数组
     * @private
     * @param {number} size - 地图尺寸
     * @returns {Array} 三维数组
     */
    _createEmptyMap(size) {
        const map = new Array(size);
        
        for (let x = 0; x < size; x++) {
            map[x] = new Array(size);
            for (let y = 0; y < size; y++) {
                map[x][y] = new Array(size);
                for (let z = 0; z < size; z++) {
                    map[x][y][z] = 0;
                }
            }
        }
        
        return map;
    }

    /**
     * 初始化默认的地图数据
     * @private
     */
    _initializeDefaultData() {
        

    }

    /**
     * 获取特定位置的值
     * @param {number} x - X 坐标
     * @param {number} y - Y 坐标
     * @param {number} z - Z 坐标
     * @returns {number|null} 该位置的值，如果越界则返回 null
     */
    getValue(x, y, z) {
        if (this._isValidCoordinate(x, y, z)) {
            return this.data[x][y][z];
        }
        return null; // 超出范围
    }

    /**
     * 设置特定位置的值
     * @param {number} x - X 坐标
     * @param {number} y - Y 坐标
     * @param {number} z - Z 坐标
     * @param {number} value - 要设置的值
     * @returns {boolean} 是否设置成功
     */
    setValue(x, y, z, value) {
        if (this._isValidCoordinate(x, y, z)) {
            this.data[x][y][z] = value;
            return true;
        }
        return false; // 超出范围
    }

    /**
     * 重置地图数据为默认状态
     */
    reset() {
        this.data = this._createEmptyMap(this.Size);
        this._initializeDefaultData();
    }

    /**
     * 检查坐标是否有效
     * @private
     * @param {number} x - X 坐标
     * @param {number} y - Y 坐标
     * @param {number} z - Z 坐标
     * @returns {boolean} 坐标是否有效
     */
    _isValidCoordinate(x, y, z) {
        return x >= 0 && x < this.Size && 
               y >= 0 && y < this.Size && 
               z >= 0 && z < this.Size;
    }
    
    /**
     * 获取地图大小
     * @returns {number} 地图大小
     */
    getSize() {
        return this.Size;
    }
    
    /**
     * 调整地图大小（会重置所有数据）
     * @param {number} newSize - 新的地图大小
     */
    resize(newSize) {
        if (newSize > 0) {
            this.Size = newSize;
            this.data = this._createEmptyMap(newSize);
            // 可以选择在这里重新初始化数据或保持空白
        }
    }
}

/**
 * 全局地图数据管理模块
 */
const MapData = (function() {
    // 创建默认的 10×10×10 地图实例
    const gameMap = new Map(10);
    
    // 返回公开的方法和属性
    return {
        // 获取地图实例
        map: gameMap,
        
        // 便捷方法 - 获取特定位置的值
        getMapValue: function(x, y, z) {
            return gameMap.getValue(x, y, z);
        },
        
        // 便捷方法 - 设置特定位置的值
        setMapValue: function(x, y, z, value) {
            return gameMap.setValue(x, y, z, value);
        },
        
        // 便捷方法 - 重置地图
        resetMap: function() {
            gameMap.reset();
        },
        
        // 获取地图大小
        getMapSize: function() {
            return gameMap.getSize();
        }
    };
})();