const express = require('express');
const pool = require('../db');
const router = express.Router();

// Helper function to condense descriptions
function condenseDescription(description) {
  if (!description) return 'No description available.';
  
  // If it's an array, join it first
  if (Array.isArray(description)) {
    description = description.join(' ');
  }
  
  // Remove extra whitespace and newlines
  description = description.replace(/\s+/g, ' ').trim();
  
  // Limit to first 200 characters and add ellipsis if longer
  if (description.length > 200) {
    description = description.substring(0, 200) + '...';
  }
  
  return description;
}

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// Show character creation form (temporarily accessible without login)
router.get('/create', (req, res) => {
  res.render('create_character', { error: null });
});

// Step-by-step character creation
router.get('/create/step/:step', async (req, res) => {
  const step = parseInt(req.params.step) || 1;
  let data = {};
  
  try {
    // Fetch D&D data from API for different steps
    if (step === 1) {
      // Fetch backgrounds from Open5e API for name and description
      const backgroundsResponse = await fetch('https://api.open5e.com/backgrounds/');
      const backgroundsData = await backgroundsResponse.json();
      
      // Fetch backgrounds from Open5e v2 API for benefits
      const backgroundsV2Response = await fetch('https://api.open5e.com/v2/backgrounds/');
      const backgroundsV2Data = await backgroundsV2Response.json();
      
      // Create a map of v2 backgrounds by name for easy lookup
      const v2BackgroundsMap = {};
      backgroundsV2Data.results.forEach(background => {
        v2BackgroundsMap[background.name] = background;
      });
      
      // Process the backgrounds data, combining both sources
      const backgroundsWithDetails = backgroundsData.results.map(background => {
        // Get the v2 version of this background for benefits
        const v2Background = v2BackgroundsMap[background.name];
        
        // Log all available fields for the first background to see what's available
        // if (background.name === 'Acolyte') {
        //   console.log('Background API fields:', Object.keys(background));
        //   console.log('Background v2 API fields:', Object.keys(v2Background || {}));
        //   console.log('Sample background data:', background);
        //   console.log('Sample v2 background data:', v2Background);
        // }
        
        // Extract benefits from the v2 API structure
        const skillProficiencies = v2Background?.benefits?.find(b => b.type === 'skill_proficiency')?.desc || '';
        const toolProficiencies = v2Background?.benefits?.find(b => b.type === 'tool_proficiency')?.desc || '';
        const languages = v2Background?.benefits?.find(b => b.type === 'language')?.desc || '';
        const equipment = v2Background?.benefits?.find(b => b.type === 'equipment')?.desc || '';
        
        return {
          name: background.name,
          description: condenseDescription(background.desc),
          skillProficiencies: skillProficiencies ? skillProficiencies.split(', ') : [],
          toolProficiencies: toolProficiencies ? toolProficiencies.split(', ') : [],
          languages: languages || 'None',
          equipment: equipment ? equipment.split(', ') : []
        };
      });

      // Filter to only include popular/core backgrounds
      const allowedBackgrounds = [
        'Acolyte',
        'Criminal',
        'Folk Hero',
        'Noble',
        'Sage',
        'Soldier',
        'Urchin',
        'Entertainer',
        'Guild Artisan',
        'Hermit',
        'Outlander',
        'Charlatan'
      ];

      // Filter backgrounds to only include allowed ones
      const filteredBackgrounds = backgroundsWithDetails.filter(background => 
        allowedBackgrounds.includes(background.name)
      );

      data.backgrounds = filteredBackgrounds;
      
      // Define levels 1-20
      data.levels = Array.from({length: 20}, (_, i) => i + 1);
    } else if (step === 2) {
      // Fetch classes from Open5e API
      const classesResponse = await fetch('https://api.open5e.com/classes/');
      const classesData = await classesResponse.json();
      
      // Process classes data from Open5e format
      const classesWithDetails = classesData.results.map(charClass => {
        // Log all available fields for the first class to see what's available
        if (charClass.name === 'Fighter') {
          console.log('Class API fields:', Object.keys(charClass));
          console.log('Sample class data:', charClass);
        }
        
        return {
          name: charClass.name,
          description: condenseDescription(charClass.desc),
          hitDie: charClass.hit_dice || 'd8',
          proficiencies: charClass.proficiencies || []
        };
      });
      data.classes = classesWithDetails;
    } else if (step === 3) {
      // Fetch races from Open5e API
      const racesResponse = await fetch('https://api.open5e.com/races/');
      const racesData = await racesResponse.json();
      
      // Ability abbreviation to full name map
      const abilityMap = {
        STR: 'Strength',
        DEX: 'Dexterity',
        CON: 'Constitution',
        INT: 'Intelligence',
        WIS: 'Wisdom',
        CHA: 'Charisma'
      };

      // Process races data from Open5e format
      const racesWithDetails = racesData.results.map(race => {
        // Log all available fields for the first race to see what's available
        if (race.name === 'Human') {
          console.log('Race API fields:', Object.keys(race));
          console.log('Sample race data:', race);
        }
        // Format ability bonuses as an array of objects and as a string
        let bonusesArray = [];
        let formattedBonuses = '';
        if (Array.isArray(race.asi)) {
          bonusesArray = race.asi.map(bonus => ({
            ability: abilityMap[bonus.ability] || bonus.ability,
            score: bonus.score
          }));
          formattedBonuses = bonusesArray.map(b => `${b.ability}: +${b.score}`).join(', ');
        }
        return {
          name: race.name,
          description: condenseDescription(race.desc),
          abilityBonuses: bonusesArray,
          abilityBonusesString: formattedBonuses,
          traits: race.traits || []
        };
      });
      data.races = racesWithDetails;
    } else if (step === 4) {
      // Fetch skills from Open5e API for proficiency selection
      const skillsResponse = await fetch('https://api.open5e.com/skills/');
      const skillsData = await skillsResponse.json();
      data.skills = skillsData.results;
      
      // Define the 6 ability scores
      data.abilities = [
        { name: 'Strength', abbr: 'str' },
        { name: 'Dexterity', abbr: 'dex' },
        { name: 'Constitution', abbr: 'con' },
        { name: 'Intelligence', abbr: 'int' },
        { name: 'Wisdom', abbr: 'wis' },
        { name: 'Charisma', abbr: 'cha' }
      ];
    } else if (step === 5) {
      // Define alignments for step 5
      data.alignments = [
        'Lawful Good', 'Neutral Good', 'Chaotic Good',
        'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 
        'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
      ];
    }
    
    res.render('character_step', { 
      step, 
      data,
      characterData: req.session.characterData || {},
      error: null 
    });
  } catch (error) {
    res.render('character_step', { 
      step, 
      data: {},
      characterData: req.session.characterData || {},
      error: 'Failed to load data. Please try again.' 
    });
  }
});

// Handle step form submission
router.post('/create/step/:step', async (req, res) => {
  const step = parseInt(req.params.step) || 1;
  const { name, class: charClass, race, str, dex, con, int, wis, cha, description, savingThrows, skillProficiencies, level, background, alignment } = req.body;
  
  // Store character data in session
  if (!req.session.characterData) {
    req.session.characterData = {};
  }
  
  // Update session with current step data
  if (step === 1) {
    if (name) req.session.characterData.name = name;
    if (level) req.session.characterData.level = parseInt(level);
    if (background) req.session.characterData.background = background;
  } else if (step === 2 && charClass) {
    req.session.characterData.class = charClass;
  } else if (step === 3 && race) {
    req.session.characterData.race = race;
  } else if (step === 4 && str && dex && con && int && wis && cha) {
    req.session.characterData.stats = { str, dex, con, int, wis, cha };
    // Handle saving throw proficiencies (array of ability names)
    if (savingThrows) {
      req.session.characterData.savingThrows = Array.isArray(savingThrows) ? savingThrows : [savingThrows];
    }
    // Handle skill proficiencies (array of skill names)
    if (skillProficiencies) {
      req.session.characterData.skillProficiencies = Array.isArray(skillProficiencies) ? skillProficiencies : [skillProficiencies];
    }
  } else if (step === 5) {
    if (alignment) req.session.characterData.alignment = alignment;
    req.session.characterData.description = description || '';
  }
  
  // Move to next step or finish
  if (step < 5) {
    res.redirect(`/characters/create/step/${step + 1}`);
  } else {
    // Final step - create character
    try {
      const statsObj = req.session.characterData.stats;
      await pool.query(
        'INSERT INTO characters (user_id, name, class, stats, description) VALUES ($1, $2, $3, $4, $5)',
        [
          req.session.userId || 1, // Default user ID for now
          req.session.characterData.name,
          req.session.characterData.class,
          statsObj,
          req.session.characterData.description
        ]
      );
      
      // Clear session data
      delete req.session.characterData;
      res.redirect('/?success=character_created');
    } catch (err) {
      res.render('character_step', { 
        step, 
        data: {},
        characterData: req.session.characterData,
        error: 'Failed to create character. Please try again.' 
      });
    }
  }
});

// Handle character creation (still requires login for now)
router.post('/create', requireLogin, async (req, res) => {
  const { name, class: charClass, stats, description } = req.body;
  if (!name || !charClass || !stats) {
    return res.render('create_character', { error: 'All fields except description are required.' });
  }
  try {
    const statsObj = JSON.parse(stats);
    await pool.query(
      'INSERT INTO characters (user_id, name, class, stats, description) VALUES ($1, $2, $3, $4, $5)',
      [req.session.userId, name, charClass, statsObj, description]
    );
    res.redirect('/');
  } catch (err) {
    let error = 'Failed to create character.';
    if (err instanceof SyntaxError) error = 'Stats must be valid JSON.';
    res.render('create_character', { error });
  }
});

module.exports = router; 