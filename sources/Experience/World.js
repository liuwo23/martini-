import * as THREE from 'three'
import Experience from './Experience.js'
import MartiniTerrain from './Map/terrain.js'
import {
    fetchImage,
    createImg,
    computeTiles
} from './Utils/Tiles.js'

export default class World {
    constructor(_options) {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('groupEnd', (_group) => {
            if (_group.name === 'base') {
                // this.setDummy()
                // this.setTerrain()
                // this.setAxios()
                this.setTest()
                // this.setPosition()
            }
        })
    }

    async setTest() {

        const indexArray = computeTiles(10,10);

        let terrains = [];
        let wirfameGroup = new THREE.Group();
        indexArray.forEach(async ele => {
            const imgData = await createImg(ele.tileIndex).then(res => {
                return res;
            });

            const martiniTerrain = new MartiniTerrain(imgData);

            const material = new THREE.MeshNormalMaterial({
                flatShading: true,
                side: THREE.DoubleSide,
                wireframe:false
            });

            const material2 = new THREE.MeshNormalMaterial({
                flatShading: true,
                side: THREE.DoubleSide,
                wireframe: true
            });

            martiniTerrain.martiniGeometry.rotateX(-Math.PI / 2.0);

            const mesh = new THREE.Mesh(martiniTerrain.martiniGeometry, material);

            mesh.position.x = ele.offsetX;
            mesh.position.z = ele.offsetY;

            // const wirfameMesh2 = new THREE.Mesh(martiniTerrain.martiniGeometry, material2);
            // wirfameMesh2.position.x = ele.offsetX;
            // wirfameMesh2.position.z = ele.offsetY;
            // wirfameGroup.add(wirfameMesh2);
            // wirfameMesh2.name = "wirfameMesh";
            this.scene.add(mesh);
            terrains.push(martiniTerrain);
        })
        this.scene.add(wirfameGroup);
        window.terrainArray = terrains;
    }

    setDummy() {
        this.resources.items.lennaTexture.encoding = THREE.sRGBEncoding

        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({
                map: this.resources.items.lennaTexture
            })
        )
        this.scene.add(cube)
    }

    setTerrain() {
        const tileData = this.resources.items.dem
        const martiniTerrain = new MartiniTerrain(tileData)
        window.martiniTerrain = martiniTerrain;
        const material = new THREE.MeshNormalMaterial({
            flatShading: true,
            side: THREE.DoubleSide
        });
        martiniTerrain.martiniGeometry.rotateX(-Math.PI / 2.0);

        const mesh = new THREE.Mesh(martiniTerrain.martiniGeometry, material);

        const material2 = new THREE.MeshNormalMaterial({
            flatShading: true,
            side: THREE.DoubleSide,
            wireframe: true
        });
        const wirfameMesh2 = new THREE.Mesh(martiniTerrain.martiniGeometry, material2);
        
        mesh.position.x = -0.5;
        mesh.position.z = -0.5;
                
        wirfameMesh2.position.x = -0.5;
        wirfameMesh2.position.z = -0.5;
        wirfameMesh2.name = "wirfameMesh";
        // this.scene.add(mesh, wirfameMesh2);
        this.scene.add(mesh);
    }

    setPosition() {
        const guiji = this.resources.items.guiji;
        const fq = guiji.features[0];
        console.log(fq);

        // 创建精灵对象
        const spriteMaterial = new THREE.SpriteMaterial({ map: this.resources.items.lennaTexture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(1, 1, 5); // 设置精灵的尺寸
        this.scene.add(sprite);
    }

    setAxios() {
        const axe = new THREE.AxesHelper();
        this.scene.add(axe);

        const size = 10;
        const divisions = 10;

        const gridHelper = new THREE.GridHelper( size, divisions );
        this.scene.add( gridHelper );
    }

    setMarkPoint() {
        const points = [{
            name: "古荡",
            point: [30.27011298520944, 120.12212562665809]
        }, {
            name: "将军山",
            point: [30.265516916023568, 120.11414337262977]
        }, {
            name: "老和山凉亭",
            point: [30.268111497656644, 120.1198940287577]
        }];

        const pGroup = new THREE.Group();

    }

    resize() {}

    update() {}

    destroy() {}
}