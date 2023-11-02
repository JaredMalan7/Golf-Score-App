
//===== GLOBAL VARIABLE TO THE API LINK THAT CONTAINS THE GOLF COURSES ==========
let coursesURL = "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json"

//=== FUNCTION TO FETCH THE COURSES USING THE GLOBAL COURSES VARIABLE ===
async function myFetch(url) {
  const response = await fetch(url)
  return await response.json()
}
//=== FUNCTION TO FETCH THE DATA FROM EACH COURSE AVAILABLE USING THE COURSE ID===
let courseData = []
let teeBoxData = []

async function fetchCourseData(courseId) {
  try {
    const courseURL = `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${courseId}.json`

    const fetchedCourseData = await myFetch(courseURL)

    // ==== THIS LOGS THE ENTIRE DATA OF THE COURSE OBJECT ====
    console.log('Fetched Course Data: ', fetchedCourseData)

    // Corrected the assignment of courseData
    courseData = fetchedCourseData

    if (courseData.holes) {
      courseData.holes.forEach((hole) => {
        if (hole.teeBoxes) {
          hole.teeBoxes.forEach((teeBox) => {
            const teeBoxInfo = {
              teeBoxId: teeBox.courseHoleTeeBoxId,
              teeType: teeBox.teeType,
              par: teeBox.par,
              yards: teeBox.yards,
              hcp: teeBox.hcp
            }
            teeBoxData.push(teeBoxInfo)
            console.log('Tee Box Info:', teeBoxInfo)
          })
        }
      })
    } else {
      console.log('No holes found for the selected course')
    }
  } catch (error) {
    console.error('Error fetching course data: ', error)
  }
}


//=== FUNCTION TO RENDER THE COURSES AND CREATE THE COURSE SELECTION ===
async function populateCourseSelect() {
  try {
    const courses = await myFetch(coursesURL)
    const courseContainer = document.getElementById('courses-container')
    const courseOptionsDiv = document.getElementById('course-options')
    
    // Clear an existing options
    courseOptionsDiv.innerHTML = ''


    // COURSE HEADING
    const courseHeading = document.createElement('h1')
    courseHeading.textContent = 'Choose Your Course'
    courseHeading.className = 'w-full mt-7 mb-8 font-bold'
    courseContainer.appendChild(courseHeading)  

    // Create a default option
    courses.forEach(async (course) => {
      try {
        let _course = await myFetch(course.url)
        // logs all the details of each course
        // console.log("Course Details:", _course)

        const courseDiv = document.createElement('div')
        courseDiv.className = "overflow-hidden course-option m-5 text-center text-black grow md:h-full"

        //===EVENT LISTENER TO LOG THE SELECTED COURSE=====
        courseDiv.addEventListener('click', () => {
          console.log("Selected golf course:", _course.id)
          fetchCourseData(_course.id)

          renderTeeBoxes(_course.id)
        })

        const thumbnailImg = document.createElement('img')
        thumbnailImg.setAttribute('src', _course.thumbnail)
        thumbnailImg.alt = 'Thumbnail'
        thumbnailImg.className = "thumbnail object-cover object-center max-h-[125px] min-w-[256px]"
        courseDiv.appendChild(thumbnailImg)

        const courseName = document.createElement('div')
        courseName.textContent = _course.name
        courseName.className = 'courseName p-3 bg-lime max-w-[256px]'
        courseDiv.appendChild(courseName)

        courseOptionsDiv.appendChild(courseDiv)
      } catch (error) {
        console.error('Error fetching course data:', error)
      }
    })

    // This console logs the expected courses in the console
    console.log(courses)
  } catch (error) {
    console.error('Error fetching and populating golf courses:', error)
  }
}

function handleCourseSelect(courseId) {
  if (courseId) {   
    console.log('selected golf course: ', courseId)
  }
}

window.addEventListener('load', populateCourseSelect)

// ==== FUNCTION TO RENDER THE TEEBOXES =====
async function renderTeeBoxes(courseId) {
  try {
    const courseURL = `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${courseId}.json`
    const courseData = await myFetch(courseURL)

    if (courseData.holes && courseData.holes.length > 0) {
      const firstHole = courseData.holes[0]

      const teeBoxContainer = document.getElementById('teebox-container')
      teeBoxContainer.innerHTML = ''

      // TEE BOX HEADING
      const teeBoxHeading = document.createElement('h1')
      teeBoxHeading.textContent = 'Choose Your Tee Box'
      teeBoxHeading.className = 'w-full m-8 font-bold'
      teeBoxContainer.appendChild(teeBoxHeading)


      if (firstHole.teeBoxes && firstHole.teeBoxes.length > 0) {
        firstHole.teeBoxes.forEach((teeBox, teeBoxIndex) => {
          // Added this condition here so that the Auto Change location teeType is not displayed
          if (teeBox.teeType !== "auto change location") {
            
            const teeBoxDiv = document.createElement('div')
            teeBoxDiv.className = 'teebox-option bg-lime m-4 w-2/6 p-5 font-bold text-black'
            teeBoxDiv.textContent = teeBox.teeType
            teeBoxContainer.appendChild(teeBoxDiv)


            // Capitalize the first letter of teeType
            const capitalizedTeeType = teeBox.teeType.charAt(0).toUpperCase() + teeBox.teeType.slice(1)
            teeBoxDiv.textContent = capitalizedTeeType


            // Add an event listener to each teeBox
            teeBoxDiv.addEventListener('click', () => {
              console.log('Selected Tee Box:', capitalizedTeeType)
              renderPlayerOptions()
            })
            
            teeBoxContainer.appendChild(teeBoxDiv)
          }
        })
      }
    } else {
      console.log('No holes found for the selected course.')
    }
  } catch (error) {
    console.error('Error rendering teeBoxes:', error)
  }
}


//==== FUNCTION TO CALL & RENDER THE PLAYER OPTIONS AFTER THE TEEBOX WAS SELECTED ====
let selectedTeeBox = null

function handleTeeBoxSelect(teeBox) {
  console.log('Selected Tee Type:', teeBox.teeType)
  if (teeBox.teeType) {
    renderScorecard(courseData, teeBox.teeType)
  }
}


// CLASS PLAYER USED TO GENERATE THE PLAYERS
let nextPlayerId = 1

function getNextId(){
  return nextPlayerId++
}

class Player {
  constructor(name, id = getNextId(), scores = []) {
    this.name = name;
    this.id = id;
    this.scores = scores;
  }
}

// SETS A GLOBAL VARIABLE FOR THE NUMBER OF PLAYERS, INITIALLY AT 0
// UNTIL THE NUMBER OF PLAYERS IS SELECTED
let numberOfPlayers = 0

let players = []

function renderPlayerOptions() {
  const playerSelectionContainer = document.getElementById('player-selection-container') // Use the correct ID
  playerSelectionContainer.innerHTML = '' // Clear existing options


  // COURSE HEADING
  const playerSelectHeading = document.createElement('h1')
  playerSelectHeading.textContent = 'Choose Your Course'
  playerSelectHeading.className = 'w-full mt-7 mb-8 font-bold'
  playerSelectionContainer.appendChild(playerSelectHeading)    


  for (let i = 1; i <= 4; i++) {
    const playerOption = document.createElement('div')
    playerOption.className = 'player-option text-center bg-lime p-10 m-4 font-bold text-lg w-1/3 text-black'
    playerOption.textContent = i

    playerOption.addEventListener('click', () => {
      numberOfPlayers = parseInt(playerOption.textContent) // this updates the global variable
      console.log('Selected Players:', numberOfPlayers)
      generatePlayers()
    })

    playerSelectionContainer.appendChild(playerOption)
  }
  
}
// renderPlayerOptions()

function generatePlayers() {
  players = [] // Clear the existing players

  for (let i = 1; i <= numberOfPlayers; i++) {
    const playerName = `Player ${i}`
    const player = new Player(playerName)
    players.push(player)
  }

  console.log(`Generated ${numberOfPlayers} players:`)
  console.log(players)

  renderScorecardTable()
}

//FUNCTION THAT BUILDS THE SCORECARD

function renderScorecardTable() {
  const scorecardContainer = document.getElementById('scorecard-container')
  scorecardContainer.innerHTML = '' // Clear any existing content

  const table = document.createElement('table')
  table.classList.add('table', 'w-full')
  table.id = 'frontHole'

  // Create the Hole row
  const holeRow = document.createElement('tr')
  holeRow.classList.add('text-sm')

  const holeHeader = document.createElement('th')
  holeHeader.classList.add('p-2', 'font-normal')
  holeHeader.textContent = 'Hole'
  holeRow.appendChild(holeHeader)

  for (let i = 1; i <= 18; i++) {
    const holeColumn = document.createElement('th')
    holeColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
    holeColumn.textContent = i
    holeRow.appendChild(holeColumn)
  }

  // Add the "Total" column
  const totalColumn = document.createElement('th')
  totalColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
  totalColumn.textContent = 'Total'
  holeRow.appendChild(totalColumn)

  table.appendChild(holeRow)

  // Create the Yardage row
  const yardageRow = document.createElement('tr')
  yardageRow.classList.add('text-sm', 'bg-charcoal')

  const yardageHeader = document.createElement('th')
  yardageHeader.classList.add('p-2', 'font-normal', 'bg-charcoal') 
  yardageHeader.textContent = 'Yardage'
  yardageRow.appendChild(yardageHeader)

  for (let i = 1; i <= 18; i++) {
    const yardageColumn = document.createElement('th')
    yardageColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
    yardageRow.appendChild(yardageColumn)
  }

   // Add an empty column for the "Total" row
   const emptyTotalyardageColumn = document.createElement('th')
   emptyTotalyardageColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
   yardageRow.appendChild(emptyTotalyardageColumn)

  table.appendChild(yardageRow)

  // Create the Par row with the same number of columns as Yardage
  const parRow = document.createElement('tr')
  parRow.classList.add('text-sm')

  const parHeader = document.createElement('th')
  parHeader.classList.add('p-2', 'font-normal')
  parHeader.textContent = 'Par'
  parRow.appendChild(parHeader)

  for (let i = 1; i <= 18; i++) {
    const parColumn = document.createElement('th')
    parColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
    parRow.appendChild(parColumn)
  }

  // Add an empty column for the "Total" row
  const emptyTotalParColumn = document.createElement('th')
  emptyTotalParColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
  parRow.appendChild(emptyTotalParColumn)

  table.appendChild(parRow)

  // Create the Handicap row with the same number of columns as Yardage
  const handicapRow = document.createElement('tr')
  handicapRow.classList.add('text-sm', 'bg-charcoal')

  const handicapHeader = document.createElement('th')
  handicapHeader.classList.add('p-2', 'font-normal')
  handicapHeader.textContent = 'Handicap'
  handicapRow.appendChild(handicapHeader)

  for (let i = 1; i <= 18; i++) {
    const handicapColumn = document.createElement('th')
    handicapColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
    handicapRow.appendChild(handicapColumn)
  }

  // Add an empty column for the "Total" row
  const emptyTotalHandicapColumn = document.createElement('th')
  emptyTotalHandicapColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
  handicapRow.appendChild(emptyTotalHandicapColumn)

  table.appendChild(handicapRow)

  // Create player rows based on the number of objects in the players array
players.forEach((player) => {
  const playerRow = document.createElement('tr')
  playerRow.classList.add('text-sm')
  playerRow.id = `player${player.id}`

  if (player.id === 2 || player.id === 4) {
    playerRow.classList.add('bg-charcoal');
  }

  const playerHeader = document.createElement('th')
  playerHeader.classList.add('p-2', 'font-normal')
  playerHeader.textContent = player.name
  playerRow.appendChild(playerHeader)

  for (let j = 1; j <= 18; j++) {
    const playerColumn = document.createElement('th')
    playerColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
    playerRow.appendChild(playerColumn)
  }

  // Add an empty column for the "Total" row
  const emptyTotalPlayerColumn = document.createElement('th')
  emptyTotalPlayerColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
  playerRow.appendChild(emptyTotalPlayerColumn)

  table.appendChild(playerRow)
})

  scorecardContainer.appendChild(table)
}

// Call the function to render the scorecard table


renderScorecardTable()