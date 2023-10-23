//======= CLASS TO CREATE PLAYERS ========
class Player {
    constructor(name, id = getNextId(), scores = []) {
      this.name = name;
      this.id = id;
      this.scores = scores;
    }
  }

let players = []

function createPlayer(name){
  let player = new Player(name)
  players.push(player)
  return player
}
//======== API INTEGRATION FOR THE COURSES ===========

async function getAvailableGolfCourses() {
    const response = await fetch(
        "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json",
        // { mode: "no-cors" }
    );
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
        //   { mode: "no-cors" }
      );
      console.log();
      return await response.json();
  }

  // This is to add an event listener to the course-select element
document.getElementById('course-select').addEventListener('change', handleCourseSelectChange)

async function populateCourseSelect(){
    try {
      let courses = await getAvailableGolfCourses()
      let populateCourseSelect = document.getElementById('course-select')

      // Clear an existing options
      populateCourseSelect.innerHTML = ''
      
      // Create a default option
      const defaultOption = document.createElement('option')
      defaultOption.value = ''
      defaultOption.text = 'Select A Golf Course'
      populateCourseSelect.appendChild(defaultOption)


      let courseOptionHtml = ''
      courses.forEach((course) => {
          courseOptionHtml += `<option value ="${course.id}">${course.name}</option>`
          
      })

      // Set the inner HTML of the select element
      populateCourseSelect.innerHTML += courseOptionHtml

      
      console.log(courses)
      console.log(courseOptionHtml)
    }catch (error){
        console.error('Error fetching and population golf courses:', error)
    }
    
} 

window.addEventListener('load', populateCourseSelect)