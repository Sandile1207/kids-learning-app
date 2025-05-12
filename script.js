// Main navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('main section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active-section'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active-section');
        });
    });

    // Profile functionality
    const profileToggle = document.getElementById('profile-toggle');
    const profileModal = document.getElementById('profile-modal');
    const closeProfile = document.getElementById('close-profile');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (profileToggle) {
        profileToggle.addEventListener('click', function() {
            profileModal.style.display = 'block';
        });
    }

    if (closeProfile) {
        closeProfile.addEventListener('click', function() {
            profileModal.style.display = 'none';
        });
    }

    // Tab functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Avatar selection
    const avatarOptions = document.querySelectorAll('.avatar-option');
    
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Create profile
    const createProfileBtn = document.getElementById('create-profile-btn');
    
    if (createProfileBtn) {
        createProfileBtn.addEventListener('click', function() {
            const newName = document.getElementById('new-name').value;
            const selectedAvatar = document.querySelector('.avatar-option.selected').getAttribute('data-avatar');
            
            if (newName) {
                // Store profile in localStorage
                const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
                profiles.push({
                    name: newName,
                    avatar: selectedAvatar,
                    level: 1
                });
                localStorage.setItem('profiles', JSON.stringify(profiles));
                
                // Update current profile
                document.getElementById('profile-name').textContent = newName;
                document.getElementById('profile-level').textContent = '1';
                
                // Update profiles list
                updateProfilesList();
                
                // Close modal
                profileModal.style.display = 'none';
            }
        });
    }

    // Function to update profiles list
    function updateProfilesList() {
        const profilesList = document.getElementById('profiles-list');
        const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
        
        profilesList.innerHTML = '';
        
        profiles.forEach(profile => {
            const profileElement = document.createElement('div');
            profileElement.classList.add('profile-item');
            profileElement.innerHTML = `
                <div class="profile-avatar">
                    <img src="/api/placeholder/60/60" alt="${profile.name}">
                </div>
                <div class="profile-info">
                    <span>${profile.name}</span>
                    <span class="profile-level">Level: ${profile.level}</span>
                </div>
            `;
            
            profileElement.addEventListener('click', function() {
                document.getElementById('profile-name').textContent = profile.name;
                document.getElementById('profile-level').textContent = profile.level;
                profileModal.style.display = 'none';
            });
            
            profilesList.appendChild(profileElement);
        });
    }

    // Call function to populate profiles list
    updateProfilesList();

    // Math game
    let mathScore = 0;
    const checkMathBtn = document.getElementById('check-math');
    const nextMathBtn = document.getElementById('next-math');
    const mathResult = document.getElementById('math-result');
    const mathScoreDisplay = document.getElementById('math-score');
    
    function generateMathQuestion() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operators = ['+', '-', '×'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        
        document.getElementById('num1').textContent = num1;
        document.getElementById('num2').textContent = num2;
        document.getElementById('operator').textContent = operator;
        document.getElementById('answer').value = '';
        mathResult.textContent = '';
    }
    
    if (checkMathBtn) {
        checkMathBtn.addEventListener('click', function() {
            const num1 = parseInt(document.getElementById('num1').textContent);
            const num2 = parseInt(document.getElementById('num2').textContent);
            const operator = document.getElementById('operator').textContent;
            const userAnswer = parseInt(document.getElementById('answer').value);
            let correctAnswer;
            
            switch(operator) {
                case '+':
                    correctAnswer = num1 + num2;
                    break;
                case '-':
                    correctAnswer = num1 - num2;
                    break;
                case '×':
                    correctAnswer = num1 * num2;
                    break;
            }
            
            if (userAnswer === correctAnswer) {
                mathResult.textContent = 'Correct! 🎉';
                mathResult.classList.remove('incorrect');
                mathResult.classList.add('correct');
                mathScore++;
                mathScoreDisplay.textContent = mathScore;
                
                // Check for badge
                if (mathScore >= 5) {
                    document.getElementById('math-badge-5').classList.remove('locked');
                    document.getElementById('math-badge-5').classList.add('unlocked');
                    showCelebration();
                }
            } else {
                mathResult.textContent = `Incorrect. The answer is ${correctAnswer}`;
                mathResult.classList.remove('correct');
                mathResult.classList.add('incorrect');
            }
        });
    }
    
    if (nextMathBtn) {
        nextMathBtn.addEventListener('click', generateMathQuestion);
    }

    // Initialize math question
    generateMathQuestion();

    // Spelling game
    const words = [
        { word: 'cat', image: 'assets/images/spelling/Cat.jpg' },
        { word: 'dog', image: 'assets/images/spelling/Dog.jpg' },
        { word: 'sun', image: 'assets/images/spelling/sun.png' },
        { word: 'moon', image: 'assets/images/spelling/moon.png' },
        { word: 'tree', image: 'assets/images/spelling/tree.png' },
        { word: 'fish', image: 'assets/images/spelling/fish.png' },
        { word: 'bird', image: 'assets/images/spelling/bird.png' },
        { word: 'star', image: 'assets/images/spelling/star.png' },
    ];
    
    let currentWord = '';
    let spellingScore = 0;
    const wordContainer = document.getElementById('word-container');
    const letterBank = document.getElementById('letter-bank');
    const nextSpellingBtn = document.getElementById('next-spelling');
    const spellingResult = document.getElementById('spelling-result');
    const spellingScoreDisplay = document.getElementById('spelling-score');
    
    function generateSpellingWord() {
        const wordObj = words[Math.floor(Math.random() * words.length)];
        currentWord = wordObj.word;
        
        document.getElementById('spelling-image').src = wordObj.image;
        
        // Create empty spaces for word
        wordContainer.innerHTML = '';
        for (let i = 0; i < currentWord.length; i++) {
            const letterSpace = document.createElement('div');
            letterSpace.classList.add('letter-space');
            letterSpace.setAttribute('data-index', i);
            wordContainer.appendChild(letterSpace);
        }
        
        // Create letter bank with shuffled letters
        letterBank.innerHTML = '';
        const allLetters = currentWord.split('');
        
        // Add some random letters
        for (let i = 0; i < 3; i++) {
            allLetters.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
        }
        
        // Shuffle letters
        allLetters.sort(() => Math.random() - 0.5);
        
        allLetters.forEach(letter => {
            const letterTile = document.createElement('div');
            letterTile.classList.add('letter-tile');
            letterTile.textContent = letter;
            letterTile.addEventListener('click', function() {
                if (!this.classList.contains('used')) {
                    const emptySpace = document.querySelector('.letter-space:not(.filled)');
                    if (emptySpace) {
                        emptySpace.textContent = letter;
                        emptySpace.classList.add('filled');
                        this.classList.add('used');
                        
                        // Check if word is complete
                        const filledSpaces = document.querySelectorAll('.letter-space.filled');
                        if (filledSpaces.length === currentWord.length) {
                            checkSpelling();
                        }
                    }
                }
            });
            letterBank.appendChild(letterTile);
        });
        
        spellingResult.textContent = '';
    }
    
    function checkSpelling() {
        const filledSpaces = document.querySelectorAll('.letter-space.filled');
        let userWord = '';
        
        filledSpaces.forEach(space => {
            userWord += space.textContent;
        });
        
        if (userWord === currentWord) {
            spellingResult.textContent = 'Correct! 🎉';
            spellingResult.classList.remove('incorrect');
            spellingResult.classList.add('correct');
            spellingScore++;
            spellingScoreDisplay.textContent = spellingScore;
            
            // Check for badge
            if (spellingScore >= 5) {
                document.getElementById('spelling-badge-5').classList.remove('locked');
                document.getElementById('spelling-badge-5').classList.add('unlocked');
                showCelebration();
            }
        } else {
            spellingResult.textContent = `Incorrect. The word is ${currentWord}`;
            spellingResult.classList.remove('correct');
            spellingResult.classList.add('incorrect');
        }
    }
    
    if (nextSpellingBtn) {
        nextSpellingBtn.addEventListener('click', generateSpellingWord);
    }

    // Initialize spelling game
    if (document.getElementById('spelling-image')) {
        generateSpellingWord();
    }

    // Colors game
    const colors = [
        { name: 'Red', value: '#FF0000' },
        { name: 'Blue', value: '#0000FF' },
        { name: 'Green', value: '#00FF00' },
        { name: 'Yellow', value: '#FFFF00' },
        { name: 'Purple', value: '#800080' },
        { name: 'Orange', value: '#FFA500' },
        { name: 'Pink', value: '#FFC0CB' },
        { name: 'Brown', value: '#A52A2A' },
    ];
    
    let colorScore = 0;
    let currentColor = '';
    const colorOptions = document.getElementById('color-options');
    const nextColorBtn = document.getElementById('next-color');
    const colorResult = document.getElementById('color-result');
    const colorScoreDisplay = document.getElementById('color-score');
    
    function generateColorQuestion() {
        const colorIndex = Math.floor(Math.random() * colors.length);
        currentColor = colors[colorIndex].name;
        document.getElementById('color-to-find').textContent = currentColor;
        
        // Create color options
        colorOptions.innerHTML = '';
        
        // Copy and shuffle colors
        const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
        
        shuffledColors.slice(0, 4).forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.classList.add('color-option');
            colorOption.style.backgroundColor = color.value;
            colorOption.setAttribute('data-color', color.name);
            
            colorOption.addEventListener('click', function() {
                const selectedColor = this.getAttribute('data-color');
                
                if (selectedColor === currentColor) {
                    colorResult.textContent = 'Correct! 🎉';
                    colorResult.classList.remove('incorrect');
                    colorResult.classList.add('correct');
                    colorScore++;
                    colorScoreDisplay.textContent = colorScore;
                    
                    // Check for badge
                    if (colorScore >= 5) {
                        document.getElementById('color-badge-5').classList.remove('locked');
                        document.getElementById('color-badge-5').classList.add('unlocked');
                        showCelebration();
                    }
                } else {
                    colorResult.textContent = `Incorrect. Try again!`;
                    colorResult.classList.remove('correct');
                    colorResult.classList.add('incorrect');
                }
            });
            
            colorOptions.appendChild(colorOption);
        });
        
        colorResult.textContent = '';
    }
    
    if (nextColorBtn) {
        nextColorBtn.addEventListener('click', generateColorQuestion);
    }

    // Initialize colors game
    if (document.getElementById('color-to-find')) {
        generateColorQuestion();
    }

    // Animals game
    const animals = [
        { name: 'Dog', sound: 'assets/sound/Dog.mp3', image: 'assets/images/Dog.jpg' },
        { name: 'Cat', sound: 'assets/sound/Cat.mp3', image: 'assets/images/Cat.jpg' },
        { name: 'Cow', sound: 'assets/sound/cow-sound-234947.mp3', image: 'assets/images/Cow.jpg' },
        { name: 'Duck', sound: 'assets/sound/duck-quacker-65590.mp3', image: 'assets/images/Duck.jpg' },
        { name: 'Horse', sound: 'assets/sound/horse-whinny-sound-effect-322958.mp3', image: 'assets/images/Horse.jpg' },
        { name: 'Sheep', sound: 'assets/sound/sheep-bleating-223324.mp3', image: 'assets/images/Sheep.jpg' },
        { name: 'Frog', sound: 'assets/sound/frog-croaking-sound-effect-322956.mp3', image: 'assets/images/frog.png' },
        { name: 'Pig', sound: 'assets/sound/Pig.mp3', image: 'assets/images/Pig.jpg' },
    ];

let animalScore = 0;
let currentAnimal = '';
const animalContainer = document.getElementById('animal-container');
const animalOptions = document.getElementById('animal-options');
const playSound = document.getElementById('play-sound');
const nextAnimalBtn = document.getElementById('next-animal');
const animalResult = document.getElementById('animal-result');
const animalScoreDisplay = document.getElementById('animal-score');
const audioPlayer = new Audio(); // Create audio element for playing sounds

function generateAnimalQuestion() {
    const animalIndex = Math.floor(Math.random() * animals.length);
    currentAnimal = animals[animalIndex];
    console.log("Current animal:", currentAnimal.name); // Debug log
    
    // Display animal image (initially hidden)
    animalContainer.innerHTML = `<img src="${currentAnimal.image}" alt="${currentAnimal.name}" class="hidden-animal">`;
    
    // Create animal options
    animalOptions.innerHTML = '';
    
    // Copy and shuffle animals
    const shuffledAnimals = [...animals].sort(() => Math.random() - 0.5);
    
    // Make sure the current animal is included in the options
    let includesCurrent = false;
    for (let animal of shuffledAnimals.slice(0, 8)) {
        if (animal.name === currentAnimal.name) {
            includesCurrent = true;
            break;
        }
    }
    
    // If current animal is not in the first 8, replace one randomly
    if (!includesCurrent) {
        const randomIndex = Math.floor(Math.random() * 8);
        shuffledAnimals[randomIndex] = currentAnimal;
    }
    
    console.log("Shuffled animals:", shuffledAnimals.slice(0, 8).map(a => a.name)); // Debug log
    
    // Display animal options (using 8 options as in your original code)
    shuffledAnimals.slice(0, 8).forEach(animal => {
        const animalOption = document.createElement('div');
        animalOption.classList.add('animal-option');
        animalOption.textContent = animal.name;
        
        animalOption.addEventListener('click', function() {
            const selectedAnimal = this.textContent;
            console.log("Selected:", selectedAnimal, "Current:", currentAnimal.name); // Debug log
            
            if (selectedAnimal === currentAnimal.name) {
                animalResult.textContent = 'Correct! 🎉';
                animalResult.classList.remove('incorrect');
                animalResult.classList.add('correct');
                // Show the animal image by removing the hidden class
                const animalImage = document.querySelector('.hidden-animal');
                if (animalImage) {
                    animalImage.classList.remove('hidden-animal');
                }
                animalScore++;
                animalScoreDisplay.textContent = animalScore;
                
                // Check for badge
                if (animalScore >= 5) {
                    const badge = document.getElementById('animal-badge-5');
                    if (badge) {
                        badge.classList.remove('locked');
                        badge.classList.add('unlocked');
                        showCelebration();
                    }
                }
            } else {
                animalResult.textContent = `Incorrect. Try again!`;
                animalResult.classList.remove('correct');
                animalResult.classList.add('incorrect');
            }
        });
        
        animalOptions.appendChild(animalOption);
    });
    
    animalResult.textContent = '';
}

// Add sound playing functionality
if (playSound) {
    playSound.addEventListener('click', function() {
        // Actually play the sound file
        audioPlayer.src = currentAnimal.sound;
        audioPlayer.play().catch(error => {
            // If sound fails to play, fall back to alert
            console.error("Failed to play sound:", error);
            alert("Sound should play: " + currentAnimal.name + " sound");
        });
    });
}

if (nextAnimalBtn) {
    nextAnimalBtn.addEventListener('click', generateAnimalQuestion);
}

// Initialize animals game
if (document.getElementById('animal-container')) {
    generateAnimalQuestion();
}

// Add necessary CSS for the hidden animal class if not already in your stylesheet
document.head.insertAdjacentHTML('beforeend', `
<style>
    .hidden-animal {
        opacity: 0.3;
        filter: blur(10px);
    }
    .animal-option {
        display: inline-block;
        margin: 10px;
        padding: 15px 30px;
        background-color: #3498db;
        color: white;
        border-radius: 30px;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.3s ease;
    }
    .animal-option:hover {
        background-color: #2980b9;
        transform: scale(1.05);
    }
    .correct {
        color: green;
        font-weight: bold;
    }
    .incorrect {
        color: red;
        font-weight: bold;
    }
</style>
`);

// Helper function for celebration (if defined elsewhere)
function showCelebration() {
    // You can implement this function to show a celebration animation
    console.log("Celebration! 5 correct answers reached!");
}

// Add necessary CSS for the hidden animal class
document.head.insertAdjacentHTML('beforeend', `
<style>
    .hidden-animal {
        opacity: 0.3;
        filter: blur(10px);
    }
    .animal-option {
        display: inline-block;
        margin: 10px;
        padding: 15px 30px;
        background-color: #3498db;
        color: white;
        border-radius: 30px;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.3s ease;
    }
    .animal-option:hover {
        background-color: #2980b9;
        transform: scale(1.05);
    }
    .correct {
        color: green;
        font-weight: bold;
    }
    .incorrect {
        color: red;
        font-weight: bold;
    }
    #play-sound {
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 30px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        margin: 20px auto;
    }
    #play-sound:hover {
        background-color: #c0392b;
    }
    #animal-container {
        margin: 20px auto;
        text-align: center;
    }
    #animal-container img {
        max-width: 300px;
        max-height: 300px;
        border-radius: 10px;
        transition: all 0.5s ease;
    }
</style>
`);

// Helper function for celebration (if defined elsewhere)
function showCelebration() {
    // You can implement this function to show a celebration animation
    console.log("Celebration! 5 correct answers reached!");
}

    // Initialize animals game
    if (document.getElementById('animal-container')) {
        generateAnimalQuestion();
    }

    // Flashcards game
    const flashcards = {
        animals: [
            { image: 'assets/images/dog.png', text: 'Dog' },
            { image: 'assets/images/Cat.jpg', text: 'Cat' },
            { image: 'assets/images/elephant.png', text: 'Elephant' },
            { image: 'assets/images/lion.png', text: 'Lion' },
        ],
        shapes: [
            { image: 'assets/images/shapes/Circle.png', text: 'Circle' },
            { image: 'assets/images/shapes/Square.png', text: 'Square' },
            { image: 'assets/images/shapes/Triangle.png', text: 'Triangle' },
            { image: 'assets/images/shapes/Rectangle.png', text: 'Rectangle' },
        ],
        numbers: [
            { image: 'assets/images/numbers/one.png', text: 'One' },
            { image: 'assets/images/numbers/two.png', text: 'Two' },
            { image: 'assets/images/numbers/three.png', text: 'Three' },
            { image: 'assets/images/numbers/Four.png', text: 'Four' },
        ],
        colors: [
            { image: 'assets/images/colors/red.png', text: 'Red' },
            { image: 'assets/images/colors/blue.png', text: 'Blue' },
            { image: 'assets/images/colors/green.png', text: 'Green' },
            { image: 'assets/images/colors/yellow.png', text: 'Yellow' },
        ]
    };
    
    let currentCardIndex = 0;
    let currentCategory = 'animals';
    let cardsViewed = 0;
    const flashcard = document.getElementById('flashcard');
    const flipCardBtn = document.getElementById('flip-card');
    const nextCardBtn = document.getElementById('next-card');
    const cardCategory = document.getElementById('card-category');
    const flashcardScore = document.getElementById('flashcard-score');
    
    function showFlashcard() {
        const currentCards = flashcards[currentCategory];
        const card = currentCards[currentCardIndex];
        
        document.getElementById('flashcard-image').src = card.image;
        document.getElementById('flashcard-text').textContent = card.text;
        
        // Reset card to front side
        if (flashcard) {
            flashcard.classList.remove('flipped');
        }
    }
    
    if (flipCardBtn) {
        flipCardBtn.addEventListener('click', function() {
            flashcard.classList.toggle('flipped');
        });
    }
    
    if (nextCardBtn) {
        nextCardBtn.addEventListener('click', function() {
            currentCardIndex = (currentCardIndex + 1) % flashcards[currentCategory].length;
            showFlashcard();
            cardsViewed++;
            flashcardScore.textContent = cardsViewed;
            
            // Check for badge
            if (cardsViewed >= 5) {
                document.getElementById('flashcard-badge-5').classList.remove('locked');
                document.getElementById('flashcard-badge-5').classList.add('unlocked');
                showCelebration();
            }
        });
    }
    
    if (cardCategory) {
        cardCategory.addEventListener('change', function() {
            currentCategory = this.value;
            currentCardIndex = 0;
            showFlashcard();
        });
    }

    // Initialize flashcards
    if (document.getElementById('flashcard-image')) {
        showFlashcard();
    }

    // Matching game
    const matchingItems = [
        { id: 1, name: 'Dog', image: 'assets/images/Dog.jpg' },
        { id: 2, name: 'Cat', image: 'assets/images/Cat.jpg' },
        { id: 3, name: 'Bird', image: 'assets/images/Bir.png' },
        { id: 4, name: 'Fish', image: 'assets/images/fish.png' },
        { id: 5, name: 'Elephant', image: 'assets/images/elephant.png' },
        { id: 6, name: 'Lion', image: 'assets/images/lion.png' },
        { id: 7, name: 'Monkey', image: 'assets/images/Monkey.png' },
        { id: 8, name: 'Zebra', image: 'assets/images/Zebra.png' }
    ];
    
    let flippedCards = [];
    let matchedPairs = 0;
    let totalPairs = 0;
    let moves = 0;
    let selectedCards = [];
    let difficulty = 'easy';
    const matchingGrid = document.getElementById('matching-grid');
    const restartMatchingBtn = document.getElementById('restart-matching');
    const difficultySelect = document.getElementById('difficulty');
    const matchingScoreDisplay = document.getElementById('matching-score');
    const matchingMovesDisplay = document.getElementById('matching-moves');
    const matchingResult = document.getElementById('matching-result');
    
    function setupMatchingGame() {
        matchedPairs = 0;
        moves = 0;
        flippedCards = [];
        matchingScoreDisplay.textContent = '0';
        matchingMovesDisplay.textContent = '0';
        matchingResult.textContent = '';
        
        // Determine number of pairs based on difficulty
        let numPairs;
        switch(difficulty) {
            case 'easy':
                numPairs = 4;
                break;
            case 'medium':
                numPairs = 6;
                break;
            case 'hard':
                numPairs = 8;
                break;
            default:
                numPairs = 4;
        }
        
        totalPairs = numPairs;
        
        // Select cards for this game
        selectedCards = [];
        const shuffledItems = [...matchingItems].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < numPairs; i++) {
            selectedCards.push(shuffledItems[i]);
            selectedCards.push({...shuffledItems[i]}); // Create a copy for the pair
        }
        
        // Shuffle selected cards
        selectedCards.sort(() => Math.random() - 0.5);
        
        // Create grid
        if (matchingGrid) {
            matchingGrid.innerHTML = '';
            
            selectedCards.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('matching-card');
                cardElement.setAttribute('data-id', card.id);
                cardElement.setAttribute('data-index', index);
                cardElement.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front"></div>
                        <div class="card-back">
                            <img src="${card.image}" alt="${card.name}">
                        </div>
                    </div>
                `;
                
                cardElement.addEventListener('click', function() {
                    // Don't allow flipping if already matched or already flipped
                    if (this.classList.contains('matched') || this.classList.contains('flipped') || flippedCards.length >= 2) {
                        return;
                    }
                    
                    // Flip card
                    this.classList.add('flipped');
                    flippedCards.push({
                        element: this,
                        id: card.id,
                        index: index
                    });
                    
                    // Check for match if two cards are flipped
                    if (flippedCards.length === 2) {
                        moves++;
                        matchingMovesDisplay.textContent = moves;
                        
                        if (flippedCards[0].id === flippedCards[1].id && flippedCards[0].index !== flippedCards[1].index) {
                            // Match found
                            flippedCards[0].element.classList.add('matched');
                            flippedCards[1].element.classList.add('matched');
                            flippedCards = [];
                            matchedPairs++;
                            matchingScoreDisplay.textContent = matchedPairs;
                            
                            // Check for game completion
                            if (matchedPairs === totalPairs) {
                                matchingResult.textContent = 'Congratulations! You found all matches!';
                                matchingResult.classList.add('correct');
                                
                                // Award badge
                                document.getElementById('matching-badge').classList.remove('locked');
                                document.getElementById('matching-badge').classList.add('unlocked');
                                showCelebration();
                            }
                        } else {
                            // No match
                            setTimeout(() => {
                                flippedCards[0].element.classList.remove('flipped');
                                flippedCards[1].element.classList.remove('flipped');
                                flippedCards = [];
                            }, 1000);
                        }
                    }
                });
                
                matchingGrid.appendChild(cardElement);
            });
        }
    }
    
    if (restartMatchingBtn) {
        restartMatchingBtn.addEventListener('click', setupMatchingGame);
    }
    
    if (difficultySelect) {
        difficultySelect.addEventListener('change', function() {
            difficulty = this.value;
            setupMatchingGame();
        });
    }

    // Initialize matching game
    if (document.getElementById('matching-grid')) {
        setupMatchingGame();
    }

    // Celebration effect
    function showCelebration() {
        const celebration = document.getElementById('celebration');
        celebration.style.display = 'flex';
        
        setTimeout(() => {
            celebration.style.display = 'none';
        }, 3000);
    }

    // Check if all activities have been tried
    function checkAllActivities() {
        const mathBadge = document.getElementById('math-badge-5');
        const spellingBadge = document.getElementById('spelling-badge-5');
        const colorBadge = document.getElementById('color-badge-5');
        const animalBadge = document.getElementById('animal-badge-5');
        const flashcardBadge = document.getElementById('flashcard-badge-5');
        const matchingBadge = document.getElementById('matching-badge');
        
        if (
            mathBadge && mathBadge.classList.contains('unlocked') &&
            spellingBadge && spellingBadge.classList.contains('unlocked') &&
            colorBadge && colorBadge.classList.contains('unlocked') &&
            animalBadge && animalBadge.classList.contains('unlocked') &&
            flashcardBadge && flashcardBadge.classList.contains('unlocked') &&
            matchingBadge && matchingBadge.classList.contains('unlocked')
        ) {
            document.getElementById('all-activities').classList.remove('locked');
            document.getElementById('all-activities').classList.add('unlocked');
            showCelebration();
        }
    }

    // Additional CSS to fix the layout issues
const additionalStyle = document.createElement('style');
additionalStyle.textContent = `
    .matching-card {
        width: 80px;
        height: 80px;
        margin: 5px;
        perspective: 1000px;
        cursor: pointer;
        position: relative;
    }
    
    .card-inner {
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.6s;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        position: absolute;
        top: 0;
        left: 0;
    }
    
    .card-front, .card-back {
        width: 100%;
        height: 100%;
        position: absolute;
        backface-visibility: hidden;
        border-radius: 8px;
        overflow: hidden;
    }
    
    .card-back img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .matching-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 360px;
        margin: 0 auto;
        gap: 5px;
    }
    
    .animal-container {
        width: 200px;
        height: 200px;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .hidden-animal {
        filter: brightness(0);
        transition: filter 0.5s;
    }
`;

document.head.appendChild(additionalStyle);

    // Add CSS for functional elements
    const style = document.createElement('style');
    style.textContent = `
        .active-section {
            display: block !important;
        }
        
        main section {
            display: none;
        }
        
        .profile-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
        }
        
        .modal-content {
            background-color: white;
            margin: 10% auto;
            padding: 20px;
            width: 80%;
            max-width: 500px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .flashcard {
            width: 200px;
            height: 200px;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.6s;
        }
        
        .flashcard.flipped {
            transform: rotateY(180deg);
        }
        
        .flashcard-front, .flashcard-back {
            width: 100%;
            height: 100%;
            position: absolute;
            backface-visibility: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .flashcard-back {
            transform: rotateY(180deg);
            background-color: #f8f8f8;
            font-size: 24px;
        }
        
        .matching-card {
            width: 80px;
            height: 80px;
            margin: 5px;
            perspective: 1000px;
            cursor: pointer;
        }
        
        .card-inner {
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.6s;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .matching-card.flipped .card-inner {
            transform: rotateY(180deg);
        }
        
        .card-front, .card-back {
            width: 100%;
            height: 100%;
            position: absolute;
            backface-visibility: hidden;
            border-radius: 8px;
        }
        
        .card-front {
            background-color: #3498db;
        }
        
        .card-back {
            background-color: white;
            transform: rotateY(180deg);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .matching-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            max-width: 360px;
            margin: 0 auto;
        }
        
        .celebration {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            justify-content: center;
            align-items: center;
            pointer-events: none;
        }
        
        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: #f39c12;
            animation: confetti-fall 3s ease-out forwards;
        }
        
        .confetti:nth-child(2) {
            background-color: #e74c3c;
            left: 30%;
            animation-delay: 0.2s;
        }
        
        .confetti:nth-child(3) {
            background-color: #3498db;
            left: 60%;
            animation-delay: 0.4s;
        }
        
        .confetti:nth-child(4) {
            background-color: #2ecc71;
            left: 80%;
            animation-delay: 0.6s;
        }
        
        .confetti:nth-child(5) {
            background-color: #9b59b6;
            left: 45%;
            animation-delay: 0.8s;
        }
        
        @keyframes confetti-fall {
            0% {
                top: -10px;
                transform: rotateZ(0deg);
            }
            100% {
                top: 100%;
                transform: rotateZ(720deg);
            }
        }
        
        .celebration .message {
            font-size: 48px;
            color: #f39c12;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            animation: message-appear 3s ease-out forwards;
        }
        
        @keyframes message-appear {
            0% {
                opacity: 0;
                transform: scale(0.5);
            }
            20% {
                opacity: 1;
                transform: scale(1.2);
            }
            80% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0.8);
            }
        }
        
        .letter-space {
            width: 30px;
            height: 30px;
            border: 2px solid #3498db;
            margin: 0 5px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
        }
        
        .letter-tile {
            width: 30px;
            height: 30px;
            background-color: #3498db;
            color: white;
            margin: 5px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            cursor: pointer;
            border-radius: 4px;
        }
        
        .letter-tile.used {
            background-color: #bdc3c7;
            cursor: not-allowed;
        }
        
        .word-container, .letter-bank {
            margin: 20px 0;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .color-option {
            width: 50px;
            height: 50px;
            margin: 10px;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .color-options {
            display: flex;
            justify-content: center;
            margin: 20px 0;
        }
        
        .animal-option {
            padding: 10px 20px;
            margin: 10px;
            background-color: #3498db;
            color: white;
            border-radius: 20px;
            cursor: pointer;
        }
        
        .animal-options {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin: 20px 0;
        }
        
        .hidden-animal {
            filter: brightness(0) contrast(0);
        }
        
        .correct {
            color: #2ecc71;
            font-weight: bold;
        }
        
        .incorrect {
            color: #e74c3c;
            font-weight: bold;
        }
        
        .badge {
            display: flex;
            margin: 10px;
            padding: 10px;
            border-radius: 8px;
            background-color: #f8f8f8;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .badge.locked {
            opacity: 0.5;
        }
        
        .badge.unlocked {
            background-color: #f9e076;
        }
        
        .badge-icon {
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #3498db;
            color: white;
            border-radius: 50%;
            margin-right: 10px;
        }
        
        .profile-avatar img {
            border-radius: 50%;
        }
    `;
    
    document.head.appendChild(style);
});
// Quiz and True/False Challenge Data
const quizQuestions = [
    {
        question: "Which animal says 'Moo'?",
        options: ["Cow", "Dog", "Cat", "Duck"],
        answer: "Cow"
    },
    {
        question: "What is 5 + 3?",
        options: ["7", "8", "9", "10"],
        answer: "8"
    },
    {
        question: "Which color is made by mixing blue and yellow?",
        options: ["Purple", "Orange", "Green", "Red"],
        answer: "Green"
    },
    {
        question: "How many sides does a triangle have?",
        options: ["3", "4", "5", "6"],
        answer: "3"
    },
    {
        question: "Which letter comes after 'D' in the alphabet?",
        options: ["A", "E", "F", "C"],
        answer: "E"
    },
    {
        question: "Which animal can fly?",
        options: ["Fish", "Bird", "Cat", "Elephant"],
        answer: "Bird"
    },
    {
        question: "What is 10 - 4?",
        options: ["4", "5", "6", "7"],
        answer: "6"
    },
    {
        question: "Which shape has no corners?",
        options: ["Square", "Triangle", "Circle", "Rectangle"],
        answer: "Circle"
    }
];

const trueFalseStatements = [
    {
        statement: "A square has 4 sides.",
        answer: true
    },
    {
        statement: "The sun is cold.",
        answer: false
    },
    {
        statement: "Fish can breathe underwater.",
        answer: true
    },
    {
        statement: "2 + 2 = 5",
        answer: false
    },
    {
        statement: "Dogs have feathers.",
        answer: false
    },
    {
        statement: "Triangles have 3 corners.",
        answer: true
    },
    {
        statement: "The sky is green.",
        answer: false
    },
    {
        statement: "Plants need water to grow.",
        answer: true
    }
];

// True/False game variables
let currentTFIndex = 0;
let tfScore = 0;
let tfAnswered = false;

// Get DOM elements
const tfStatement = document.getElementById('truefalse-statement');
const trueButton = document.getElementById('true-button');
const falseButton = document.getElementById('false-button');
const tfResult = document.getElementById('truefalse-result');
const nextTFButton = document.getElementById('next-truefalse');
const tfScoreDisplay = document.getElementById('truefalse-score');

// Initialize the game
function initTrueFalseGame() {
    // Display first question
    displayTFQuestion();
    
    // Add event listeners
    trueButton.addEventListener('click', () => checkTFAnswer(true));
    falseButton.addEventListener('click', () => checkTFAnswer(false));
    nextTFButton.addEventListener('click', nextTFQuestion);
}

// Display the current true/false question
function displayTFQuestion() {
    // Reset state for new question
    tfAnswered = false;
    tfResult.textContent = '';
    
    // Enable answer buttons
    trueButton.disabled = false;
    falseButton.disabled = false;
    
    // Remove any previous styling
    trueButton.classList.remove('correct', 'incorrect');
    falseButton.classList.remove('correct', 'incorrect');
    
    // Display the question
    tfStatement.textContent = trueFalseStatements[currentTFIndex].statement;
}

// Check the user's answer
function checkTFAnswer(userAnswer) {
    // Prevent answering more than once
    if (tfAnswered) return;
    
    tfAnswered = true;
    const correctAnswer = trueFalseStatements[currentTFIndex].answer;
    
    // Disable buttons after answer
    trueButton.disabled = true;
    falseButton.disabled = true;
    
    if (userAnswer === correctAnswer) {
        // Correct answer
        tfScore++;
        tfScoreDisplay.textContent = tfScore;
        tfResult.textContent = "Correct!";
        tfResult.className = "result correct";
        
        // Highlight the correct button
        if (correctAnswer) {
            trueButton.classList.add('correct');
        } else {
            falseButton.classList.add('correct');
        }
    } else {
        // Incorrect answer
        tfResult.textContent = "Wrong!";
        tfResult.className = "result incorrect";
        
        // Highlight the correct and incorrect buttons
        if (correctAnswer) {
            trueButton.classList.add('correct');
            falseButton.classList.add('incorrect');
        } else {
            falseButton.classList.add('correct');
            trueButton.classList.add('incorrect');
        }
    }
}

// Move to the next question
function nextTFQuestion() {
    // Only proceed if the current question has been answered
    if (!tfAnswered) {
        tfResult.textContent = "Please answer the current question first!";
        tfResult.className = "result";
        return;
    }
    
    // Move to the next question or cycle back to the beginning
    currentTFIndex = (currentTFIndex + 1) % trueFalseStatements.length;
    
    // Display the new question
    displayTFQuestion();
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initTrueFalseGame);

// Variables to track quiz state
let currentQuizQuestion = 0;
let quizScore = 0;
let selectedQuizOption = null;
let quizCorrectAnswers = 0;

// Variables to track true/false state
let currentTrueFalseStatement = 0;
let trueFalseScore = 0;
let selectedTrueFalse = null;
let tfCorrectAnswers = 0;

// Initialize quiz functionality
function initQuiz() {
    loadQuizQuestion();
    
    // Event listeners for quiz buttons
    document.getElementById('check-quiz').addEventListener('click', checkQuizAnswer);
    document.getElementById('next-quiz').addEventListener('click', nextQuizQuestion);
    
    // Update quiz badge when achievements are earned
    updateAchievementBadge('quiz-badge-5', quizCorrectAnswers, 5);
}

// Load a quiz question
function loadQuizQuestion() {
    const questionData = quizQuestions[currentQuizQuestion];
    document.getElementById('quiz-question').textContent = questionData.question;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    // Randomize option order
    const shuffledOptions = [...questionData.options].sort(() => Math.random() - 0.5);
    
    shuffledOptions.forEach((option) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.addEventListener('click', () => selectQuizOption(button, option));
        optionsContainer.appendChild(button);
    });
    
    // Reset result and selected option
    document.getElementById('quiz-result').textContent = '';
    document.getElementById('quiz-result').className = 'result';
    selectedQuizOption = null;
}

// Handle selection of a quiz option
function selectQuizOption(button, option) {
    // Remove selection from all buttons
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    
    // Add selection to clicked button
    button.classList.add('selected');
    selectedQuizOption = option;
}

// Check the quiz answer
function checkQuizAnswer() {
    if (!selectedQuizOption) {
        document.getElementById('quiz-result').textContent = 'Please select an answer!';
        document.getElementById('quiz-result').className = 'result warning';
        return;
    }
    
    const correctAnswer = quizQuestions[currentQuizQuestion].answer;
    const resultElement = document.getElementById('quiz-result');
    
    if (selectedQuizOption === correctAnswer) {
        resultElement.textContent = 'Correct! Great job!';
        resultElement.className = 'result correct';
        quizScore++;
        quizCorrectAnswers++;
        
        // Update score display and track achievement
        document.getElementById('quiz-score').textContent = quizScore;
        updateAchievementBadge('quiz-badge-5', quizCorrectAnswers, 5);
        
        // Show celebration animation
        showCelebration();
    } else {
        resultElement.textContent = `Incorrect. The answer is ${correctAnswer}.`;
        resultElement.className = 'result incorrect';
    }
    
    // Highlight correct and incorrect answers
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(button => {
        if (button.textContent === correctAnswer) {
            button.classList.add('correct');
        } else if (button.textContent === selectedQuizOption) {
            button.classList.add('incorrect');
        }
    });
}

// Move to the next quiz question
function nextQuizQuestion() {
    currentQuizQuestion = (currentQuizQuestion + 1) % quizQuestions.length;
    loadQuizQuestion();
}

// Initialize true/false functionality
function initTrueFalse() {
    loadTrueFalseStatement();
    
    // Event listeners for true/false buttons
    document.getElementById('true-button').addEventListener('click', () => selectTrueFalseOption(true));
    document.getElementById('false-button').addEventListener('click', () => selectTrueFalseOption(false));
    document.getElementById('next-truefalse').addEventListener('click', nextTrueFalseStatement);
    
    // Update true/false badge when achievements are earned
    updateAchievementBadge('truefalse-badge-5', tfCorrectAnswers, 5);
}

// Load a true/false statement
function loadTrueFalseStatement() {
    const statement = trueFalseStatements[currentTrueFalseStatement];
    document.getElementById('truefalse-statement').textContent = statement.statement;
    
    // Reset buttons and result
    document.getElementById('true-button').classList.remove('selected', 'correct', 'incorrect');
    document.getElementById('false-button').classList.remove('selected', 'correct', 'incorrect');
    document.getElementById('truefalse-result').textContent = '';
    document.getElementById('truefalse-result').className = 'result';
    
    selectedTrueFalse = null;
}

// Handle selection of true or false
function selectTrueFalseOption(isTrue) {
    // Store the selection
    selectedTrueFalse = isTrue;
    
    // Update button appearance
    document.getElementById('true-button').classList.remove('selected');
    document.getElementById('false-button').classList.remove('selected');
    
    if (isTrue) {
        document.getElementById('true-button').classList.add('selected');
    } else {
        document.getElementById('false-button').classList.add('selected');
    }
    
    // Check the answer immediately
    checkTrueFalseAnswer();
}

// Check the true/false answer
function checkTrueFalseAnswer() {
    const correctAnswer = trueFalseStatements[currentTrueFalseStatement].answer;
    const resultElement = document.getElementById('truefalse-result');
    
    if (selectedTrueFalse === correctAnswer) {
        resultElement.textContent = 'Correct! Great job!';
        resultElement.className = 'result correct';
        trueFalseScore++;
        tfCorrectAnswers++;
        
        // Update score display and track achievement
        document.getElementById('truefalse-score').textContent = trueFalseScore;
        updateAchievementBadge('truefalse-badge-5', tfCorrectAnswers, 5);
        
        // Show celebration animation
        showCelebration();
    } else {
        resultElement.textContent = 'Incorrect!';
        resultElement.className = 'result incorrect';
    }
    
    // Highlight buttons based on correctness
    if (correctAnswer === true) {
        document.getElementById('true-button').classList.add('correct');
        if (selectedTrueFalse === false) {
            document.getElementById('false-button').classList.add('incorrect');
        }
    } else {
        document.getElementById('false-button').classList.add('correct');
        if (selectedTrueFalse === true) {
            document.getElementById('true-button').classList.add('incorrect');
        }
    }
}

// Move to the next true/false statement
function nextTrueFalseStatement() {
    currentTrueFalseStatement = (currentTrueFalseStatement + 1) % trueFalseStatements.length;
    loadTrueFalseStatement();
}

// Function to update the Explorer badge (if user has tried all activities)
function updateExplorerBadge() {
    // You likely have this function already, so just add the quiz and true/false sections to it
    const sections = ['math', 'spelling', 'colors', 'animals', 'flashcards', 'matching', 'quiz', 'truefalse'];
    // Check if user has visited all sections and update the all-activities badge
}

// Add to your window.onload or DOMContentLoaded event handler
document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization code...
    
    // Initialize quiz and true/false sections
    initQuiz();
    initTrueFalse();
    
    // Add to your section navigation code to handle quiz and true/false sections
    // This assumes you already have code to handle navigation between sections
});
// Word Scramble Data
const wordScrambleData = [
    {
        word: "APPLE",
        category: "Fruit",
        clue: "Red or green, crunchy fruit",
        image: "assets/images/word scramble/Apple.png" 
    },
    {
        word: "TIGER",
        category: "Animal",
        clue: "Big cat with orange and black stripes",
        image: "assets/images/word scramble/tiger.png"
    },
    {
        word: "HOUSE",
        category: "Building",
        clue: "Where people live",
        image: "assets/images/word scramble/house.png"
    },
    {
        word: "RIVER",
        category: "Nature",
        clue: "Water that flows to the sea",
        image: "assets/images/word scramble/River.png"
    },
    {
        word: "CHAIR",
        category: "Furniture",
        clue: "You sit on it",
        image: "assets/images/word scramble/chair.png"
    },
    {
        word: "TRAIN",
        category: "Transport",
        clue: "Runs on tracks",
        image: "assets/images/word scramble/train.png"
    },
    {
        word: "PENCIL",
        category: "School",
        clue: "Used for writing and drawing",
        image: "assets/images/word scramble/pencil.png"
    },
    {
        word: "BANANA",
        category: "Fruit",
        clue: "Yellow curved fruit",
        image: "assets/images/word scramble/Banana.png"
    }

];

// Variables to track word scramble state
let currentWordIndex = 0;
let scrambleScore = 0;
let scrambleCorrectAnswers = 0;
let currentScrambledWord = [];
let isDraggingEnabled = true; // Set to false to use typing only mode

// Initialize word scramble functionality
function initWordScramble() {
    loadScrambledWord();
    
    // Event listeners for word scramble buttons
    document.getElementById('check-scramble').addEventListener('click', checkScrambleAnswer);
    document.getElementById('next-scramble').addEventListener('click', nextScrambledWord);
    document.getElementById('reveal-scramble').addEventListener('click', revealScrambleAnswer);
    document.getElementById('shuffle-scramble').addEventListener('click', shuffleScrambleLetters);
    
    // For typing method
    document.getElementById('typed-answer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkScrambleAnswer();
        }
    });
    
    // Update word scramble badge when achievements are earned
    updateAchievementBadge('wordscramble-badge-5', scrambleCorrectAnswers, 5);
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Load a scrambled word
function loadScrambledWord() {
    const wordData = wordScrambleData[currentWordIndex];
    
    // Set category, clue and image
    document.getElementById('word-category').textContent = wordData.category;
    document.getElementById('word-clue').textContent = wordData.clue;
    document.getElementById('scramble-image').src = wordData.image;
    document.getElementById('scramble-image').alt = `Hint for ${wordData.category}`;
    
    // Create scrambled letters
    const wordArray = wordData.word.split('');
    currentScrambledWord = shuffleArray([...wordArray]);
    
    // Reset result and input
    document.getElementById('scramble-result').textContent = '';
    document.getElementById('scramble-result').className = 'result';
    document.getElementById('typed-answer').value = '';
    
    // If using drag and drop functionality
    if (isDraggingEnabled) {
        setupDragDropInterface(wordArray.length, currentScrambledWord);
    }
}

// Set up drag and drop interface
function setupDragDropInterface(wordLength, scrambledLetters) {
    const scrambledContainer = document.getElementById('scrambled-letters');
    const answerContainer = document.getElementById('answer-spaces');
    
    // Clear previous content
    scrambledContainer.innerHTML = '';
    answerContainer.innerHTML = '';
    
    // Create letter tiles
    scrambledLetters.forEach((letter, index) => {
        const letterTile = document.createElement('div');
        letterTile.className = 'letter-tile';
        letterTile.textContent = letter;
        letterTile.dataset.letter = letter;
        letterTile.draggable = true;
        
        // Add drag events
        letterTile.addEventListener('dragstart', dragStart);
        letterTile.addEventListener('dragend', dragEnd);
        letterTile.addEventListener('click', tileClick);
        
        scrambledContainer.appendChild(letterTile);
    });
    
    // Create answer spaces
    for (let i = 0; i < wordLength; i++) {
        const answerSpace = document.createElement('div');
        answerSpace.className = 'answer-space';
        answerSpace.dataset.index = i;
        
        // Add drop events
        answerSpace.addEventListener('dragover', dragOver);
        answerSpace.addEventListener('dragenter', dragEnter);
        answerSpace.addEventListener('dragleave', dragLeave);
        answerSpace.addEventListener('drop', drop);
        
        answerContainer.appendChild(answerSpace);
    }
}

// Drag and drop functionality
function dragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.dataset.letter);
    e.dataTransfer.effectAllowed = 'move';
}

function dragEnd() {
    this.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
    return false;
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function dragLeave() {
    this.classList.remove('drag-over');
}

function drop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    const letter = e.dataTransfer.getData('text/plain');
    
    // Only allow drop if space is empty
    if (!this.textContent) {
        this.textContent = letter;
        this.classList.add('filled');
        
        // Hide the original letter tile
        const tiles = document.querySelectorAll('.letter-tile');
        for (const tile of tiles) {
            if (tile.dataset.letter === letter && !tile.classList.contains('used')) {
                tile.classList.add('used');
                tile.style.visibility = 'hidden';
                break;
            }
        }
    }
    
    return false;
}

// Click functionality for mobile support
function tileClick() {
    if (this.classList.contains('used')) return;
    
    const letter = this.dataset.letter;
    const answerSpaces = document.querySelectorAll('.answer-space');
    
    // Find first empty space
    for (const space of answerSpaces) {
        if (!space.textContent) {
            space.textContent = letter;
            space.classList.add('filled');
            this.classList.add('used');
            this.style.visibility = 'hidden';
            break;
        }
    }
}

// Check the scramble answer
function checkScrambleAnswer() {
    const wordData = wordScrambleData[currentWordIndex];
    const correctWord = wordData.word;
    let userAnswer = '';
    
    // Get answer based on input method
    if (isDraggingEnabled) {
        const answerSpaces = document.querySelectorAll('.answer-space');
        answerSpaces.forEach(space => {
            userAnswer += space.textContent || '';
        });
    } else {
        userAnswer = document.getElementById('typed-answer').value.toUpperCase();
    }
    
    const resultElement = document.getElementById('scramble-result');
    
    // Check if all spaces are filled
    if (isDraggingEnabled && userAnswer.length !== correctWord.length) {
        resultElement.textContent = 'Please fill all the spaces!';
        resultElement.className = 'result warning';
        return;
    }
    
    // Check if the answer is correct
    if (userAnswer === correctWord) {
        resultElement.textContent = 'Correct! Great job!';
        resultElement.className = 'result correct';
        scrambleScore++;
        scrambleCorrectAnswers++;
        
        // Update score display and track achievement
        document.getElementById('scramble-score').textContent = scrambleScore;
        updateAchievementBadge('wordscramble-badge-5', scrambleCorrectAnswers, 5);
        
        // Show celebration animation
        showCelebration();
        
        // Highlight all spaces as correct
        if (isDraggingEnabled) {
            const answerSpaces = document.querySelectorAll('.answer-space');
            answerSpaces.forEach(space => {
                space.classList.add('correct');
                space.classList.add('pulse-correct');
            });
        }
    } else {
        resultElement.textContent = 'Not quite right. Try again!';
        resultElement.className = 'result incorrect';
        
        // Highlight incorrect spaces
        if (isDraggingEnabled) {
            const answerSpaces = document.querySelectorAll('.answer-space');
            answerSpaces.forEach((space, index) => {
                if (space.textContent && space.textContent !== correctWord[index]) {
                    space.classList.add('incorrect');
                }
            });
        }
    }
}

// Move to the next scrambled word
function nextScrambledWord() {
    currentWordIndex = (currentWordIndex + 1) % wordScrambleData.length;
    loadScrambledWord();
}

// Reveal the correct answer
function revealScrambleAnswer() {
    const wordData = wordScrambleData[currentWordIndex];
    const correctWord = wordData.word;
    
    if (isDraggingEnabled) {
        // Clear answer spaces and reset letter tiles
        const answerSpaces = document.querySelectorAll('.answer-space');
        const letterTiles = document.querySelectorAll('.letter-tile');
        
        // Reset letter tiles
        letterTiles.forEach(tile => {
            tile.classList.remove('used');
            tile.style.visibility = 'visible';
        });
        
        // Fill answer spaces with correct letters
        answerSpaces.forEach((space, index) => {
            space.textContent = correctWord[index];
            space.className = 'answer-space filled';
        });
    } else {
        // Fill the input with the correct answer
        document.getElementById('typed-answer').value = correctWord;
    }
    
    // Show result message
    const resultElement = document.getElementById('scramble-result');
    resultElement.textContent = `The correct word is ${correctWord}.`;
    resultElement.className = 'result reveal';
}

// Shuffle the letters again
function shuffleScrambleLetters() {
    if (isDraggingEnabled) {
        // Clear answer spaces and reset letter tiles
        const answerSpaces = document.querySelectorAll('.answer-space');
        answerSpaces.forEach(space => {
            space.textContent = '';
            space.className = 'answer-space';
        });
        
        // Reshuffle and show all letter tiles
        const letterTiles = document.querySelectorAll('.letter-tile');
        letterTiles.forEach(tile => {
            tile.classList.remove('used');
            tile.style.visibility = 'visible';
        });
        
        // Reshuffle the order of tiles in the container
        const scrambledContainer = document.getElementById('scrambled-letters');
        const tiles = Array.from(scrambledContainer.children);
        shuffleArray(tiles).forEach(tile => scrambledContainer.appendChild(tile));
    } else {
        // Clear the input field
        document.getElementById('typed-answer').value = '';
        document.getElementById('typed-answer').focus();
    }
    
    // Clear result
    document.getElementById('scramble-result').textContent = '';
    document.getElementById('scramble-result').className = 'result';
}

// Update explorer badge (add this to your existing function)
function updateExplorerBadge() {
    // You likely have this function already, so just add the wordscramble section to it
    const sections = ['math', 'spelling', 'colors', 'animals', 'flashcards', 'matching', 'quiz', 'truefalse', 'wordscramble'];
    // Check if user has visited all sections and update the all-activities badge
}

// Add to your window.onload or DOMContentLoaded event handler
document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization code...
    
    // Initialize word scramble section
    initWordScramble();
    
    // Add to your section navigation code to handle word scramble section
    // This assumes you already have code to handle navigation between sections
});

// script.js - Add this code to your existing script.js file

// Object to track progress for each activity
const activityProgress = {
    'Math Fun': { completed: 0, total: 10, lastAttempted: null },
    'Spelling': { completed: 0, total: 10, lastAttempted: null },
    'Colors': { completed: 0, total: 8, lastAttempted: null },
    'Animals': { completed: 0, total: 12, lastAttempted: null },
    'Flashcards': { completed: 0, total: 20, lastAttempted: null },
    'Matching': { completed: 0, total: 15, lastAttempted: null },
    'Quiz': { completed: 0, total: 10, lastAttempted: null },
    'True/False': { completed: 0, total: 10, lastAttempted: null },
    'Word Scramble': { completed: 0, total: 12, lastAttempted: null }
};

// Initialize progress from localStorage if available
function initializeProgress() {
    const savedProgress = localStorage.getItem('kidsLearningProgress');
    if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        Object.keys(parsedProgress).forEach(activity => {
            if (activityProgress[activity]) {
                activityProgress[activity] = parsedProgress[activity];
            }
        });
    }
    updateProgressDisplay();
    updateDashboard();
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('kidsLearningProgress', JSON.stringify(activityProgress));
}

// Update progress for a specific activity
function updateActivityProgress(activityName, increment = 1) {
    if (activityProgress[activityName]) {
        activityProgress[activityName].completed += increment;
        activityProgress[activityName].lastAttempted = new Date().toISOString();
        if (activityProgress[activityName].completed > activityProgress[activityName].total) {
            activityProgress[activityName].completed = activityProgress[activityName].total;
        }
        saveProgress();
        updateProgressDisplay();
        updateDashboard();
    }
}

// Reset progress for a specific activity
function resetActivityProgress(activityName) {
    if (activityProgress[activityName]) {
        activityProgress[activityName].completed = 0;
        saveProgress();
        updateProgressDisplay();
        updateDashboard();
    }
}

// Calculate overall progress percentage
function calculateOverallProgress() {
    let totalCompleted = 0;
    let totalItems = 0;
    
    Object.values(activityProgress).forEach(activity => {
        totalCompleted += activity.completed;
        totalItems += activity.total;
    });
    
    return totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;
}

// Update progress display in the UI
function updateProgressDisplay() {
    const progressContainer = document.getElementById('progress-container');
    if (!progressContainer) {
        createProgressUI();
        return;
    }
    
    // Update overall progress
    const overallProgressBar = document.getElementById('overall-progress-bar');
    const overallProgressText = document.getElementById('overall-progress-text');
    const overallPercent = calculateOverallProgress();
    
    overallProgressBar.style.width = `${overallPercent}%`;
    overallProgressText.textContent = `${overallPercent}%`;
    
    // Update individual activity progress
    Object.keys(activityProgress).forEach(activity => {
        const activityElement = document.getElementById(`progress-${activity.replace(/\s+/g, '-').replace('/', '-')}-bar`);
        const activityTextElement = document.getElementById(`progress-${activity.replace(/\s+/g, '-').replace('/', '-')}-text`);
        
        if (activityElement && activityTextElement) {
            const percent = Math.round((activityProgress[activity].completed / activityProgress[activity].total) * 100);
            activityElement.style.width = `${percent}%`;
            activityTextElement.textContent = `${activityProgress[activity].completed}/${activityProgress[activity].total}`;
        }
    });
}

// Create the progress UI
function createProgressUI() {
    // Create progress container if it doesn't exist
    let progressContainer = document.getElementById('progress-container');
    if (!progressContainer) {
        progressContainer = document.createElement('div');
        progressContainer.id = 'progress-container';
        progressContainer.className = 'progress-container';
        
        // Create overall progress section
        const overallSection = document.createElement('div');
        overallSection.className = 'progress-section overall-progress';
        
        const overallTitle = document.createElement('h3');
        overallTitle.textContent = 'Overall Progress';
        
        const overallProgressWrapper = document.createElement('div');
        overallProgressWrapper.className = 'progress-wrapper';
        
        const overallProgressBar = document.createElement('div');
        overallProgressBar.id = 'overall-progress-bar';
        overallProgressBar.className = 'progress-bar';
        
        const overallProgressText = document.createElement('span');
        overallProgressText.id = 'overall-progress-text';
        overallProgressText.className = 'progress-text';
        overallProgressText.textContent = '0%';
        
        overallProgressWrapper.appendChild(overallProgressBar);
        overallProgressWrapper.appendChild(overallProgressText);
        
        overallSection.appendChild(overallTitle);
        overallSection.appendChild(overallProgressWrapper);
        
        progressContainer.appendChild(overallSection);
        
        // Create activity progress sections
        const activitiesSection = document.createElement('div');
        activitiesSection.className = 'activities-progress';
        
        const activitiesTitle = document.createElement('h3');
        activitiesTitle.textContent = 'Activities Progress';
        activitiesSection.appendChild(activitiesTitle);
        
        Object.keys(activityProgress).forEach(activity => {
            const activitySection = document.createElement('div');
            activitySection.className = 'progress-section activity-progress';
            
            const activityTitle = document.createElement('h4');
            activityTitle.textContent = activity;
            
            const activityProgressWrapper = document.createElement('div');
            activityProgressWrapper.className = 'progress-wrapper';
            
            const activityProgressBar = document.createElement('div');
            activityProgressBar.id = `progress-${activity.replace(/\s+/g, '-').replace('/', '-')}-bar`;
            activityProgressBar.className = 'progress-bar';
            
            const activityProgressText = document.createElement('span');
            activityProgressText.id = `progress-${activity.replace(/\s+/g, '-').replace('/', '-')}-text`;
            activityProgressText.className = 'progress-text';
            activityProgressText.textContent = `0/${activityProgress[activity].total}`;
            
            activityProgressWrapper.appendChild(activityProgressBar);
            activityProgressWrapper.appendChild(activityProgressText);
            
            activitySection.appendChild(activityTitle);
            activitySection.appendChild(activityProgressWrapper);
            
            activitiesSection.appendChild(activitySection);
        });
        
        progressContainer.appendChild(activitiesSection);
        
        // Add to the document
        document.body.appendChild(progressContainer);
    }
    
    updateProgressDisplay();
}

// Update the dashboard with latest progress
function updateDashboard() {
    // Update the user level based on progress
    const overallPercent = calculateOverallProgress();
    const userLevel = Math.floor(overallPercent / 10) + 1; // Level increases every 10%
    
    const userLevelElement = document.querySelector('.guest-info .level');
    if (userLevelElement) {
        userLevelElement.textContent = `Level: ${userLevel}`;
    }
    
    // Add badges or achievements based on progress
    updateBadges();
}

// Update badges based on achievements
function updateBadges() {
    const badgesContainer = document.getElementById('badges-container');
    if (!badgesContainer) {
        return;
    }
    
    // Clear existing badges
    badgesContainer.innerHTML = '';
    
    // Check for completed activities and add badges
    Object.keys(activityProgress).forEach(activity => {
        const progress = activityProgress[activity];
        if (progress.completed === progress.total) {
            const badge = document.createElement('div');
            badge.className = 'badge';
            badge.innerHTML = `<span class="badge-icon">🏆</span> ${activity} Master`;
            badgesContainer.appendChild(badge);
        }
    });
}

// Add click event listeners to activity buttons
function setupActivityListeners() {
    const activityButtons = document.querySelectorAll('.activity-button');
    activityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const activityName = this.textContent.trim();
            // When an activity is clicked, you'd normally start the activity
            // For this demo, we'll just increment the progress
            updateActivityProgress(activityName);
        });
    });
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProgress();
    setupActivityListeners();
    
    // Create a badges container if it doesn't exist
    if (!document.getElementById('badges-container')) {
        const badgesContainer = document.createElement('div');
        badgesContainer.id = 'badges-container';
        badgesContainer.className = 'badges-container';
        
        // Add it near the user profile
        const userProfile = document.querySelector('.guest-info');
        if (userProfile) {
            userProfile.parentNode.insertBefore(badgesContainer, userProfile.nextSibling);
        } else {
            document.body.appendChild(badgesContainer);
        }
    }
    
    // Create progress button in the menu
    const menuArea = document.querySelector('.menu') || document.body;
    const progressButton = document.createElement('button');
    progressButton.className = 'progress-button';
    progressButton.textContent = 'My Progress';
    progressButton.addEventListener('click', function() {
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.style.display = progressContainer.style.display === 'none' ? 'block' : 'none';
        }
    });
    
    menuArea.appendChild(progressButton);
});

// At the end of a math exercise or quiz
function finishMathActivity(score) {
    // Award points based on score (1-10)
    const pointsToAward = score * 5; // 5 points per correct answer
    
    // Call the shared function
    if (typeof completeActivity === 'function') {
        completeActivity("Math Fun", pointsToAward);
    } else if (typeof awardPoints === 'function') {
        // Fallback if completeActivity isn't available
        awardPoints(pointsToAward);
        if (pointsToAward >= 10) {
            awardBadge("Math Star");
        }
    }
}

// Bunny Nova functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bunny Nova once the DOM is fully loaded
    initBunnyNova();
  });
  
  function initBunnyNova() {
    // Check if elements exist
    if (!document.getElementById('bunny-speech')) return;
    
    // Speech content
    const speeches = {
      intro: "Hello! I'm Bunny Nova, your friendly robot guide to Fun Learning World! Fun Learning World is an interactive educational platform designed specifically for young learners. This child-friendly app provides a comprehensive suite of engaging learning activities across multiple subjects including mathematics, language, arts, and science.With a playful interface guided by Bunny Nova, children can explore various educational games that make learning enjoyable while building fundamental skills. The app features a progress tracking system that motivates learners through levels and achievements. Fun Learning World transforms education into an exciting adventure through colorful visuals, interactive challenges, and a variety of learning modes including quizzes, matching games, flashcards, videos, and creative activities like drawing and music. I'm here to help you explore all the amazing learning activities and games. With my help, learning becomes an exciting adventure!" ,
      features: "Fun Learning World has so many cool features! Math games, spelling challenges, animal facts, and much more! You can learn about colors, practice with flashcards, enjoy story time, and even create music! Click on any button in the app to start a fun learning activity!",
      outcomes: "Using Fun Learning World with me, Bunny Nova, will help you become smarter in many ways! You'll get better at math, reading, problem-solving, and creativity. I'll cheer you on as you learn and grow! Learning is much more fun when we do it together!"
    };
    
    // Feature cards content
    const featuresHTML = `
      <h2>Fun Learning World Features</h2>
      <div class="feature-card">
        <div class="feature-title">Math Fun</div>
        <p>Interactive math games that teach addition, subtraction, multiplication and division in a fun way!</p>
      </div>
      <div class="feature-card">
        <div class="feature-title">Spelling</div>
        <p>Learn to spell common words with engaging activities that improve language skills.</p>
      </div>
      <div class="feature-card">
        <div class="feature-title">Colors</div>
        <p>Explore and learn all about colors through interactive games and activities.</p>
      </div>
      <div class="feature-card">
        <div class="feature-title">Animals</div>
        <p>Discover amazing facts about animals from around the world!</p>
      </div>
      <!-- Add more feature cards as needed -->
    `;
    
    // Outcomes content
    const outcomesHTML = `
      <h2>Learning Outcomes with Bunny Nova</h2>
      <div class="outcome-item">Improves cognitive development through interactive learning</div>
      <div class="outcome-item">Builds essential math skills and number sense</div>
      <div class="outcome-item">Enhances language and literacy development</div>
      <div class="outcome-item">Develops problem-solving and critical thinking abilities</div>
      <div class="outcome-item">Boosts memory and concentration</div>
      <div class="outcome-item">Encourages creativity and self-expression</div>
      <div class="outcome-item">Provides personalized learning experiences based on level</div>
      <div class="outcome-item">Builds confidence through achievement and positive reinforcement</div>
    `;
    
    // Populate content
    document.getElementById('bunny-features').innerHTML = featuresHTML;
    document.getElementById('bunny-outcomes').innerHTML = outcomesHTML;
    
    // Button event listeners
    document.getElementById('intro-btn').addEventListener('click', function() {
      document.getElementById('bunny-speech').textContent = speeches.intro;
      document.getElementById('bunny-features').classList.add('hidden');
      document.getElementById('bunny-outcomes').classList.add('hidden');
      speak(speeches.intro);
      animateEyes();
    });
    
    document.getElementById('features-btn').addEventListener('click', function() {
      document.getElementById('bunny-speech').textContent = speeches.features;
      document.getElementById('bunny-features').classList.remove('hidden');
      document.getElementById('bunny-outcomes').classList.add('hidden');
      speak(speeches.features);
      animateEyes();
    });
    
    document.getElementById('outcomes-btn').addEventListener('click', function() {
      document.getElementById('bunny-speech').textContent = speeches.outcomes;
      document.getElementById('bunny-features').classList.add('hidden');
      document.getElementById('bunny-outcomes').classList.remove('hidden');
      speak(speeches.outcomes);
      animateEyes();
    });
    
    // Speech synthesis
    function speak(text) {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const speech = new SpeechSynthesisUtterance(text);
        speech.rate = 0.9;  // Slightly slower for kids
        speech.pitch = 1.2; // Slightly higher pitch for a friendly robot voice
        window.speechSynthesis.speak(speech);
      }
    }
    
    // Animation for eyes
    function animateEyes() {
      const eyes = document.querySelectorAll('.bunny-eye');
      eyes.forEach(eye => {
        eye.classList.add('blinking');
        setTimeout(() => {
          eye.classList.remove('blinking');
        }, 1500);
      });
    }
    
    // Start with intro after a short delay
    setTimeout(() => {
      speak(speeches.intro);
      animateEyes();
    }, 1000);
  }