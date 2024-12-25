<template>
  <div class="graficgant">
    <canvas id="chart" ref="chartCanvas"></canvas> 
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default ({
  name: 'BtnDate',
  setup () {
    const chartCanvas = ref()
    const STEP_HEIGHT = 7
    const PADDING = 10
    const WIDTH = 659
    const HEIGHT = 32 * STEP_HEIGHT + (PADDING * 2) + 84
    const DPI_WIDTH = WIDTH * 2
    const DPI_HEIGHT = HEIGHT * 2
    const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2
    const VIEW_WIDTH = DPI_WIDTH - PADDING * 2

    function chart (canvas, data) {
      const ctx = canvas.getContext('2d')
      canvas.style.width = WIDTH + 'px'
      canvas.style.height = HEIGHT + 'px'
      canvas.width = DPI_WIDTH
      canvas.height = VIEW_HEIGHT
      
      const [xMin, xMax] = computeBoundaries(data)

      const stepX = VIEW_WIDTH / xMax
      const step = DPI_WIDTH / xMax 
      const xRatio = VIEW_WIDTH / stepX / (xMax - xMin)

      ctx.beginPath()
      ctx.strokeStyle = '#bbb'
      ctx.font = 'normal 20px sans-serif'
      
      for (let i = 0; i <= xMax; i++) {
        const x = step * i
        ctx.fillText(i, x - 28, 25)
        ctx.moveTo(x, 0)
        ctx.lineTo(x, VIEW_HEIGHT)
      }
      for (let i = 0; i <= xMax; i++) {
        const x = step * i
        ctx.fillText(i, x - 28, 25)
        ctx.moveTo(x, 0)
        ctx.lineTo(x, VIEW_HEIGHT)
      }
      ctx.stroke()
      ctx.closePath()


      ctx.beginPath()
      let i = 1
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 18
      ctx.lineCap = 'round'
      
      // console.log('ratio ' + xMin)
      
      for (const [x1, x2] of data) {
        let result = x1 + x2
        let y = i * 84
        
        ctx.moveTo(x1 * stepX * xRatio + PADDING + PADDING + 0, y);
        ctx.lineTo(result * stepX * xRatio - PADDING, y)
        i++
      }
      ctx.stroke()
      ctx.closePath()
    }

    function computeBoundaries(data) {
      let min
      let max

      let minX1
      let maxX1
      let minX2
      let maxX2

      for (const [x1, x2] of data) {  
        if (typeof minX1 !== 'number') minX1 = x1
        if (typeof maxX1 !== 'number') maxX1 = x1
        if (minX1 > x1) minX1 = x1
        if (maxX1 < x1) maxX1 = x1

        if (typeof minX2 !== 'number') minX2 = x2
        if (typeof maxX2 !== 'number') maxX2 = x2
        if (minX2 > x2) minX2 = x2
        if (maxX2 < x2) maxX2 = x2
      }

      if (minX1 < minX2) {
        min = minX1
      } else {
        min = minX2
      }
      max = maxX1 + maxX2
      
      return [min, max]
    }

    onMounted(() => {
      chart(chartCanvas.value, [
        [1,4],
        [0,8],
        [0,6],
        [2,30],
        [0,4],
        [0,12],
        [0,4],
      ])
    })

    return {
      date: ref('Выберите дату'),
      chartCanvas,
      chart,
      STEP_HEIGHT,
      PADDING,
      WIDTH,
      HEIGHT,
      DPI_WIDTH,
      DPI_HEIGHT,
      VIEW_HEIGHT,
      VIEW_WIDTH,
      computeBoundaries
    }
    
  }
})
</script>

<style scoped>
  canvas {
    border: 1px solid black;
  }
</style>
