//======= CLASS TO CREATE PLAYERS ========
class Player {
    constructor(name, id = getNextId(), scores = []) {
      this.name = name;
      this.id = id;
      this.scores = scores;
    }
  }

let players = []

let coursesURL = "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json"

function createPlayer(name){
  let player = new Player(name)
  players.push(player)
  return player
}
//======== API INTEGRATION FOR THE COURSES ===========

async function getAvailableGolfCourses(url) {
    const response = await fetch(url);
    return await response.json();
  }

async function handleCourseSelectChange(){
  let courseId = document.getElementById('course-select').value

  if(courseId){

    try {
      let teeBoxes = await getGolfCourseDetails(courseId);
      let teeBoxSelect = document.getElementById('tee-box-select')

      teeBoxSelect.innerHTML = ''

      let teeBoxSelectHtml = ''
      teeBoxes.forEach((teeBox, index) => {
        teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${teeBox.TotalYards} yards</option>`
      })

      teeBoxSelect.innerHTML += teeBoxSelectHtml

    } catch (error){
      console.error('Error fetching tee boxes:', error)
    }
  }else{
    document.getElementById('tee-box-select').innerHTML = ''
  }
}


async function getGolfCourseDetails(golfCourseId) {
    const response = await fetch(
          `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`,

      );
      // console.log();
      return await response.json();
  }

  // This is to add an event listener to the course-select element
document.getElementById('course-options').addEventListener('click', handleCourseSelect)

async function populateCourseSelect(){
    try {
      let courses = await getAvailableGolfCourses(coursesURL)
      let courseOptionsDiv = document.getElementById('course-options')

      // Clear an existing options
      courseOptionsDiv.innerHTML = ''
      
      // Create a default option
      courses.forEach(async(course) =>{
      let _course = await getAvailableGolfCourses(course.url)
    
      const courseDiv = document.createElement('div')
      courseDiv.className = "course-option m-5 text-center text-black"

      const thumbnailImg = document.createElement('img')
      thumbnailImg.setAttribute('src', _course.thumbnail)
      thumbnailImg.alt = 'Thumbnail'
      thumbnailImg.className = "object-cover w-full h-full"
        // console.log(_course.thumbnail)
      courseDiv.appendChild(thumbnailImg)
      const courseName = document.createElement('div')
      courseName.textContent = _course.name
      courseName.className = 'courseName p-3 bg-lime'

      courseDiv.appendChild(courseName)
      // courseDiv.appendChild(document.createTextNode(_course.name))

      courseDiv.addEventListener('click', () =>{
        createPlayerSelection()
        handleCourseSelect(_course.id)
      })
      courseOptionsDiv.appendChild(courseDiv)
      })
      

      console.log(courses)
      // createPlayerSelection() //THIS COULD BE USED TO MAINTAIN IT ACTIVE WHILE STYLING THE PLAYER SELECTION
    } catch (error){
        console.error('Error fetching and population golf courses:', error)
    }   
} 

function handleCourseSelect(courseId) {
  if (courseId) {
    console.log('selected golf course: ', courseId)
  }
}

window.addEventListener('load', populateCourseSelect)


function createPlayerSelection(){
  let playerSelection = document.createElement('div')
  playerSelection.className = 'player-selection text-center flex flex-wrap sm:w-1/2 md:w-1/2 md:ml-auto md:mr-auto justify-center'
  for (let i = 1; i <=4; i++){
    let playerOption = document.createElement('div')
    playerOption.className = 'player-option w-fit bg-lime p-14 m-4 font-bold text-lg'
    playerOption.textContent = i

    playerOption.addEventListener('click', () =>{
      let selectedPlayers = i
      console.log('selected players: ', selectedPlayers)
    })
    playerSelection.appendChild(playerOption)
  }

  let playerSelectionContainer = document.getElementById('player-selection-container')
  playerSelectionContainer.appendChild(playerSelection)
}