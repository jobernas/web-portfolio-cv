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


window.onload = function() {
  var displayAge = document.getElementById('my_age');
  displayAge.innerHTML = calculateAge('1989-05-06');
};
