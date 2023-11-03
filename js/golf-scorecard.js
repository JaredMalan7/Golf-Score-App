
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
              handleTeeBoxSelect(teeBox)
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
function handleTeeBoxSelect(teeBox) {
  console.log('Selected Tee Type:', teeBox.teeType)
  selectedTeeBox = teeBox.teeType // Update selectedTeeBox
  console.log('Updated selectedTeeBox:', selectedTeeBox) // Log the updated value
  if (teeBox.teeType) {
    console.log('About to call renderScorecardTable with selectedTeeBox:', selectedTeeBox)
    renderScorecardTable(); // Render the scorecard with the updated selectedTeeBox
  } else {
    console.log('teeBox.teeType is not available.')
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

// RENDERS THE 4 SQUARE BUTTON FOR THE USER TO SELECT THE NUMBER OF PLAYERS
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

// GENERATES PLAYER OBJECTS FOR THE SCORECARD TABLE
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
  //========================================================================================
  const scorecardContainer = document.getElementById('scorecard-container')
  scorecardContainer.innerHTML = '' // Clear any existing content

  const frontTable = document.createElement('table')
  frontTable.classList.add('table', 'w-full')
  frontTable.id = 'frontHole'

  if (courseData && courseData.holes && courseData.holes.length >= 9) {
    // Create the Hole row
    const holeRow = document.createElement('tr')
    holeRow.classList.add('text-sm')

    const holeHeader = document.createElement('th')
    holeHeader.classList.add('p-2', 'font-normal')
    holeHeader.textContent = 'Hole'
    holeRow.appendChild(holeHeader)

    for (let i = 0; i < 9; i++) {
      const holeColumn = document.createElement('th')
      holeColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
      holeColumn.textContent = i + 1 // Display numbers 1 through 9
      holeRow.appendChild(holeColumn)
    }

    // Add the "Total" column
    const totalColumn = document.createElement('th')
    totalColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
    totalColumn.textContent = 'Out' // Display "Total"
    holeRow.appendChild(totalColumn)

    frontTable.appendChild(holeRow)
  } else {
    console.log('Course data does not have enough holes for the front 9.')
    return
  }
  //========================================================================================
  // CREATES THE YARDAGE ROW
  let totalYardage = 0
  for (let i = 0; i < 9; i++) {
    const hole = courseData.holes[i]
    const teeBox = hole.teeBoxes.find((box) => box.teeType === selectedTeeBox)
  
    if (teeBox) {
      const yardage = parseInt(teeBox.yards)
      totalYardage += yardage
    }
  }
  
  const yardageRow = document.createElement('tr')
  yardageRow.classList.add('text-sm', 'bg-charcoal')
  
  const yardageHeader = document.createElement('th')
  yardageHeader.classList.add('p-2', 'font-normal', 'bg-charcoal')
  yardageHeader.textContent = 'Yardage'
  yardageRow.appendChild(yardageHeader)
  
  for (let i = 0; i < 9; i++) {
    const hole = courseData.holes[i]
    const teeBox = hole.teeBoxes.find((box) => box.teeType === selectedTeeBox)
  
    if (teeBox) {
      const yardageColumn = document.createElement('th')
      yardageColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
      yardageColumn.textContent = teeBox.yards
      yardageRow.appendChild(yardageColumn)
    } else {
      const emptyYardageColumn = document.createElement('th')
      emptyYardageColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
      yardageRow.appendChild(emptyYardageColumn)
    }
  
  }
  
  const totalYardageColumn = document.createElement('th')
  totalYardageColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
  totalYardageColumn.textContent = totalYardage
  yardageRow.appendChild(totalYardageColumn)
  
  frontTable.appendChild(yardageRow)
  
//========================================================================================
// CREATES THE PAR ROW WITH THE SAME NUMBER OF COLUMNS AS YARDAGE
let totalPar = 0
for (let i = 0; i < 9; i++) {
  const hole = courseData.holes[i]
  const teeBox = hole.teeBoxes.find((box) => box.teeType === selectedTeeBox)

  if (teeBox) {
    const par = parseInt(teeBox.par)
    totalPar += par
  }
}

const parRow = document.createElement('tr')
parRow.classList.add('text-sm')

const parHeader = document.createElement('th')
parHeader.classList.add('p-2', 'font-normal')
parHeader.textContent = 'Par'
parRow.appendChild(parHeader)

for (let i = 0; i < 9; i++) {
  const hole = courseData.holes[i]
  const teeBox = hole.teeBoxes.find((box) => box.teeType === selectedTeeBox)

  if (teeBox) {
    const parColumn = document.createElement('th')
    parColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
    parColumn.textContent = teeBox.par
    parRow.appendChild(parColumn)
  } else {
    const emptyParColumn = document.createElement('th')
    emptyParColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
    parRow.appendChild(emptyParColumn)
  }
}

const totalParColumn = document.createElement('th')
totalParColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
totalParColumn.textContent = totalPar
parRow.appendChild(totalParColumn)

frontTable.appendChild(parRow)

//========================================================================================
// CREATES THE HANDICAP ROW WITH THE SAME NUMBER OF COLUMNS AS YARDAGE
let totalHandicap = 0
for (let i = 0; i < 9; i++) {
  const hole = courseData.holes[i]
  const teeBox = hole.teeBoxes.find((box) => box.teeType === selectedTeeBox)

  if (teeBox) {
    const handicap = parseInt(teeBox.hcp)
    totalHandicap += handicap
  }
}

const handicapRow = document.createElement('tr')
handicapRow.classList.add('text-sm', 'bg-charcoal')

const handicapHeader = document.createElement('th')
handicapHeader.classList.add('p-2', 'font-normal')
handicapHeader.textContent = 'Handicap'
handicapRow.appendChild(handicapHeader)

for (let i = 0; i < 9; i++) {
  const hole = courseData.holes[i]
  const teeBox = hole.teeBoxes.find((box) => box.teeType === selectedTeeBox)

  if (teeBox) {
    const handicapColumn = document.createElement('th')
    handicapColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
    handicapColumn.textContent = teeBox.hcp
    handicapRow.appendChild(handicapColumn)
  } else {
    const emptyHandicapColumn = document.createElement('th')
    emptyHandicapColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
    handicapRow.appendChild(emptyHandicapColumn)
  }
}

const totalHandicapColumn = document.createElement('th')
totalHandicapColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
totalHandicapColumn.textContent = totalHandicap
handicapRow.appendChild(totalHandicapColumn)

frontTable.appendChild(handicapRow)


//========================================================================================
// CREATES PLAYER ROWS BASED ON THE NUMBER OF OBJECTS IN TEH PLAEYRS ARRAY
players.forEach((player, playerIndex) => {
  const playerRow = document.createElement('tr')
  playerRow.classList.add('text-sm')

  if (players.indexOf(player) % 2 != 0) {
    playerRow.classList.add('bg-charcoal')
  }

  const playerHeader = document.createElement('th')
  playerHeader.classList.add('p-2', 'font-normal')

  // Create a div element for player name, make it content-editable
  const playerNameDiv = document.createElement('div')
  playerNameDiv.classList.add('player-name')
  playerNameDiv.setAttribute('contenteditable', 'true')
  playerNameDiv.textContent = player.name

  // Add an input event listener to capture changes in player name
  playerNameDiv.addEventListener('input', (event) => {
    const newName = event.target.textContent
    // Call the function to handle player name editing
    handlePlayerNameEdit(player, playerIndex, newName)
  })

  // Add a keypress event listener to submit the new name on Enter key press
  playerNameDiv.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.target.blur(); // Remove focus (content-editable) to trigger the input event
    }
  })

  playerHeader.appendChild(playerNameDiv)
  playerRow.appendChild(playerHeader)

  // This creates the score, makes it editable, and pushes the data to the scores array of the player object
  for (let i = 0; i < 9; i++) {
    const playerColumn = document.createElement('th')
    playerColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
    playerColumn.textContent = player.scores[i] // Display the score
    playerColumn.setAttribute('contentEditable', 'true') // Make it editable
    playerColumn.addEventListener('input', (event) => {
      const inputText = event.target.textContent;
      if (!/^\d+$/.test(inputText)) {
        // If the input is not a number, clear it
        event.target.textContent = '';
      } else {
        const newScore = parseInt(inputText);
        player.scores[i] = newScore; // Update the player's score
      }
    });
    playerColumn.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        playerColumn.blur(); // Remove focus to save the change
      }
    });
    playerRow.appendChild(playerColumn);
  }
  

  // Add an empty column for the "Total" row
  const emptyTotalPlayerColumn = document.createElement('th')
  emptyTotalPlayerColumn.classList.add('p-2', 'font-normal', 'border-l', 'border-l-accents')
  // Calculate and add the player's total score here
  emptyTotalPlayerColumn.textContent = player.scores.slice(0, 9).reduce((total, score) => total + score, 0)
  playerRow.appendChild(emptyTotalPlayerColumn)

  frontTable.appendChild(playerRow)
})

scorecardContainer.appendChild(frontTable)
}
// Call the function to render the scorecard tables
//renderScorecardTable()

// Function to handle player name editing
function handlePlayerNameEdit(player, playerIndex, newName) {
  // Update the player name in your data structure (e.g., players array)
  players[playerIndex].name = newName
}

