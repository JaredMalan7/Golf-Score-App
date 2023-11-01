//===== GLOBAL VARIABLE TO THE API LINK THAT CONTAINS THE GOLF COURSES ==========
let coursesURL = "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json"

//=== FUNCTION TO FETCH THE COURSES USING THE GLOBAL COURSES VARIABLE ===
async function myFetch(url) {
  const response = await fetch(url)
  return await response.json()
}
//=== FUNCTION TO FETCH THE DATA FROM EACH COURSE AVAILABLE USING THE COURSE ID===
async function fetchCourseData(courseId) {
  try {
    const courseURL = `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${courseId}.json`

    const courseData = await myFetch(courseURL)

   // ==== THIS LOGS THE ENTIRE DATA OF THE COURSE OBJECT ====
    console.log('Fetched Course Data: ', courseData)

    if (courseData.holes) {
      courseData.holes.forEach((hole, holeIndex) => {
        if (hole.teeBoxes) {
          hole.teeBoxes.forEach((teeBox, teeBoxIndex) => {
            console.log(`Tee Box ${teeBoxIndex + 1}:`)
            console.log('Tee Type:', teeBox.teeType)
            console.log('Par:', teeBox.par)
            console.log('Yards:', teeBox.yards)
            console.log('Hcp:', teeBox.hcp)
            console.log('--------')
          })
          console.log('--------')
        }
      })
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
      teeBoxHeading.className = 'w-full m-8'
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
function handleTeeBoxSelect(teeBox) {
  console.log('Selected Tee Type:', teeBox.teeType)
  if (teeBox.teeType) {
    renderPlayerOptions()
  }
}

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
    playerOption.className = 'text-center player-option bg-lime p-10 m-4 font-bold text-lg w-1/3 text-black'
    playerOption.textContent = i

    playerOption.addEventListener('click', () => {
      console.log('Selected Players:', i)
    })

    playerSelectionContainer.appendChild(playerOption)
  }
}

// renderPlayerOptions()