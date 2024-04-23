import * as THREE from 'three'
import EventEmitter from './Utils/EventEmitter.js'
import Loader from './Utils/Loader.js'

export default class Resources extends EventEmitter
{
    constructor(_assets)
    {
        super()

        // Items (will contain every resources)
        this.items = {}

        // Loader
        this.loader = new Loader({ renderer: this.renderer })

        this.groups = {}
        this.groups.assets = [..._assets]
        this.groups.loaded = []
        this.groups.current = null
        this.loadNextGroup()

        this.loader.on('fileEnd', (_resource, _data) =>
        {
            let data = _data

            // Convert to texture
            if(_resource.type === 'texture')
            {
                if(!(data instanceof THREE.Texture))
                {
                    data = new THREE.Texture(_data)
                }
                data.needsUpdate = true
            }

            
            if(_resource.type === 'Dem'){
                if(!(data instanceof THREE.Texture)){
                    let canvas = document.createElement("canvas")
                    canvas.height = _data.height
                    canvas.width = _data.width
                    const ctx = canvas.getContext("2d")
                    ctx.drawImage(_data, 0, 0)
                    // 创建图片对象
                    const tiledata = ctx.getImageData(0, 0, _data.width, _data.height).data

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

                    data = {dem:terrain,width:_data.width,height:_data.height,tileCoord :[11,1707,843]};
                }
            }

            if(_resource.type === 'Json'){
                data = JSON.parse(_data)
            }

            this.items[_resource.name] = data


            // Progress and event
            this.groups.current.loaded++
            this.trigger('progress', [this.groups.current, _resource, data])
        })

        // Loader all end event
        this.loader.on('end', () =>
        {
            this.groups.loaded.push(this.groups.current)
            
            // Trigger
            this.trigger('groupEnd', [this.groups.current])

            if(this.groups.assets.length > 0)
            {
                this.loadNextGroup()
            }
            else
            {
                this.trigger('end')
            }
        })
    }

    loadNextGroup()
    {
        this.groups.current = this.groups.assets.shift()
        this.groups.current.toLoad = this.groups.current.items.length
        this.groups.current.loaded = 0

        this.loader.load(this.groups.current.items)
    }

    createInstancedMeshes(_children, _groups)
    {
        // Groups
        const groups = []

        for(const _group of _groups)
        {
            groups.push({
                name: _group.name,
                regex: _group.regex,
                meshesGroups: [],
                instancedMeshes: []
            })
        }

        // Result
        const result = {}

        for(const _group of groups)
        {
            result[_group.name] = _group.instancedMeshes
        }

        return result
    }

    destroy()
    {
        for(const _itemKey in this.items)
        {
            const item = this.items[_itemKey]
            if(item instanceof THREE.Texture)
            {
                item.dispose()
            }
        }
    }
}
