// Configuration
const url = "http://localhost/jbernas-portfolio-cv";

// Functions
function calculateAge(birthday) {
  var today = new Date();
  var birthDate = new Date(birthday);
  var age = today.getFullYear() - birthDate.getFullYear();
  var monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

let debounceTimer;
function debounce(func, delay) {
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  }
}

function throttleFirst(fn, delay) {
  let canRun = true;
  return function() {
    if (canRun) {
      canRun = false;
      fn.apply(this, arguments);
      setTimeout(() => canRun = true, delay);
    }
  }
}

function fillProfileData(profile, about) {
  document.getElementById("profile_name").innerHTML = profile.name
  document.getElementById("profile_age").innerHTML = calculateAge(profile.birthday);
  document.getElementById("profile_location").innerHTML = profile.location;
  document.getElementById("profile_position").innerHTML = profile.job_title;
  var emailField = document.getElementById("profile_email");
  emailField.innerHTML = profile.email;
  emailField.href = "mailto:"+profile.email;
  document.getElementById("profile_about").innerHTML = about;
  
}

function fillExperienceData(experience) {
  fetch(url+'/components/work_experience.html')
    .then(response => response.text())
    .then(data => {
      const container = document.getElementById("carousel-track");
      experience.forEach(function(item) {
        const component = document.createElement('div');
        component.classList.add('carousel-item');
        component.innerHTML = data;
        console.log(component);
        component.querySelector('#work-experience-logo').src = item.logo;
        component.querySelector('#work-experience-job-title').innerHTML = item.position;
        component.querySelector('#work-experience-company').innerHTML = item.company;
        component.querySelector('#work-experience-location').innerHTML = item.location;
        component.querySelector('#work-experience-duration').innerHTML = item.duration;
        component.querySelector('#work-experience-description').innerHTML = item.description;
        const listItems = item.responsibilities.map(responsibility => {
          return "<li>"+responsibility+"</li>";
        }).join("\n");
        component.querySelector('#work-experience-responsibilities').innerHTML = listItems;
        container.appendChild(component);
      });
    });
}

function scrollBySection(event, containers){
  const scrollPosition = window.scrollY;
  containers.forEach(function(initialContainer, index) {
    const finalContainer = containers[index+1];
    if (finalContainer == undefined)
      return;

    const threshold = initialContainer.clientHeight;
    const initialPosition = initialContainer.offsetTop;
    const finalPosition = finalContainer.offsetTop;
    console.log("threshold:"+threshold);
    console.log("scrollPosition:"+scrollPosition);
    console.log("initialPosition:"+initialPosition);
    console.log("finalPosition:"+finalPosition);
    console.log("event.deltaY:"+event.deltaY);

    if (event.deltaY > 0) {
      if (scrollPosition > initialPosition && scrollPosition < finalPosition) {
        console.log("Executed goTo:"+finalContainer.id);
        event.preventDefault();
        window.scrollTo({ 
          top: finalPosition, 
          left: 0,
          behavior: 'smooth',
          duration: 500 
        });
      }
    } else if (event.deltaY < 0) {
      if (scrollPosition > initialPosition && scrollPosition < finalPosition) {
        console.log("Executed goTo:"+initialContainer.id);
        event.preventDefault();
        window.scrollTo({ 
          top: initialPosition, 
          left: 0,
          behavior: 'smooth',
          duration: 500 
        });
      }
    } 
  });

  // // if user has scrolled past second threshold, scroll to container3
  // if (scrollPosition > containerExperience.offsetTop) {
  //   //event.preventDefault();
    
  //   isScrollingToSection = true
  //   window.focus();
  //   window.scrollTo({ 
  //     top: containerEducation.offsetTop, 
  //     left: 0,
  //     behavior: 'smooth',
  //     duration: 500 
  //   });
  //   // containerEducation.scrollIntoView({ behavior: 'smooth' });
  //   // window.removeEventListener('scroll', scrollBySection);
  // }
}

// function checkLock(event) {
//   const scrollPosition = window.scrollY;
//   const initialPosition = containerProfile.offsetTop;
//   const finalPosition = containerExperience.offsetTop;
//   if ((event.deltaY > 0 && scrollPosition > finalPosition - 25 && scrollPosition < finalPosition + 25) || 
//   (event.deltaY < 0 && scrollPosition > initialPosition - 25 && scrollPosition < initialPosition + 25))
//     isScrollingToSection = false;
// }

var horizontalScrollContainer;
function scrollHorizontalWheelEvent(event) {
  var previousScrollLeft = horizontalScrollContainer.scrollLeft
  var finalPosition = horizontalScrollContainer.scrollWidth-horizontalScrollContainer.clientWidth;
  if ((previousScrollLeft == 0 && event.deltaY < 0) || 
    (finalPosition == previousScrollLeft && event.deltaY > 0)){
    return;
  }

  event.preventDefault();
  horizontalScrollContainer.scrollLeft += event.deltaY;
  //scrollContainer.scrollLeft += evt.deltaY;
  console.log("current.scrollLeft:"+horizontalScrollContainer.scrollLeft);
  console.log("previousScrollLeft:"+previousScrollLeft);
  console.log("deltaY:"+event.deltaY);
  console.log("finalPositionX:"+finalPosition);
}

// var scrollPosition = 0;
// var carouselHeight = 0;

// function updateCarouselPosition() {
//   const windowHeight = window.innerHeight;
//   const documentHeight = document.documentElement.scrollHeight;
//   const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

//   if (scrollPosition + windowHeight >= documentHeight) {
//     currentPosition += 500;
//     if (currentPosition > carouselTrack.scrollWidth - carouselContainer.clientWidth) {
//       currentPosition = carouselTrack.scrollWidth - carouselContainer.clientWidth;
//     }
//     carouselTrack.style.transform = `translateX(-${currentPosition}px)`;
//   }
// }

// Once Window is Loaded Setup Content
window.onload = function() {

  // Load Data from DB and Populate Page
  fetch(url+'/db.json')
    .then(response => response.json())
    .then(data => {
      // do something with the data
      console.log(data);
      fillProfileData(data.profile, data.about);
      fillExperienceData(data.work_experience);
    })
    .catch(error => console.error(error));
  
  // window.addEventListener('scroll', updateCarouselPosition);
  horizontalScrollContainer = document.querySelector(".carousel-items");
  horizontalScrollContainer.addEventListener("wheel", scrollHorizontalWheelEvent);


  // get container elements
  const containerProfile = document.getElementById('profile-container');
  const containerExperience = document.getElementById('experience-container');
  const containerEducation = document.getElementById('education-container');
  const containerSocial = document.getElementById('social-container');
  const containers = [containerProfile, containerExperience, containerEducation, containerSocial];
  // add event listener to window
  window.addEventListener('wheel', debounce(function(event) {
    scrollBySection(event, containers);
  }, 100));
  
  // window.scrollTo({ 
  //   top: containerExperience.offsetTop, 
  //   left: 0,
  //   behavior: 'smooth',
  //   duration: 500 
  // });

};
