$(document).ready(function () {



  const counters = document.querySelectorAll('.counter');



  for (let n of counters) {
    const updateCount = () => {
      const target = +n.getAttribute('data-target');
      const count = +n.innerText;
      const divider = 5000;
      const speed = 50; // 1000 millisecond => 1 second;

      const inc = target / divider;

      if (count < target) {
        n.innerText = Math.ceil(count + inc);
        setTimeout(updateCount, speed);
      } else {
        n.innerText = target;
      }
    };

    updateCount();
  }
  $(document).ready(function(){
$("#myInput").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#myList li").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});
});});

