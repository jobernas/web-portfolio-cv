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

var scrollPosition = 0;
var carouselHeight = 0;

function updateCarouselPosition() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

  if (scrollPosition + windowHeight >= documentHeight) {
    currentPosition += 500;
    if (currentPosition > carouselTrack.scrollWidth - carouselContainer.clientWidth) {
      currentPosition = carouselTrack.scrollWidth - carouselContainer.clientWidth;
    }
    carouselTrack.style.transform = `translateX(-${currentPosition}px)`;
  }
}

// Once Window is Loaded Setup Content
window.onload = function() {

  // Load Data from DB and Populate Page
  fetch('http://localhost/jbernas-portfolio-cv/db.json')
    .then(response => response.json())
    .then(data => {
      // do something with the data
      console.log(data);
      fillProfileData(data.profile, data.about);
    })
    .catch(error => console.error(error));
  
  window.addEventListener('scroll', updateCarouselPosition);
  const scrollContainer = document.querySelector(".carousel-items");

  scrollContainer.addEventListener("wheel", (evt) => {
      var scrollLeft = scrollContainer.scrollLeft
      if ((scrollLeft == 0 && evt.deltaY < 0) || 
            (scrollContainer.scrollLeft += evt.deltaY) == scrollLeft){
        return;
      }

      evt.preventDefault();
      //scrollContainer.scrollLeft += evt.deltaY;
      console.log("Previous scrollLeft"+scrollContainer.scrollLeft);
      console.log("Previous deltaY"+evt.deltaY);

  });

};
