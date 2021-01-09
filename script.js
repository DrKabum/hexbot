const hexBox = document.getElementById("tile-box")
const refreshButton = document.getElementById("refresh-tiling")
const loader = document.getElementById('loader')
let codeCount = 25
const form = document.getElementById('option-form')

//Listeners
refreshButton.addEventListener('click', () => {generatePaint()})
form.addEventListener('change', e => { codeCount = parseInt(e.target.value, 10)})

//Loading spinner
function toggleLoading() {
  loader.classList.toggle('hidden')
  refreshButton.classList.toggle('hidden')
}

//Generate a batch of tiles
async function getTilesHtml(codeCount) {
  const promise = await fetch("https://api.noopschallenge.com/hexbot?count=" + codeCount)
  const { colors } = await promise.json()
  
  let tilesHtml = colors.map(color => {
    return `
    <div class="tile" style="background:${color.value}"></div>
    `
    }).join('')
  
  return tilesHtml
}

//Generate whole painting
async function generatePaint() {
  toggleLoading()
  hexBox.innerHTML = ""
  let remainingCodes = codeCount
  let paintHtml = ""
  
  //Generate tilesDivs 1000 by 1000 as per API limitation
  while(remainingCodes > 1000) {
    paintHtml += await getTilesHtml(1000)
    remainingCodes -= 1000
  }
  //Generate what remains
  paintHtml += await getTilesHtml(remainingCodes)
  
  //Generate tiles in the document
  hexBox.innerHTML = paintHtml
  //and Give them appropriate size
  const pixels = Array.from(document.getElementsByClassName("tile"))
  switch(codeCount) {
    case 10000:
      pixels.forEach(pixel => pixel.classList.add('fivepxl'))
      break;
    case 2500:
      pixels.forEach(pixel => pixel.classList.add('tenpxl'))
      break;
    case 400:
      pixels.forEach(pixel => pixel.classList.add('twentyfivepxl'))
      break;
    case 25:
      pixels.forEach(pixel => pixel.classList.add('onehundredpxl'))
      break;
  }
  toggleLoading()
}

//inital painting
generatePaint()