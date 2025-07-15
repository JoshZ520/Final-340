// Character Creation JavaScript Functions

// Function to show class description
function showClassDescription(index, className) {
  // Hide all class descriptions first
  document.querySelectorAll('[id^="class-desc-"]').forEach(el => {
    el.style.display = 'none';
  });
  
  // Show the selected class description
  const descElement = document.getElementById('class-desc-' + index);
  if (descElement) {
    descElement.style.display = 'block';
  }
}

// Function to show race description
function showRaceDescription(index, raceName) {
  // Hide all race descriptions first
  document.querySelectorAll('[id^="race-desc-"]').forEach(el => {
    el.style.display = 'none';
  });
  
  // Show the selected race description
  const descElement = document.getElementById('race-desc-' + index);
  if (descElement) {
    descElement.style.display = 'block';
  }
}

// Function to show background description
function showBackgroundDescription(backgroundName, backgroundData) {
  const descContainer = document.getElementById('background-description-container');
  const descText = document.getElementById('background-desc-text');
  const skillProfs = document.getElementById('background-skill-profs');
  const toolProfs = document.getElementById('background-tool-profs');
  const languages = document.getElementById('background-languages');
  const equipment = document.getElementById('background-equipment');
  
  if (!backgroundName || backgroundName === '') {
    descContainer.style.display = 'none';
    return;
  }
  
  // Find the selected background
  const selectedBackground = backgroundData.find(b => b.name === backgroundName);
  if (selectedBackground) {
    // Show the container
    descContainer.style.display = 'block';
    
    // Update description
    descText.textContent = selectedBackground.description || 'No description available.';
    
    // Update skill proficiencies
    if (selectedBackground.skillProficiencies && selectedBackground.skillProficiencies.length > 0) {
      skillProfs.textContent = selectedBackground.skillProficiencies.join(', ');
    } else {
      skillProfs.textContent = 'None';
    }
    
    // Update tool proficiencies
    if (selectedBackground.toolProficiencies && selectedBackground.toolProficiencies.length > 0) {
      toolProfs.textContent = selectedBackground.toolProficiencies.join(', ');
    } else {
      toolProfs.textContent = 'None';
    }
    
    // Update languages (now a string)
    if (selectedBackground.languages && selectedBackground.languages !== 'None') {
      languages.textContent = selectedBackground.languages;
    } else {
      languages.textContent = 'None';
    }
    
    // Update equipment
    if (selectedBackground.equipment && selectedBackground.equipment.length > 0) {
      equipment.textContent = selectedBackground.equipment.join(', ');
    } else {
      equipment.textContent = 'None';
    }
  }
}

// Initialize character creation page
function initCharacterCreation(step, characterData, backgroundData, classData, raceData) {
  // Show descriptions for pre-selected options when page loads
  if (step === 1 && characterData.background) {
    showBackgroundDescription(characterData.background, backgroundData);
  }
  
  if (step === 2 && characterData.class && classData) {
    classData.forEach((charClass, index) => {
      if (characterData.class === charClass.name) {
        showClassDescription(index, charClass.name);
      }
    });
  }
  
  if (step === 3 && characterData.race && raceData) {
    raceData.forEach((race, index) => {
      if (characterData.race === race.name) {
        showRaceDescription(index, race.name);
      }
    });
  }
} 