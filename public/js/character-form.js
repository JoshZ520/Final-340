// Character Form JavaScript - Converts individual stat inputs to JSON

document.addEventListener('DOMContentLoaded', function() {
  const characterForm = document.getElementById('characterForm');
  
  if (characterForm) {
    characterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const stats = {
        str: parseInt(document.querySelector('input[name="str"]').value),
        dex: parseInt(document.querySelector('input[name="dex"]').value),
        con: parseInt(document.querySelector('input[name="con"]').value),
        int: parseInt(document.querySelector('input[name="int"]').value),
        wis: parseInt(document.querySelector('input[name="wis"]').value),
        cha: parseInt(document.querySelector('input[name="cha"]').value)
      };
      
      // Create a hidden input for stats JSON
      const statsInput = document.createElement('input');
      statsInput.type = 'hidden';
      statsInput.name = 'stats';
      statsInput.value = JSON.stringify(stats);
      
      this.appendChild(statsInput);
      this.submit();
    });
  }
}); 