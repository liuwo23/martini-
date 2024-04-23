import './style.css'
import Experience from './Experience/Experience.js'

const experience = new Experience({
    targetElement: document.querySelector('.experience')
})

function sliderChange(value){
    // if(window.martiniTerrain && experience){
    //     window.martiniTerrain.updateGeometry(value)
    // }
    if(window.terrainArray && experience){
        window.terrainArray.forEach(element => {
            element.updateGeometry(value)
        });
    }
}

// const addWirframeButton = document.getElementById("addwirframe-button")
// addWirframeButton.addEventListener('click', function () {
//     if(window.terrainArray && experience){
//         const wirfameMesh = experience.scene.getObjectByName("wirfameMesh")
        
//         wirfameMesh.visible = !wirfameMesh.visible
//         if(wirfameMesh.visible){
//             this.innerHTML = "删除网格"
//         }else{
//             this.innerHTML = "添加网格"
//         }
//     }
//         // if(window.martiniTerrain && experience){
//     //     const wirfameMesh = experience.scene.getObjectByName("wirfameMesh")
        
//     //     wirfameMesh.visible = !wirfameMesh.visible
//     //     if(wirfameMesh.visible){
//     //         this.innerHTML = "删除网格"
//     //     }else{
//     //         this.innerHTML = "添加网格"
//     //     }
//     // }
// })

layui.use(function(){
    const slider = layui.slider
    // 渲染
    const sliderLayeui = slider.render({
        elem: '#error-slider',
        type: 'vertical',
        min:5,
        max:100,
        height:300,
        change: sliderChange
    })
})

