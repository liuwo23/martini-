const location = "10/906/404";
const mapboxToken = "pk.eyJ1IjoiZG9uZ2JpYW8iLCJhIjoiY2x1cHByZWQ5MjYwZTJpbGk1MTBtcDN4ZiJ9.Ye0WFlHovhYp0Oey15kapA";
const tilesUrl = `https://a.tiles.mapbox.com/v4/mapbox.terrain-rgb/${location}.png?access_token=${mapboxToken}`;

const fetchImage = (colrow)=>{
    const url =  `https://a.tiles.mapbox.com/v4/mapbox.terrain-rgb/${colrow}.png?access_token=${mapboxToken}`;

    return new Promise((resolve, reject) => {
        const image = new Image;
        image.crossOrigin = "anonymous";
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = reject;
    });
}

const createImgTerrain = (imgData) => {
    const canvas = document.createElement("canvas")
    canvas.height = imgData.height
    canvas.width = imgData.width
    const ctx = canvas.getContext("2d")
    ctx.drawImage(imgData, 0, 0)
    // 创建图片对象
    const tiledata = ctx.getImageData(0, 0, imgData.width, imgData.height).data

    const gridSize = 257;
    const tileSize = 256;
    const terrain = new Float32Array(gridSize * gridSize);
    for (let y = 0; y < tileSize; y++) {
        for (let x = 0; x < tileSize; x++) {
            const k = (y * tileSize + x) * 4;
            const r = tiledata[k + 0];
            const g = tiledata[k + 1];
            const b = tiledata[k + 2];
            terrain[y * gridSize + x] =(r * 256 * 256 + g * 256.0 + b) / 10.0 - 10000.0;
        }
    }
    for (let x = 0; x < gridSize - 1; x++) {
      terrain[gridSize * (gridSize - 1) + x] =
        terrain[gridSize * (gridSize - 2) + x];
    }

    for (let y = 0; y < gridSize; y++) {
      terrain[gridSize * y + gridSize - 1] = terrain[gridSize * y + gridSize - 2];
    }
    
    return terrain;
}

const createImg = async (tileIndex) => {
    const result =await fetchImage(tileIndex).then(res =>{
        return res;
    });

    const dem = createImgTerrain(result);
    const tileCoord = tileIndex.split("/").map(Number);

    return { dem: dem, tileCoord: tileCoord};
}

const computeTiles = (xNum,yNum)=>{
    const center = {
        top: 11,
        middle: 1703,
        bottom: 848,
        offsetX: -4.5,
        offsetY: 4.5,
        tileX: 0,
        tileY: 0
    }

    const tileInfoArray = [];

    for(let x = 0; x< xNum; x++){
        for(let y =0; y< yNum; y++){
            const info ={
                top: 11,
                middle: center.middle + x,
                bottom: center.bottom - y,
                offsetX: center.offsetX + x,
                offsetY: center.offsetY - y,
                tileX: x,
                tileY: y
            };

            tileInfoArray.push({
                tileIndex: (info.top + "/" + info.middle + "/" + info.bottom).toString(),
                offsetX: info.offsetX,
                offsetY: info.offsetY
            })
        }
    }

    console.log("tileInfoArray:", tileInfoArray);
    return tileInfoArray;
}

export { fetchImage, createImgTerrain, createImg,computeTiles};