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

    console.log('Fetched Course Data: ', courseData)
  } catch (error) {
    console.error('Error fetching course data: ', error)
  }
}

//=== FUNCTION TO RENDER THE COURSES AND CREATE THE COURSE SELECTION ===
async function populateCourseSelect() {
  try {
    const courses = await myFetch(coursesURL)
    const courseOptionsDiv = document.getElementById('course-options')

    // Clear an existing options
    courseOptionsDiv.innerHTML = ''

    // Create a default option
    courses.forEach(async (course) => {
      try {
        let _course = await myFetch(course.url)
        console.log("Course Details:", _course)


        const courseDiv = document.createElement('div')
        courseDiv.className = "course-option m-5 text-center text-black"

        const thumbnailImg = document.createElement('img')
        thumbnailImg.setAttribute('src', _course.thumbnail)
        thumbnailImg.alt = 'Thumbnail'
        thumbnailImg.className = "object-cover w-full h-full"
        courseDiv.appendChild(thumbnailImg)

        const courseName = document.createElement('div')
        courseName.textContent = _course.name
        courseName.className = 'courseName p-3 bg-lime'
        courseDiv.appendChild(courseName)

        courseOptionsDiv.appendChild(courseDiv)
      } catch (error) {
        console.error('Error fetching course data:', error)
      }
    })

    // This console logs the expected courses in the console
    // console.log(courses)
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
